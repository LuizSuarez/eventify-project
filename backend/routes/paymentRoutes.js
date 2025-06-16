
const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleStripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a Stripe Checkout Session
router.post('/checkout', protect, createCheckoutSession);

// Stripe Webhook endpoint (MUST be public and accessible by Stripe)
// IMPORTANT: This route needs to parse raw body, not JSON.
// So, it needs to be placed *before* any express.json() middleware in your server.js
// We'll handle this in server.js/app.js directly for now.
// For now, we will add this directly to server.js

router.post('/webhook', handleStripeWebhook);

module.exports = router;