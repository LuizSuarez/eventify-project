const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
// This code defines the authentication routes for user signup and login in an Express.js application.
// It imports the necessary modules, sets up the routes, and exports the router for use in the main application file.