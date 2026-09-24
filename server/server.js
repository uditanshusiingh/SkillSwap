require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { seedIfEmpty } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

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

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.SEED_ON_START === 'true') {
      const n = await seedIfEmpty();
      if (n) console.log(`Seeded ${n} sample gigs (database was empty)`);
    }
    app.listen(PORT, () => console.log(`SkillSwap API running on port ${PORT}`));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
start();
