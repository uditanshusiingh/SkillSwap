import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '../api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { filterByCreator } from '../utils';

export default function CreatorDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creator, setCreator] = useState('');

  const load = () =>
    getBookings()
      .then((r) => { setItems(r.data); setError(''); })
      .catch(() => setError('Could not load booking requests. Please try again in a moment.'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const change = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      await load();
    } catch {
      setError('Could not update the booking. Please try again.');
    }
  };

  const visible = filterByCreator(items, creator);
  const creatorNames = [...new Set(items.map((b) => b.gigId?.creatorName).filter(Boolean))];
  const count = (s) => visible.filter((x) => x.status === s).length;

  return (
    <main className="container py-5">
      <span className="eyebrow">CREATOR SPACE</span>
      <h1 className="mt-2">Creator Dashboard</h1>
      <p className="text-secondary">Review incoming booking requests and decide which projects to accept.</p>
      <div className="email-bar shadow-sm">
        <input
          className="form-control form-control-lg"
          list="creator-names"
          placeholder="Filter by creator name (optional) — leave empty to see all"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />
        <datalist id="creator-names">{creatorNames.map((n) => <option key={n} value={n} />)}</datalist>
        {creator && <button className="btn btn-outline-dark btn-lg" onClick={() => setCreator('')}>Show all</button>}
      </div>
      {creator.trim() && !loading && items.length > 0 && (
        <p className="text-secondary small mt-2 mb-0">Showing {visible.length} of {items.length} requests for “{creator.trim()}”.</p>
      )}
      <div className="stats row g-3 my-4">
        <div className="col-6 col-md-3"><div className="stat"><small>Total</small><strong>{visible.length}</strong></div></div>
        <div className="col-6 col-md-3"><div className="stat"><small>Pending</small><strong>{count('Pending')}</strong></div></div>
        <div className="col-6 col-md-3"><div className="stat"><small>Accepted</small><strong>{count('Accepted')}</strong></div></div>
        <div className="col-6 col-md-3"><div className="stat"><small>Declined</small><strong>{count('Declined')}</strong></div></div>
      </div>
      {error && <div className="alert alert-warning">{error}</div>}
      {loading ? (
        <Loader text="Loading booking requests…" />
      ) : visible.length ? (
        <div className="table-responsive card border-0 shadow-sm">
          <table className="table align-middle mb-0">
            <thead><tr><th>Client</th><th>Gig</th><th>Date</th><th>Requirements</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.clientName}</strong><br /><small>{b.clientEmail}</small></td>
                  <td>{b.gigId?.title || '—'}</td>
                  <td>{b.preferredDate}</td>
                  <td className="req">{b.requirements || '—'}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {b.status === 'Pending' && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success" onClick={() => change(b._id, 'Accepted')}>Accept</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => change(b._id, 'Declined')}>Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="empty">
            {items.length
              ? `No booking requests for “${creator.trim()}”. Clear the filter to see all requests.`
              : 'No booking requests yet. Ask a client to book one of your gigs.'}
          </div>
        )
      )}
    </main>
  );
}
