const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = req.query.email ? { clientEmail: req.query.email.toLowerCase() } : {};
    const bookings = await Booking.find(filter).populate('gigId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) { res.status(500).json({ message: 'Failed to fetch bookings.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { gigId, clientName, clientEmail, requirements, preferredDate } = req.body;
    if (!gigId || !clientName || !clientEmail || !preferredDate) {
      return res.status(400).json({ message: 'Name, email and preferred date are required.' });
    }
    const booking = await Booking.create({ gigId, clientName, clientEmail, requirements, preferredDate });
    res.status(201).json(await booking.populate('gigId'));
  } catch (e) { res.status(400).json({ message: 'Could not create booking.' }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('gigId');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json(booking);
  } catch (e) { res.status(400).json({ message: 'Could not update booking.' }); }
});

module.exports = router;
