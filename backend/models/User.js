const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'provider', 'venue', 'admin'],
    default: 'user' },
    resetToken: String,
    resetTokenExpiry: Date
  
});

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema for a User model in a Node.js application.
// The schema includes fields for name, email, password, and role, with validation rules.