import { useEffect, useState } from 'react';
import { adminClient } from '../api';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const SESSION_KEY = 'skillswapAdminKey';
const STATUSES = ['Pending', 'Accepted', 'Declined'];
const errorText = (err) => err.response?.data?.message || 'Could not reach the server. Please try again in a moment.';

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem(SESSION_KEY) || '');
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)));
  const [error, setError] = useState('');

  const login = async (k) => {
    setChecking(true);
    setError('');
    try {
      await adminClient(k).get('/admin/verify');
      sessionStorage.setItem(SESSION_KEY, k);
      setKey(k);
      setAuthed(true);
    } catch (err) {
      sessionStorage.removeItem(SESSION_KEY);
      setAuthed(false);
      setError(errorText(err));
    } finally {
      setChecking(false);
    }
  };

  const logout = (message = '') => {
    sessionStorage.removeItem(SESSION_KEY);
    setKey('');
    setInput('');
    setAuthed(false);
    setError(message);
  };

  useEffect(() => { if (key) login(key); }, []);

  if (checking) return <main className="container py-5"><Loader text="Checking admin key…" /></main>;

  if (!authed) {
    return (
      <main className="container py-5 narrow">
        <span className="eyebrow">ADMIN</span>
        <h1 className="mt-2">Admin panel</h1>
        <p className="text-secondary">Enter the admin key to manage gigs, bookings and sample data.</p>
        <form className="form-card shadow-sm mt-4" onSubmit={(e) => { e.preventDefault(); if (input) login(input); }}>
          <label>Admin key
            <input type="password" autoComplete="off" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} />
          </label>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-dark btn-lg w-100" disabled={!input}>Open admin panel</button>
        </form>
      </main>
    );
  }

  return <AdminPanel client={adminClient(key)} onLogout={logout} />;
}

function AdminPanel({ client, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 429) return onLogout(errorText(err));
    setError(errorText(err));
  };

  const refresh = async () => {
    try {
      const [s, g, b] = await Promise.all([client.get('/admin/stats'), client.get('/admin/gigs'), client.get('/admin/bookings')]);
      setStats(s.data);
      setGigs(g.data);
      setBookings(b.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Runs an admin action, shows a message, then reloads all the data.
  const run = async (action, message) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await action();
      setNotice(typeof message === 'function' ? message(res.data) : message);
      await refresh();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const addSamples = () =>
    run(() => client.post('/admin/seed'), (d) => (d.added ? `Added ${d.added} sample gig(s).` : 'All sample gigs are already there.'));

  const resetAll = () => {
    if (!window.confirm('Delete ALL gigs and bookings and re-add the sample gigs? This cannot be undone.')) return;
    run(() => client.post('/admin/reset', { confirm: 'RESET' }), (d) => `Reset done: removed ${d.gigsDeleted} gig(s) and ${d.bookingsDeleted} booking(s), added ${d.added} sample gig(s).`);
  };

  const deleteGig = (g) => {
    const extra = g.bookingCount ? ` This also deletes its ${g.bookingCount} booking(s).` : '';
    if (!window.confirm(`Delete gig "${g.title}"?${extra}`)) return;
    run(() => client.delete(`/admin/gigs/${g._id}`), 'Gig deleted.');
  };

  const deleteBooking = (b) => {
    if (!window.confirm(`Delete the booking from ${b.clientName}?`)) return;
    run(() => client.delete(`/admin/bookings/${b._id}`), 'Booking deleted.');
  };

  const setStatus = (b, status) => run(() => client.patch(`/admin/bookings/${b._id}/status`, { status }), 'Booking status updated.');

  const maxCat = stats ? Math.max(1, ...stats.categories.map((c) => c.count)) : 1;

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <span className="eyebrow">ADMIN</span>
          <h1 className="mt-2">Admin panel</h1>
        </div>
        <button className="btn btn-outline-dark" onClick={() => onLogout('')}>Log out</button>
      </div>

      <ul className="nav nav-pills my-4 gap-1">
        {[['overview', 'Overview'], ['gigs', `Gigs${stats ? ` (${stats.gigs})` : ''}`], ['bookings', `Bookings${stats ? ` (${stats.bookings})` : ''}`]].map(([id, label]) => (
          <li className="nav-item" key={id}>
            <button className={`nav-link ${tab === id ? 'active bg-dark' : 'text-dark'}`} onClick={() => setTab(id)}>{label}</button>
          </li>
        ))}
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      {loading ? <Loader text="Loading admin data…" /> : (
        <>
          {tab === 'overview' && stats && (
            <>
              <div className="stats row g-3">
                {[['Gigs', stats.gigs], ['Bookings', stats.bookings], ['Pending', stats.status.Pending], ['Accepted', stats.status.Accepted], ['Declined', stats.status.Declined]].map(([label, n]) => (
                  <div className="col-6 col-md" key={label}><div className="stat"><small>{label}</small><strong>{n}</strong></div></div>
                ))}
              </div>

              <div className="row g-4 mt-1">
                <div className="col-lg-6">
                  <div className="form-card shadow-sm h-100">
                    <h4>Gigs by category</h4>
                    {stats.categories.length ? stats.categories.map((c) => (
                      <div className="mb-3" key={c.category}>
                        <div className="d-flex justify-content-between small"><span>{c.category}</span><strong>{c.count}</strong></div>
                        <div className="progress" style={{ height: 8 }}><div className="progress-bar bg-dark" style={{ width: `${(c.count / maxCat) * 100}%` }} /></div>
                      </div>
                    )) : <p className="text-secondary mb-0">No gigs yet.</p>}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-card shadow-sm h-100">
                    <h4>Sample data</h4>
                    <p className="text-secondary">Sample gigs make the marketplace look alive for first-time visitors ({stats.sampleGigsTotal} available).</p>
                    <button className="btn btn-dark w-100 mb-3" disabled={busy} onClick={addSamples}>Add missing sample gigs</button>
                    <hr />
                    <p className="text-secondary small">Danger zone: deletes every gig and booking, then re-adds the sample gigs.</p>
                    <button className="btn btn-outline-danger w-100" disabled={busy} onClick={resetAll}>Reset all data</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'gigs' && (
            gigs.length ? (
              <div className="table-responsive card border-0 shadow-sm">
                <table className="table align-middle mb-0">
                  <thead><tr><th>Title</th><th>Creator</th><th>Category</th><th>Rate</th><th>Bookings</th><th>Created</th><th /></tr></thead>
                  <tbody>
                    {gigs.map((g) => (
                      <tr key={g._id}>
                        <td><strong>{g.title}</strong></td>
                        <td>{g.creatorName}</td>
                        <td>{g.category}</td>
                        <td>₹{g.rate}</td>
                        <td>{g.bookingCount}</td>
                        <td>{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '—'}</td>
                        <td><button className="btn btn-sm btn-outline-danger" disabled={busy} onClick={() => deleteGig(g)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="empty">No gigs. Use the Overview tab to add sample gigs.</div>
          )}

          {tab === 'bookings' && (
            bookings.length ? (
              <div className="table-responsive card border-0 shadow-sm">
                <table className="table align-middle mb-0">
                  <thead><tr><th>Client</th><th>Gig</th><th>Date</th><th>Status</th><th>Change status</th><th /></tr></thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td><strong>{b.clientName}</strong><br /><small>{b.clientEmail}</small></td>
                        <td>{b.gigId?.title || '—'}</td>
                        <td>{b.preferredDate}</td>
                        <td><StatusBadge status={b.status} /></td>
                        <td>
                          <select className="form-select form-select-sm" value={b.status} disabled={busy} onChange={(e) => setStatus(b, e.target.value)} aria-label={`Status for ${b.clientName}`}>
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td><button className="btn btn-sm btn-outline-danger" disabled={busy} onClick={() => deleteBooking(b)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="empty">No bookings yet.</div>
          )}
        </>
      )}
    </main>
  );
}
