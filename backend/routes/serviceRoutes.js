
const express = require('express');
const router = express.Router();
const {
  getMyServices,
  addService,
  updateService,
  deleteService,
  getMyServiceBookings,
  getAllServices,
  getServiceById
} = require('../controllers/serviceController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes (no auth required) 
router.get('/', getAllServices);  

router.get('/my-services', protect, authorize('provider'), getMyServices);
router.get('/my-bookings', protect, authorize('provider'), getMyServiceBookings);

// Get service by ID
router.get('/:id', getServiceById);

//Protected routes for providers only
router.use(protect, authorize('provider'));

router.post('/add', addService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);


module.exports = router;
