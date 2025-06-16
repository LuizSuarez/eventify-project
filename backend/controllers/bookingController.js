// const Booking = require('../models/Booking');
// const Venue = require('../models/Venue');
// const Service = require('../models/Service');

// exports.createBooking = async (req, res) => {
//   try {
//     const { venue, service, date, numberOfGuests } = req.body;

//     if (!venue && !service) {
//       return res.status(400).json({ msg: 'Either venue or service must be selected.' });
//     }

//     const booking = new Booking({
//       user: req.user._id,
//       venue: venue || null,
//       service: service || null,
//       date,
//       numberOfGuests,
//       status: 'Pending',         // Default status
//       paymentStatus: 'Unpaid'    // Default payment status
//     });

//     await booking.save();
//     res.status(201).json({ msg: 'Booking request sent successfully', booking });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Booking failed' });
//   }
// };


// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const { action } = req.body;

//     const booking = await Booking.findById(bookingId)
//       .populate('venue', 'owner')
//       .populate('service', 'owner')
//       .populate('user', 'name email');

//     if (!booking) {
//       return res.status(404).json({ 
//         success: false,
//         msg: 'Booking not found' 
//       });
//     }

//     // Verify ownership
//     const isVenueOwner = booking.venue?.owner?.toString() === req.user._id.toString();
//     const isServiceOwner = booking.service?.owner?.toString() === req.user._id.toString();
    
//     if (!isVenueOwner && !isServiceOwner) {
//       return res.status(403).json({ 
//         success: false,
//         msg: 'Not authorized to update this booking' 
//       });
//     }

//     // Validate status transition
//     const validTransitions = {
//       Pending: ['Approved', 'Rejected'],
//       Approved: ['Confirmed', 'Cancelled'],
//       Rejected: []
//     };

//     let newStatus;
//     if (action === 'approve') {
//       newStatus = booking.status === 'Pending' ? 'Approved' : 'Confirmed';
//     } else if (action === 'reject') {
//       newStatus = 'Rejected';
//     } else if (action === 'cancel') {
//       newStatus = 'Cancelled';
//     } else {
//       return res.status(400).json({ 
//         success: false,
//         msg: 'Invalid action' 
//       });
//     }

//     if (!validTransitions[booking.status]?.includes(newStatus)) {
//       return res.status(400).json({ 
//         success: false,
//         msg: `Cannot change status from ${booking.status} to ${newStatus}`
//       });
//     }

//     booking.status = newStatus;
//     await booking.save();

//     res.json({ 
//       success: true,
//       msg: `Booking ${newStatus.toLowerCase()} successfully`,
//       booking 
//     });

//   } catch (err) {
//     console.error('Error updating booking:', err);
//     res.status(500).json({ 
//       success: false,
//       msg: 'Failed to update booking status',
//       error: err.message 
//     });
//   }
// };

// exports.getUserBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id })
//       .populate('venue', 'name location')
//       .populate('service', 'name type');

//     res.json(bookings);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Failed to fetch bookings' });
//   }
// };


// exports.getVenueBookings = async (req, res) => {
//     try {
//         const { venues } = req.query; // Expects a comma-separated string or JSON string of venue IDs
//         let venueIds = [];

//         if (venues) {
//             try {
//                 // Attempt to parse as JSON array first (as your frontend sends it)
//                 venueIds = JSON.parse(venues);
//             } catch (jsonError) {
//                 // Fallback for comma-separated IDs
//                 venueIds = venues.split(',');
//             }
//         } else {
//             return res.status(400).json({ msg: 'Venue IDs are required to fetch bookings.' });
//         }

//         // Find venues owned by the current user to ensure authorization
//         const userVenues = await Venue.find({ _id: { $in: venueIds }, owner: req.user._id });
//         const authorizedVenueIds = userVenues.map(venue => venue._id);

//         if (authorizedVenueIds.length === 0) {
//             return res.status(403).json({ msg: 'Not authorized to view bookings for these venues or no such venues exist for this user.' });
//         }

//         const bookings = await Booking.find({ venue: { $in: authorizedVenueIds } })
//             .populate('user', 'name email')
//             .populate('venue', 'name location')
//             .populate('service', 'name type'); // Populate service if it's possible for bookings to have services

//         res.json({ success: true, data: bookings });
//     } catch (err) {
//         console.error('Error fetching venue bookings:', err);
//         res.status(500).json({ msg: 'Failed to fetch venue bookings', error: err.message });
//     }
// };





const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Service = require('../models/Service');
const sendEmail = require('../utils/sendEmail'); // Import your email sending utility
const {
  getBookingApprovedEmail,
  getBookingRejectedEmail,
  getBookingConfirmedEmail,
  getBookingCancelledEmail // Import the new cancellation template
} = require('../utils/emailTemplates'); // Import your email templates

exports.createBooking = async (req, res) => {
  try {
    const { venue, service, date, numberOfGuests } = req.body;

    if (!venue && !service) {
      return res.status(400).json({ msg: 'Either venue or service must be selected.' });
    }

    const booking = new Booking({
      user: req.user._id,
      venue: venue || null,
      service: service || null,
      date,
      numberOfGuests,
      status: 'Pending',         // Default status
      paymentStatus: 'Unpaid'    // Default payment status
    });

    await booking.save();
    res.status(201).json({ msg: 'Booking request sent successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Booking failed' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body;

    // Populate user, venue, and service details for the email
    const booking = await Booking.findById(bookingId)
      .populate('venue', 'owner name location') // Need owner for auth, name for email
      .populate('service', 'owner name type')   // Need owner for auth, name for email
      .populate('user', 'name email');          // Need name and email for the customer

    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    // Verify ownership
    const isVenueOwner = booking.venue && booking.venue.owner.toString() === req.user._id.toString();
    const isServiceOwner = booking.service && booking.service.owner.toString() === req.user._id.toString();

    // The manager of the venue/service associated with the booking
    const ownerId = booking.venue ? booking.venue.owner : booking.service ? booking.service.owner : null;

    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: 'Not authorized to update this booking: You are not the owner of the associated venue or service.'
      });
    }

    // Validate status transition
    const validTransitions = {
      Pending: ['Approved', 'Rejected'],
      Approved: ['Confirmed', 'Cancelled'],
      Rejected: ['Cancelled'], // Allow rejected bookings to be explicitly cancelled if needed
      Confirmed: ['Cancelled'],
      Cancelled: []
    };

    let newStatus;
    if (action === 'approve') {
      newStatus = booking.status === 'Pending' ? 'Approved' : 'Confirmed'; // Approve a pending, confirm an approved (e.g. after payment)
    } else if (action === 'reject') {
      newStatus = 'Rejected';
    } else if (action === 'cancel') {
      newStatus = 'Cancelled';
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Invalid action'
      });
    }

    if (!validTransitions[booking.status]?.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        msg: `Cannot change status from ${booking.status} to ${newStatus}`
      });
    }

    const oldStatus = booking.status; // Store old status before updating
    booking.status = newStatus;
    await booking.save();

    // --- Send Email Notification based on newStatus ---
    if (booking.user && booking.user.email) {
      const customerEmail = booking.user.email;
      const customerName = booking.user.name;
      const bookingItemName = booking.venue?.name || booking.service?.name || 'Unknown Item';
      const isVenueBooking = !!booking.venue; 
      const formattedBookingDate = new Date(booking.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      let emailSubject;
      let emailHtmlContent;

      if (newStatus === 'Approved') {
        emailSubject = `Your Booking for ${bookingItemName} has been Approved! 🎉`;
        emailHtmlContent = getBookingApprovedEmail(customerName, bookingItemName, formattedBookingDate, isVenueBooking);
      } else if (newStatus === 'Rejected') {
        emailSubject = `Update: Your Booking for ${bookingItemName} has been Rejected. 😔`;
        emailHtmlContent = getBookingRejectedEmail(customerName, bookingItemName, formattedBookingDate, isVenueBooking);
      } else if (newStatus === 'Confirmed' && oldStatus === 'Approved') { 
        emailSubject = `Your Booking for ${bookingItemName} is Confirmed! ✅`;
        emailHtmlContent = getBookingConfirmedEmail(customerName, bookingItemName, formattedBookingDate, isVenueBooking);
      } else if (newStatus === 'Cancelled') {
        emailSubject = `Your Booking for ${bookingItemName} has been Cancelled.`;
        emailHtmlContent = getBookingCancelledEmail(customerName, bookingItemName, formattedBookingDate, isVenueBooking);
      }

      if (emailSubject && emailHtmlContent) {
        await sendEmail(customerEmail, emailSubject, emailHtmlContent);
      }
    }
    // ----------------------------------------------------

    res.json({
      success: true,
      msg: `Booking ${newStatus.toLowerCase()} successfully`,
      booking
    });

  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({
      success: false,
      msg: 'Failed to update booking status',
      error: err.message
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('venue', 'name location')
      .populate('service', 'name type');

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
};


exports.getVenueBookings = async (req, res) => {
  try {
    const { venues } = req.query; // Expects a comma-separated string or JSON string of venue IDs
    let venueIds = [];

    if (venues) {
      try {
        // Attempt to parse as JSON array first (as your frontend sends it)
        venueIds = JSON.parse(venues);
      } catch (jsonError) {
        // Fallback for comma-separated IDs
        venueIds = venues.split(',');
      }
    } else {
      return res.status(400).json({ msg: 'Venue IDs are required to fetch bookings.' });
    }

    // Find venues owned by the current user to ensure authorization
    const userVenues = await Venue.find({ _id: { $in: venueIds }, owner: req.user._id });
    const authorizedVenueIds = userVenues.map(venue => venue._id);

    if (authorizedVenueIds.length === 0) {
      return res.status(403).json({ msg: 'Not authorized to view bookings for these venues or no such venues exist for this user.' });
    }

    const bookings = await Booking.find({ venue: { $in: authorizedVenueIds } })
      .populate('user', 'name email')
      .populate('venue', 'name location')
      .populate('service', 'name type'); // Populate service if it's possible for bookings to have services

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error('Error fetching venue bookings:', err);
    res.status(500).json({ msg: 'Failed to fetch venue bookings', error: err.message });
  }
};