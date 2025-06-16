

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllVenues,
  getVenueById,
  getMyVenues,
  addVenue,
  updateVenue,
  deleteVenue,
  getMyBookings
} = require('../controllers/venueController');

// Public routes
router.get('/', getAllVenues);

// Specific routes should come before parameterized routes
router.get('/my-venues', protect, authorize('venue'), getMyVenues);
router.get('/my-bookings', protect, authorize('venue'), getMyBookings);

// Parameterized routes come after specific routes
router.get('/:id', getVenueById);

// Protected routes for venue owners only
router.use(protect, authorize('venue'));

router.post('/', addVenue);
router.put('/:id', updateVenue);
router.delete('/:id', deleteVenue);

module.exports = router;