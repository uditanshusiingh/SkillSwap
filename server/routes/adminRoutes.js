const express = require('express');
const mongoose = require('mongoose');
const Gig = require('../models/Gig');
const Booking = require('../models/Booking');
const adminAuth = require('../middleware/adminAuth');
const { seedMissing, sampleGigs } = require('../seedData');

const router = express.Router();
router.use(adminAuth);

const STATUSES = ['Pending', 'Accepted', 'Declined'];
const fail = (res, code, message) => res.status(code).json({ message });

router.get('/verify', (_req, res) => res.json({ ok: true }));

router.get('/stats', async (_req, res) => {
  try {
    const [gigs, bookings, byStatus, byCategory] = await Promise.all([
      Gig.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
      Gig.aggregate([{ $group: { _id: '$category', n: { $sum: 1 } } }, { $sort: { n: -1 } }])
    ]);
    const status = { Pending: 0, Accepted: 0, Declined: 0 };
    byStatus.forEach((s) => { status[s._id] = s.n; });
    res.json({
      gigs, bookings, status,
      categories: byCategory.map((c) => ({ category: c._id, count: c.n })),
      sampleGigsTotal: sampleGigs.length
    });
  } catch (e) { fail(res, 500, 'Failed to load stats.'); }
});

router.get('/gigs', async (_req, res) => {
  try {
    const [gigs, counts] = await Promise.all([
      Gig.find().sort({ createdAt: -1 }).lean(),
      Booking.aggregate([{ $group: { _id: '$gigId', n: { $sum: 1 } } }])
    ]);
    const byGig = new Map(counts.map((c) => [String(c._id), c.n]));
    res.json(gigs.map((g) => ({ ...g, bookingCount: byGig.get(String(g._id)) || 0 })));
  } catch (e) { fail(res, 500, 'Failed to load gigs.'); }
});

// Deleting a gig also deletes its bookings so no orphaned bookings are left behind.
router.delete('/gigs/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, 'Invalid gig id.');
    const gig = await Gig.findByIdAndDelete(req.params.id);
    if (!gig) return fail(res, 404, 'Gig not found.');
    const { deletedCount } = await Booking.deleteMany({ gigId: req.params.id });
    res.json({ deleted: true, bookingsDeleted: deletedCount });
  } catch (e) { fail(res, 500, 'Could not delete gig.'); }
});

router.get('/bookings', async (_req, res) => {
  try { res.json(await Booking.find().populate('gigId').sort({ createdAt: -1 })); }
  catch (e) { fail(res, 500, 'Failed to load bookings.'); }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, 'Invalid booking id.');
    if (!STATUSES.includes(req.body.status)) return fail(res, 400, 'Invalid status.');
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('gigId');
    if (!booking) return fail(res, 404, 'Booking not found.');
    res.json(booking);
  } catch (e) { fail(res, 500, 'Could not update booking.'); }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, 'Invalid booking id.');
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return fail(res, 404, 'Booking not found.');
    res.json({ deleted: true });
  } catch (e) { fail(res, 500, 'Could not delete booking.'); }
});

// Adds only the sample gigs that are not already there (safe to click repeatedly).
router.post('/seed', async (_req, res) => {
  try { res.json({ added: await seedMissing() }); }
  catch (e) { fail(res, 500, 'Could not add sample gigs.'); }
});

// Deletes ALL gigs and bookings, then re-adds the sample gigs.
router.post('/reset', async (req, res) => {
  try {
    if (req.body?.confirm !== 'RESET') return fail(res, 400, 'Send { "confirm": "RESET" } to reset all data.');
    const [b, g] = await Promise.all([Booking.deleteMany({}), Gig.deleteMany({})]);
    const added = await seedMissing();
    res.json({ gigsDeleted: g.deletedCount, bookingsDeleted: b.deletedCount, added });
  } catch (e) { fail(res, 500, 'Could not reset data.'); }
});

module.exports = router;
