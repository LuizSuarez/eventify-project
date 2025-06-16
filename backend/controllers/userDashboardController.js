const Venue = require('../models/Venue');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// GET all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().populate('owner', 'name email');
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch venues' });
  }
};

// GET all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('owner', 'name email');
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// POST book a venue
exports.bookVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { date, notes } = req.body;
    const booking = new Booking({
      user: req.user._id,
      venue: venueId,
      status: 'pending',
      date,
      notes,
    });
    await booking.save();
    res.status(201).json({ message: 'Venue booking request sent', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to book venue' });
  }
};

// POST book a service
exports.bookService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date, notes } = req.body;
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      status: 'pending',
      date,
      notes,
    });
    await booking.save();
    res.status(201).json({ message: 'Service booking request sent', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to book service' });
  }
};
