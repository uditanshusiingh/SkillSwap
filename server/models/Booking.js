const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  clientName: { type: String, required: true, trim: true },
  clientEmail: { type: String, required: true, trim: true, lowercase: true },
  requirements: { type: String, default: '', trim: true },
  preferredDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
