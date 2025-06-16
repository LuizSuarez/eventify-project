const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  venue: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Venue', 
    default: null 
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  },

  date: { 
    type: Date, 
    required: true 
  },

  numberOfGuests: { 
    type: Number, 
    default: 1 
  },

  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  },

  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
// This code defines a Mongoose schema for a Booking model in a Node.js application.
// The schema includes fields for user, venue, service, date, number of guests, status, payment status, and creation date.