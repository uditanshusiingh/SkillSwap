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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentValue, setPaymentValue] = useState('');
  const [paymentError, setPaymentError] = useState('');
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

  const openPayment = (e) => {
    e.preventDefault();
    setSubmitError('');
    setPaymentError('');
    setPaymentValue('');
    setPaymentOpen(true);
  };

  const confirmPayment = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!paymentValue.trim()) {
      setPaymentError(paymentMethod === 'UPI' ? 'Enter a UPI ID to continue.' : 'Enter your card details to continue.');
      return;
    }

    setBusy(true);
    try {
      // Demo-only checkout: no real money is charged.
      await new Promise((resolve) => setTimeout(resolve, 900));
      await createBooking({ gigId: id, ...form });
      localStorage.setItem('skillswapClientEmail', form.clientEmail);
      setPaymentOpen(false);
      setDone(true);
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Could not complete the demo payment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row g-4 g-lg-5">
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
              <p className="text-secondary">Your demo payment was completed and the request is pending creator approval.</p>
              <button className="btn btn-dark" onClick={() => nav('/my-bookings')}>View My Bookings</button>
            </div>
          ) : (
            <form className="form-card shadow-sm" onSubmit={openPayment}>
              <h3>Book this gig</h3>
              <p className="text-secondary">Send your project details to {gig.creatorName}.</p>
              <label>Your name<input required className="form-control" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></label>
              <label>Email<input required type="email" className="form-control" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} /></label>
              <label>Preferred date<input required type="date" className="form-control" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} /></label>
              <label>Requirements<textarea rows="4" className="form-control" placeholder="Tell the creator what you need…" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
              {submitError && <div className="alert alert-danger">{submitError}</div>}
              <button className="btn btn-dark btn-lg w-100">Proceed to Payment · ₹{gig.rate}</button>
            </form>
          )}
        </div>
      </div>

      {paymentOpen && (
        <div className="payment-modal-backdrop" onClick={() => !busy && setPaymentOpen(false)}>
          <div className="payment-modal" role="dialog" aria-modal="true" aria-label="SkillSwap demo checkout" onClick={(e) => e.stopPropagation()}>
            <div className="payment-header">
              <div>
                <div className="payment-brand">Skill<span>Swap</span> <small>CHECKOUT</small></div>
                <div className="payment-secure">🔒 Secure demo checkout</div>
              </div>
              <button className="btn-close" aria-label="Close" disabled={busy} onClick={() => setPaymentOpen(false)} />
            </div>

            <div className="payment-summary">
              <div>
                <small>PAYING FOR</small>
                <strong>{gig.title}</strong>
                <span>{gig.creatorName}</span>
              </div>
              <div className="payment-total">₹{gig.rate}</div>
            </div>

            <div className="payment-body">
              <div className="payment-tabs">
                {['UPI', 'Card'].map((method) => (
                  <button type="button" key={method} className={paymentMethod === method ? 'active' : ''} onClick={() => { setPaymentMethod(method); setPaymentValue(''); setPaymentError(''); }}>
                    {method === 'UPI' ? '◉ UPI' : '▣ Card'}
                  </button>
                ))}
              </div>

              <form onSubmit={confirmPayment}>
                {paymentMethod === 'UPI' ? (
                  <>
                    <label className="payment-label">UPI ID<input autoFocus className="form-control" placeholder="yourname@upi" value={paymentValue} onChange={(e) => setPaymentValue(e.target.value)} /></label>
                    <div className="payment-methods">GPay · PhonePe · Paytm · BHIM</div>
                  </>
                ) : (
                  <>
                    <label className="payment-label">Card number<input autoFocus className="form-control" inputMode="numeric" placeholder="1234 5678 9012 3456" value={paymentValue} onChange={(e) => setPaymentValue(e.target.value)} /></label>
                    <div className="row g-2">
                      <div className="col-6"><input className="form-control" placeholder="MM / YY" /></div>
                      <div className="col-6"><input className="form-control" placeholder="CVV" type="password" /></div>
                    </div>
                  </>
                )}

                {paymentError && <div className="alert alert-danger mt-3 mb-0">{paymentError}</div>}

                <button disabled={busy} className="payment-pay-btn" type="submit">
                  {busy ? 'Processing…' : `Pay ₹${gig.rate}`}
                </button>
                <p className="payment-demo-note">Demo payment only · No real money will be charged.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
