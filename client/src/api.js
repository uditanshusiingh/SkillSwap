import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 90000 });
export const getGigs = () => api.get('/gigs');
export const getGig = (id) => api.get(`/gigs/${id}`);
export const createGig = (data) => api.post('/gigs', data);
export const getBookings = (email='') => api.get('/bookings', { params: email ? { email } : {} });
export const createBooking = (data) => api.post('/bookings', data);
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });

// Admin API: the secret key is sent on every request (see server/middleware/adminAuth.js)
export const adminClient = (key) => axios.create({ baseURL: api.defaults.baseURL, timeout: 90000, headers: { 'x-admin-key': key } });

export const createPaymentOrder = (data) => api.post('/payments/order', data);
export const verifyPayment = (data) => api.post('/payments/verify', data);
