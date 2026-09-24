const express = require('express');
const crypto = require('crypto');
const Gig = require('../models/Gig');
const Booking = require('../models/Booking');

const router = express.Router();

const razorpayRequest = async (path, options = {}) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const error = new Error('Razorpay is not configured on the server.');
    error.status = 503;
    throw error;
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.description || 'Razorpay request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
};

router.post('/order', async (req, res) => {
  try {
    const { gigId, clientName, clientEmail } = req.body;
    if (!gigId || !clientName || !clientEmail) {
      return res.status(400).json({ message: 'Gig, name and email are required.' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found.' });

    const order = await razorpayRequest('orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(Number(gig.rate) * 100),
        currency: 'INR',
        receipt: `ss_${Date.now()}`,
        notes: { gigId: String(gig._id), clientEmail: clientEmail.toLowerCase(), clientName }
      })
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      gig: { id: gig._id, title: gig.title, creatorName: gig.creatorName, rate: gig.rate }
    });
  } catch (error) {
    console.error('Razorpay order error:', error.message);
    res.status(error.status || 500).json({ message: error.message || 'Could not start payment.' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const {
      gigId, clientName, clientEmail, requirements, preferredDate,
      razorpayOrderId, razorpayPaymentId, razorpaySignature
    } = req.body;

    if (!gigId || !clientName || !clientEmail || !preferredDate || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment or booking details.' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found.' });

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(razorpaySignature);
    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    const booking = await Booking.create({
      gigId,
      clientName,
      clientEmail,
      requirements,
      preferredDate,
      status: 'Pending',
      paymentStatus: 'Paid',
      razorpayOrderId,
      razorpayPaymentId
    });

    res.status(201).json(await booking.populate('gigId'));
  } catch (error) {
    console.error('Razorpay verification error:', error.message);
    res.status(error.status || 400).json({ message: error.message || 'Could not verify payment.' });
  }
});

module.exports = router;
