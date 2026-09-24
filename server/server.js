require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { seedMissing } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1); // Render sits behind a proxy; needed for the admin rate limit to see real IPs

// CORS: CLIENT_URL can hold one or more comma-separated origins.
// If it is unset, all origins are allowed (handy for local dev).
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
if (!allowedOrigins.length) console.warn('CLIENT_URL is not set - CORS allows all origins');
app.use(cors({
  origin: (origin, cb) => {
    // no Origin header = curl / health checks / server-to-server
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  }
}));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'SkillSwap API' }));
app.use('/api/gigs', gigRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
    await mongoose.connect(process.env.MONGO_URI);
    // Keep the marketplace populated with the built-in demo gigs.
    // seedMissing() is safe to run on every deploy: it preserves real/user-created gigs
    // and only inserts default gigs that are not already present.
    const n = await seedMissing();
    if (n) console.log(`Seeded ${n} missing default gigs`);
    app.listen(PORT, () => console.log(`SkillSwap API running on port ${PORT}`));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
start();
