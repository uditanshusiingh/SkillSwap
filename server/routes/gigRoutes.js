const express = require('express');
const Gig = require('../models/Gig');
const router = express.Router();

router.get('/', async (_req, res) => {
  try { res.json(await Gig.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: 'Failed to fetch gigs.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found.' });
    res.json(gig);
  } catch (e) { res.status(400).json({ message: 'Invalid gig id.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { creatorName, title, category, rate, description } = req.body;
    if (!creatorName || !title || !category || rate === undefined || rate === '' || !description) {
      return res.status(400).json({ message: 'All gig fields are required.' });
    }
    const gig = await Gig.create({ creatorName, title, category, rate: Number(rate), description });
    res.status(201).json(gig);
  } catch (e) { res.status(400).json({ message: 'Could not create gig.' }); }
});

module.exports = router;
