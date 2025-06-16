const mongoose = require('mongoose');
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('Venue', venueSchema);