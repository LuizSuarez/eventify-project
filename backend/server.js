require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const venueRoutes = require('./routes/venueRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { handleStripeWebhook } = require('./controllers/paymentController');

const app = express();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ✅ CORS setup (allow both localhost and vercel frontend)
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventify-project.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Stripe webhook must be raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// ✅ Apply JSON middleware *after* webhook route
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/user-dashboard', userDashboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
