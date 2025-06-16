const Service = require('../models/Service');
const Booking = require('../models/Booking');


exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load services' });
  }
};


// GET all services by current provider
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user._id });
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Failed to load services' });
  }
};

//get service by id
exports.getServiceById = async (req, res) => {
  try {
    console.log('Fetching service by ID:', req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      console.log('Service not found');
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error in getServiceById:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// POST add a new service
exports.addService = async (req, res) => {
  const { name, type, description, price, images } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    const newService = new Service({
      name,
      type,
      description,
      price,
      images: Array.isArray(images) ? images : [],
      owner: req.user._id
    });

    await newService.save();
    res.status(201).json(newService);
  } catch {
    res.status(500).json({ message: 'Failed to create service' });
  }
};

// PUT update service
exports.updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const updateFields = ['name', 'type', 'description', 'price', 'images'];
    const updateData = {};

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updatedService = await Service.findOneAndUpdate(
      { _id: serviceId, owner: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch {
    res.status(500).json({ message: 'Failed to update service' });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const existingBookings = await Booking.find({ service: serviceId });
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Cannot delete service with bookings' });
    }

    const deleted = await Service.findOneAndDelete({ _id: serviceId, owner: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Service not found' });

    res.json({ message: 'Service deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete service' });
  }
};

// GET bookings of services by current provider
exports.getMyServiceBookings = async (req, res) => {
  try {
    const myServices = await Service.find({ owner: req.user._id }).select('_id');
    const serviceIds = myServices.map(s => s._id);

    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate('service', 'name type')
      .populate('user', 'name email');

    res.json(bookings);
  } catch {
    res.status(500).json({ message: 'Failed to load service bookings' });
  }
};


