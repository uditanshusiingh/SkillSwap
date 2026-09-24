import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBooking, getGig } from '../api';
import Loader from '../components/Loader';

export default function GigDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [gig, setGig] = useState(null);
  const [form, setForm] = useState({ clientName: '', clientEmail: '', requirements: '', preferredDate: '' });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    getGig(id)
      .then((r) => setGig(r.data))
      .catch((err) =>
        setLoadError(err.response ? 'Gig not found.' : 'Could not load this gig. Please try again in a moment.')
      );
  }, [id]);

  if (loadError) return <main className="container py-5"><div className="alert alert-danger">{loadError}</div></main>;
  if (!gig) return <main className="container py-5"><Loader text="Loading gig…" /></main>;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setSubmitError('');
    try {
      await createBooking({ gigId: id, ...form });
      localStorage.setItem('skillswapClientEmail', form.clientEmail);
      setDone(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Could not create booking. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <span className="badge category">{gig.category}</span>
          <h1 className="display-5 fw-bold mt-3">{gig.title}</h1>
          <p className="text-secondary">Created by <strong>{gig.creatorName}</strong></p>
          <div className="gig-description mt-4">{gig.description}</div>
          <div className="price-large mt-5">₹{gig.rate}<small> / project</small></div>
        </div>
        <div className="col-lg-5">
          {done ? (
            <div className="success-card">
              <div className="check">✓</div>
              <h3>Booking submitted</h3>
              <p className="text-secondary">Your request is pending creator approval.</p>
              <button className="btn btn-dark" onClick={() => nav('/my-bookings')}>View My Bookings</button>
            </div>
          ) : (
            <form className="form-card shadow-sm" onSubmit={submit}>
              <h3>Book this gig</h3>
              <p className="text-secondary">Send your project details to {gig.creatorName}.</p>
              <label>Your name<input required className="form-control" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></label>
              <label>Email<input required type="email" className="form-control" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} /></label>
              <label>Preferred date<input required type="date" className="form-control" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} /></label>
              <label>Requirements<textarea rows="4" className="form-control" placeholder="Tell the creator what you need…" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
              {submitError && <div className="alert alert-danger">{submitError}</div>}
              {busy && <p className="small text-secondary">Sending… if the server is asleep this can take up to a minute.</p>}
              <button disabled={busy} className="btn btn-dark btn-lg w-100">{busy ? 'Sending…' : 'Confirm Booking'}</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
