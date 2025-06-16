// const Venue = require('../models/Venue');
// const Booking = require('../models/Booking');

// // Public: Get all venues
// exports.getAllVenues = async (req, res) => {
//   try {
//     const venues = await Venue.find();
//     res.json(venues);
//   } catch {
//     res.status(500).json({ message: 'Failed to load venues' });
//   }
// };

// // Public: Get a venue by ID
// exports.getVenueById = async (req, res) => {
//   try {
//     const venue = await Venue.findById(req.params.id);
//     if (!venue) return res.status(404).json({ message: 'Venue not found' });
//     res.json(venue);
//   } catch {
//     res.status(500).json({ message: 'Error fetching venue' });
//   }
// };

// exports.getMyVenues = async (req, res) => {
//   try {
//     const venues = await Venue.find({ owner: req.user._id });
//     res.json(venues);
//   } catch {
//     res.status(500).json({ message: 'Failed to load venues' });
//   }
// };

// exports.addVenue = async (req, res) => {
//   const { name, location, capacity, price, description, images } = req.body;
//   if (!name || !location || !capacity || !price) {
//     return res.status(400).json({ message: 'Name, location, capacity & price are required' });
//   }
//   try {
//     const v = new Venue({ name, location, capacity, price, description, images: images || [], owner: req.user._id });
//     await v.save();
//     res.status(201).json(v);
//   } catch {
//     res.status(500).json({ message: 'Failed to create venue' });
//   }
// };

// exports.deleteVenue = async (req, res) => {
//   try {
//     const existing = await Booking.find({ venue: req.params.id });
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Cannot delete venue with bookings' });
//     }
//     const deleted = await Venue.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
//     if (!deleted) return res.status(404).json({ message: 'Venue not found' });
//     res.json({ message: 'Venue deleted' });
//   } catch {
//     res.status(500).json({ message: 'Failed to delete venue' });
//   }
// };

// exports.getMyBookings = async (req, res) => {
//   try {
//     const myVenues = await Venue.find({ owner: req.user._id }).select('_id');
//     const venueIds = myVenues.map(v => v._id);
//     const bookings = await Booking.find({ venue: { $in: venueIds } })
//       .populate('venue', 'name')
//       .populate('user', 'name email');
//     res.json(bookings);
//   } catch {
//     res.status(500).json({ message: 'Failed to load bookings' });
//   }
// }; 

const Venue = require('../models/Venue');
const Booking = require('../models/Booking');

// Public: Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    console.log('Fetching all venues...');
    const venues = await Venue.find();
    console.log(`Found ${venues.length} venues`);
    res.json(venues);
  } catch (error) {
    console.error('Error in getAllVenues:', error);
    res.status(500).json({ message: 'Failed to load venues', error: error.message });
  }
};

// Public: Get a venue by ID
exports.getVenueById = async (req, res) => {
  try {
    console.log('Fetching venue by ID:', req.params.id);
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      console.log('Venue not found');
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    console.error('Error in getVenueById:', error);
    res.status(500).json({ message: 'Error fetching venue', error: error.message });
  }
};

exports.getMyVenues = async (req, res) => {
  try {
    console.log('Fetching venues for user:', req.user._id);
    const venues = await Venue.find({ owner: req.user._id });
    console.log(`Found ${venues.length} venues for user`);
    res.json(venues);
  } catch (error) {
    console.error('Error in getMyVenues:', error);
    res.status(500).json({ message: 'Failed to load venues', error: error.message });
  }
};

exports.addVenue = async (req, res) => {
  try {
    console.log('Adding new venue:', req.body);
    console.log('User ID:', req.user._id);
    
    const { name, location, capacity, price, description, images } = req.body;
    
    if (!name || !location || !capacity || !price) {
      return res.status(400).json({ 
        message: 'Name, location, capacity & price are required',
        received: { name, location, capacity, price }
      });
    }

    const venueData = { 
      name, 
      location, 
      capacity: Number(capacity), 
      price: Number(price), 
      description, 
      images: images || [], 
      owner: req.user._id 
    };

    console.log('Creating venue with data:', venueData);
    
    const venue = new Venue(venueData);
    const savedVenue = await venue.save();
    
    console.log('Venue created successfully:', savedVenue._id);
    res.status(201).json(savedVenue);
  } catch (error) {
    console.error('Error in addVenue:', error);
    res.status(500).json({ 
      message: 'Failed to create venue', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    console.log('Updating venue:', req.params.id);
    console.log('Update data:', req.body);
    
    const venueId = req.params.id;
    const updateData = {};
    
    // Only update fields that are provided
    const allowedFields = ['name', 'location', 'capacity', 'price', 'description', 'images'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    console.log('Processed update data:', updateData);

    const updatedVenue = await Venue.findOneAndUpdate(
      { _id: venueId, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ message: 'Venue not found or not authorized' });
    }

    console.log('Venue updated successfully');
    res.json(updatedVenue);
  } catch (error) {
    console.error('Error in updateVenue:', error);
    res.status(500).json({ 
      message: 'Failed to update venue', 
      error: error.message 
    });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    console.log('Deleting venue:', req.params.id);
    
    // Check for existing bookings
    const existing = await Booking.find({ venue: req.params.id });
    if (existing.length > 0) {
      console.log(`Cannot delete venue - has ${existing.length} bookings`);
      return res.status(400).json({ message: 'Cannot delete venue with bookings' });
    }

    const deleted = await Venue.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!deleted) {
      console.log('Venue not found or not authorized');
      return res.status(404).json({ message: 'Venue not found or not authorized' });
    }

    console.log('Venue deleted successfully');
    res.json({ message: 'Venue deleted' });
  } catch (error) {
    console.error('Error in deleteVenue:', error);
    res.status(500).json({ 
      message: 'Failed to delete venue', 
      error: error.message 
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for venue owner:', req.user._id);
    
    const myVenues = await Venue.find({ owner: req.user._id }).select('_id');
    const venueIds = myVenues.map(v => v._id);
    
    console.log(`Found ${venueIds.length} venues, fetching bookings...`);
    
    const bookings = await Booking.find({ venue: { $in: venueIds } })
      .populate('venue', 'name')
      .populate('user', 'name email');

    console.log(`Found ${bookings.length} bookings`);
    res.json(bookings);
  } catch (error) {
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ 
      message: 'Failed to load bookings', 
      error: error.message 
    });
  }
};