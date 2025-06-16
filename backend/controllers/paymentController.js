
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking'); 
const User = require('../models/User');     
const Venue = require('../models/Venue');  
const Service = require('../models/Service'); 
const sendEmail = require('../utils/sendEmail'); // Import your email sending utility
const { getBookingConfirmedEmail } = require('../utils/emailTemplates');

exports.createCheckoutSession = async (req, res) => {
    const { bookingId } = req.body;
    const userId = req.user._id; 

    try {
        const booking = await Booking.findById(bookingId)
            .populate('venue') 
            .populate('service'); 

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ msg: 'Not authorized to pay for this booking.' });
        }

        if (booking.status !== 'Approved') {
            return res.status(400).json({ msg: 'Booking is not approved. Cannot proceed with payment.' });
        }

        if (booking.paymentStatus === 'Paid') {
            return res.status(400).json({ msg: 'This booking has already been paid.' });
        }

        let itemName;
        let itemDescription;
        let itemPrice;
        let currency = 'pkr'; 

        if (booking.venue) {
            itemName = booking.venue.name;
            itemDescription = `Booking for venue: ${booking.venue.name}`;
            
            itemPrice = Math.round(booking.venue.price * booking.numberOfGuests * 1); // Adjust calculation as per your pricing model
            currency = 'pkr';
        } else if (booking.service) {
            itemName = booking.service.name;
            itemDescription = `Booking for service: ${booking.service.name}`;
            itemPrice = Math.round(booking.service.price * booking.numberOfGuests * 1); // Adjust calculation
            currency = 'pkr'; 
        } else {
            return res.status(400).json({ msg: 'Booking must be for a venue or a service.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: itemName,
                            description: itemDescription,
                        },
                        unit_amount: itemPrice,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/dashboard/user?payment=success&bookingId=${booking._id}`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard/user?payment=cancelled&bookingId=${booking._id}`,
            metadata: {
                bookingId: booking._id.toString(),
                userId: userId.toString(),
            },
        });

        res.json({ checkoutUrl: session.url });

    } catch (err) {
        console.error('Error creating Stripe checkout session:', err);
        res.status(500).json({ msg: 'Failed to create payment session', error: err.message });
    }
};

// exports.handleStripeWebhook = async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
//     } catch (err) {
//         console.error(`Webhook Error: ${err.message}`);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object;
//             const { bookingId } = session.metadata;

//             try {
//                 const booking = await Booking.findById(bookingId);

//                 if (booking && booking.paymentStatus !== 'Paid') {
//                     booking.paymentStatus = 'Paid';
//                     // Optionally change booking status to 'Confirmed' if not already
//                     if (booking.status === 'Approved') {
//                         booking.status = 'Confirmed';
//                     }
//                     await booking.save();
//                     console.log(`Booking ${bookingId} marked as Paid and Confirmed.`);
//                 }
//             } catch (err) {
//                 console.error(`Error updating booking ${bookingId} after payment:`, err);
   
//             }
//             break;
//         case 'checkout.session.async_payment_failed':
//             const failedSession = event.data.object;
//             console.log(`Payment failed for session ${failedSession.id}`);
           
//             break;
        
//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
// };

// ... (previous code)

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { bookingId } = session.metadata;

            try {
                const booking = await Booking.findById(bookingId)
                    .populate('user', 'name email') // Populate user for email
                    .populate('venue', 'name')     // Populate venue/service for email
                    .populate('service', 'name');  // Populate venue/service for email

                if (booking && booking.paymentStatus !== 'Paid') {
                    booking.paymentStatus = 'Paid';
                    const oldStatus = booking.status; // Store old status
                    if (booking.status === 'Approved') {
                        booking.status = 'Confirmed';
                    }
                    await booking.save();
                    console.log(`Booking ${bookingId} marked as Paid and Confirmed.`);

                    // --- Send Confirmation Email from Webhook ---
                    if (booking.user && booking.user.email && booking.status === 'Confirmed' && oldStatus === 'Approved') {
                        const customerEmail = booking.user.email;
                        const customerName = booking.user.name;
                        const bookingItemName = booking.venue?.name || booking.service?.name || 'Unknown Item';
                        const isVenueBooking = !!booking.venue;
                        const formattedBookingDate = new Date(booking.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        const emailSubject = `Your Booking for ${bookingItemName} is Confirmed! ✅`;
                        const emailHtmlContent = getBookingConfirmedEmail(customerName, bookingItemName, formattedBookingDate, isVenueBooking);

                        await sendEmail(customerEmail, emailSubject, emailHtmlContent);
                        console.log(`Confirmation email sent for booking ${bookingId}`);
                    }
                }
            } catch (err) {
                console.error(`Error updating booking ${bookingId} after payment:`, err);

            }
            break;
        case 'checkout.session.async_payment_failed':
            const failedSession = event.data.object;
            console.log(`Payment failed for session ${failedSession.id}`);

            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};