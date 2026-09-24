const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  creatorName: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  rate: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);
