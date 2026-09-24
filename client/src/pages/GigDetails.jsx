import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBooking, createPaymentOrder, getGig, verifyPayment } from '../api';
import Loader from '../components/Loader';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

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
      .catch((err) => setLoadError(err.response ? 'Gig not found.' : 'Could not load this gig. Please try again in a moment.'));
  }, [id]);

  if (loadError) return <main className="container py-5"><div className="alert alert-danger">{loadError}</div></main>;
  if (!gig) return <main className="container py-5"><Loader text="Loading gig…" /></main>;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setSubmitError('');

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Razorpay Checkout could not be loaded. Please check your connection and try again.');

      const { data: order } = await createPaymentOrder({
        gigId: id,
        clientName: form.clientName,
        clientEmail: form.clientEmail
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'SkillSwap',
        description: gig.title,
        order_id: order.orderId,
        prefill: {
          name: form.clientName,
          email: form.clientEmail
        },
        notes: {
          gig: gig.title,
          creator: gig.creatorName
        },
        theme: {
          color: '#6d5dfc'
        },
        modal: {
          ondismiss: () => setBusy(false)
        },
        handler: async (response) => {
          try {
            await verifyPayment({
              gigId: id,
              ...form,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            localStorage.setItem('skillswapClientEmail', form.clientEmail);
            setDone(true);
          } catch (err) {
            setSubmitError(err.response?.data?.message || 'Payment verification failed. Please contact support if money was deducted.');
          } finally {
            setBusy(false);
          }
        }
      };

      const checkout = new window.Razorpay(options);
      checkout.on('payment.failed', (response) => {
        setSubmitError(response.error?.description || 'Payment failed. Please try again.');
        setBusy(false);
      });
      checkout.open();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Could not start payment.');
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
              <p className="text-secondary">Payment was successful and your request is pending creator approval.</p>
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
              <button disabled={busy} className="btn btn-dark btn-lg w-100">
                {busy ? 'Opening secure checkout…' : `Confirm & Pay ₹${gig.rate}`}
              </button>
              <p className="small text-secondary text-center mt-3 mb-0">Secure checkout powered by Razorpay.</p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
