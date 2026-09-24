import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 90000 });
export const getGigs = () => api.get('/gigs');
export const getGig = (id) => api.get(`/gigs/${id}`);
export const createGig = (data) => api.post('/gigs', data);
export const getBookings = (email='') => api.get('/bookings', { params: email ? { email } : {} });
export const createBooking = (data) => api.post('/bookings', data);
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });
