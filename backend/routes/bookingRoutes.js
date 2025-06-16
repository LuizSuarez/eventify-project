const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, updateBookingStatus, getVenueBookings  } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create new booking
router.post('/', protect, createBooking);

// Get all bookings for logged-in user
router.get('/my', protect, getUserBookings);

router.get('/', protect, getVenueBookings);



router.put('/:bookingId/status', protect, updateBookingStatus);


module.exports = router;
