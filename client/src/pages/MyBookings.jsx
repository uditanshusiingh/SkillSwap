import { useEffect, useState } from 'react';
import { cancelBooking, getBookings } from '../api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

export default function MyBookings() {
  const [email, setEmail] = useState(localStorage.getItem('skillswapClientEmail') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState('');

  const load = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    localStorage.setItem('skillswapClientEmail', email);
    try {
      setItems((await getBookings(email)).data);
    } catch {
      setItems([]);
      setError('Could not load your bookings. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (email) load(); }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancellingId(booking._id);
      setError('');
      await cancelBooking(booking._id, email);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not cancel this booking. Please try again.');
    } finally {
      setCancellingId('');
    }
  };

  return (
    <main className="container py-5 my-bookings">
      <div className="page-head">
        <span className="eyebrow">CLIENT SPACE</span>
        <h1>My bookings</h1>
        <p>Enter the email used when booking to see your requests and status.</p>
      </div>
      <div className="email-bar shadow-sm">
        <input type="email" className="form-control form-control-lg" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-dark btn-lg" onClick={load}>Load bookings</button>
      </div>
      {error && <div className="alert alert-warning mt-4">{error}</div>}
      {loading ? (
        <Loader text="Loading your bookings…" />
      ) : items.length ? (
        <div className="row g-4 mt-2">
          {items.map((b) => (
            <div className="col-md-6" key={b._id}>
              <div className="booking-card shadow-sm">
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <span className="badge category">{b.gigId?.category}</span>
                    <h4 className="mt-3">{b.gigId?.title}</h4>
                    <p className="text-secondary mb-1">Creator: {b.gigId?.creatorName}</p>
                    <p className="text-secondary">Preferred date: {b.preferredDate}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                  <p className="small text-secondary mb-0">{b.requirements || 'No additional requirements.'}</p>
                  {b.status !== 'Cancelled' && b.status !== 'Declined' && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={cancellingId === b._id}
                      onClick={() => handleCancel(b)}
                    >
                      {cancellingId === b._id ? 'Cancelling…' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && <div className="empty mt-4">No bookings found for this email.</div>
      )}
    </main>
  );
}
