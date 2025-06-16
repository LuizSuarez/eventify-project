const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllVenues,
  getAllServices,
  bookVenue,
  bookService,
} = require('../controllers/userDashboardController');

// Protect routes for logged-in users with role "user"
router.use(protect, authorize('user'));

router.get('/venues', getAllVenues);
router.get('/services', getAllServices);
router.post('/book-venue/:venueId', bookVenue);
router.post('/book-service/:serviceId', bookService);

module.exports = router;
