require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: true }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'SkillSwap API' }));
app.use('/api/gigs', gigRoutes);
app.use('/api/bookings', bookingRoutes);

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`SkillSwap API running on port ${PORT}`));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
start();
