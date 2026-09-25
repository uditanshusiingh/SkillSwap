import { useEffect, useMemo, useState } from 'react';
import { getBookings, getGigs, updateBookingStatus } from '../api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

const filters = ['All', 'Pending', 'Accepted', 'Declined'];

export default function CreatorDashboard() {
  const [items, setItems] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creator, setCreator] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState('');
  const [showAllGigs, setShowAllGigs] = useState(false);

  const load = async () => {
    try {
      const [bookingRes, gigRes] = await Promise.all([getBookings(), getGigs()]);
      setItems(bookingRes.data);
      setGigs(gigRes.data);
      setError('');
    } catch {
      setError('Could not load dashboard data. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!showAllGigs) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAllGigs]);

  const creatorNames = useMemo(
    () => [...new Set(gigs.map((g) => g.creatorName).filter(Boolean))].sort(),
    [gigs]
  );

  const myGigs = useMemo(() => {
    const q = creator.trim().toLowerCase();
    return q ? gigs.filter((g) => g.creatorName?.toLowerCase() === q) : gigs;
  }, [gigs, creator]);

  const creatorBookings = useMemo(() => {
    const q = creator.trim().toLowerCase();
    return items.filter((b) => !q || b.gigId?.creatorName?.toLowerCase() === q);
  }, [items, creator]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return creatorBookings.filter((b) => {
      const statusMatch = statusFilter === 'All' || b.status === statusFilter;
      const searchMatch = !q || `${b.clientName} ${b.clientEmail} ${b.gigId?.title || ''} ${b.requirements || ''}`.toLowerCase().includes(q);
      return statusMatch && searchMatch;
    });
  }, [creatorBookings, statusFilter, search]);

  const count = (status) => creatorBookings.filter((b) => b.status === status).length;
  const paidBookings = creatorBookings.filter((b) => b.paymentStatus === 'Paid');
  const earnings = paidBookings
    .filter((b) => b.status === 'Accepted')
    .reduce((sum, b) => sum + Number(b.gigId?.rate || 0), 0);
  const paidRevenue = paidBookings.reduce((sum, b) => sum + Number(b.gigId?.rate || 0), 0);

  const change = async (id, status) => {
    try {
      setBusyId(id);
      await updateBookingStatus(id, status);
      await load();
    } catch {
      setError('Could not update the booking. Please try again.');
    } finally {
      setBusyId('');
    }
  };

  const clearFilters = () => {
    setStatusFilter('All');
    setSearch('');
  };

  return (
    <main className="container py-5 creator-dashboard">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">CREATOR SPACE</span>
          <h1 className="mt-2 mb-2">Creator Dashboard</h1>
          <p className="text-secondary mb-0">Manage your gigs, track bookings and keep projects moving.</p>
        </div>
        <div className="creator-picker">
          <label htmlFor="creator-select">Viewing as</label>
          <select id="creator-select" className="form-select" value={creator} onChange={(e) => setCreator(e.target.value)}>
            <option value="">All creators</option>
            {creatorNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-warning mt-4">{error}</div>}

      {loading ? <Loader text="Loading creator dashboard…" /> : (
        <>
          <div className="stats row g-3 my-4">
            <div className="col-6 col-xl-3"><div className="stat dashboard-stat"><small>My Gigs</small><strong>{myGigs.length}</strong><span>Published services</span></div></div>
            <div className="col-6 col-xl-3"><div className="stat dashboard-stat"><small>Total Bookings</small><strong>{creatorBookings.length}</strong><span>All requests</span></div></div>
            <div className="col-6 col-xl-3"><div className="stat dashboard-stat"><small>Pending</small><strong>{count('Pending')}</strong><span>Need your action</span></div></div>
            <div className="col-6 col-xl-3"><div className="stat dashboard-stat"><small>Earnings</small><strong>₹{earnings.toLocaleString('en-IN')}</strong><span>Accepted & paid</span></div></div>
          </div>

          <section className="dashboard-section">
            <div className="section-heading">
              <div><span className="eyebrow">YOUR SERVICES</span><h3>My Gigs</h3></div>
              <div className="d-flex align-items-center gap-3">
                <span className="section-count">{myGigs.length} {myGigs.length === 1 ? 'gig' : 'gigs'}</span>
                {myGigs.length > 9 && <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setShowAllGigs(true)}>View All ({myGigs.length})</button>}
              </div>
            </div>

            {myGigs.length ? (
              <div className="row g-3">
                {myGigs.slice(0, 9).map((gig) => {
                  const bookingCount = creatorBookings.filter((b) => b.gigId?._id === gig._id).length;
                  return (
                    <div className="col-md-6 col-xl-4" key={gig._id}>
                      <div className="creator-gig-card">
                        <div className="d-flex justify-content-between gap-3 align-items-start">
                          <span className="badge category">{gig.category}</span>
                          <strong>₹{Number(gig.rate).toLocaleString('en-IN')}</strong>
                        </div>
                        <h5>{gig.title}</h5>
                        <p>{gig.description}</p>
                        <div className="creator-gig-meta"><span>{bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'}</span><span>Published</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="empty">No gigs found for this creator.</div>}
          </section>

          {showAllGigs && (
            <div className="dashboard-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowAllGigs(false)}>
              <div className="dashboard-gigs-modal">
                <div className="dashboard-modal-head">
                  <div><span className="eyebrow">YOUR SERVICES</span><h3>All My Gigs</h3></div>
                  <button className="dashboard-modal-close" aria-label="Close" onClick={() => setShowAllGigs(false)}>×</button>
                </div>
                <div className="row g-3">
                  {myGigs.map((gig) => {
                    const bookingCount = creatorBookings.filter((b) => b.gigId?._id === gig._id).length;
                    return (
                      <div className="col-md-6 col-xl-4" key={gig._id}>
                        <div className="creator-gig-card">
                          <div className="d-flex justify-content-between gap-3 align-items-start">
                            <span className="badge category">{gig.category}</span>
                            <strong>₹{Number(gig.rate).toLocaleString('en-IN')}</strong>
                          </div>
                          <h5>{gig.title}</h5>
                          <p>{gig.description}</p>
                          <div className="creator-gig-meta"><span>{bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'}</span><span>Published</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <section className="dashboard-section mt-5">
            <div className="section-heading">
              <div><span className="eyebrow">BOOKINGS</span><h3>Booking Requests</h3></div>
              <div className="dashboard-summary"><span>Accepted: {count('Accepted')}</span><span>Paid: {paidBookings.length}</span><span>Paid volume: ₹{paidRevenue.toLocaleString('en-IN')}</span></div>
            </div>

            <div className="dashboard-filters">
              <div className="dashboard-search"><input className="form-control" placeholder="Search client, gig or requirements…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
              <div className="filter-row dashboard-status-filters">
                {filters.map((filter) => <button key={filter} className={'btn ' + (statusFilter === filter ? 'btn-dark' : 'btn-outline-secondary')} onClick={() => setStatusFilter(filter)}>{filter}</button>)}
                {(search || statusFilter !== 'All') && <button className="btn btn-link" onClick={clearFilters}>Clear</button>}
              </div>
            </div>

            {visible.length ? (
              <div className="table-responsive card border-0 shadow-sm dashboard-table-wrap">
                <table className="table table-stack align-middle mb-0">
                  <thead><tr><th>Client</th><th>Gig</th><th>Date</th><th>Requirements</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr key={b._id}>
                        <td data-label="Client"><div><strong>{b.clientName}</strong><br /><small>{b.clientEmail}</small></div></td>
                        <td data-label="Gig"><div><strong>{b.gigId?.title || '—'}</strong><br /><small>₹{Number(b.gigId?.rate || 0).toLocaleString('en-IN')}</small></div></td>
                        <td data-label="Date">{b.preferredDate}</td>
                        <td className="req" data-label="Requirements">{b.requirements || '—'}</td>
                        <td data-label="Payment"><span className={'payment-status payment-' + (b.paymentStatus || 'Pending').toLowerCase()}>{b.paymentStatus || 'Pending'}</span></td>
                        <td data-label="Status"><StatusBadge status={b.status} /></td>
                        <td data-label="">
                          {b.status === 'Pending' ? (
                            <div className="d-flex gap-2 row-actions">
                              <button disabled={busyId === b._id} className="btn btn-sm btn-success" onClick={() => change(b._id, 'Accepted')}>{busyId === b._id ? '…' : 'Accept'}</button>
                              <button disabled={busyId === b._id} className="btn btn-sm btn-outline-danger" onClick={() => change(b._id, 'Declined')}>Decline</button>
                            </div>
                          ) : <span className="text-secondary small">No action</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="empty">{creatorBookings.length ? 'No bookings match the selected filters.' : 'No booking requests yet. Publish a gig and ask a client to book it.'}</div>}
          </section>

          {creatorBookings.length > 0 && (
            <section className="dashboard-section mt-5">
              <div className="section-heading"><div><span className="eyebrow">ACTIVITY</span><h3>Recent Activity</h3></div></div>
              <div className="activity-list">
                {creatorBookings.slice(0, 5).map((b) => (
                  <div className="activity-item" key={b._id}>
                    <div className={'activity-dot activity-' + b.status.toLowerCase()}></div>
                    <div className="flex-grow-1"><strong>{b.clientName}</strong> booked <strong>{b.gigId?.title || 'a gig'}</strong><small>{b.paymentStatus === 'Paid' ? 'Payment received' : 'Payment pending'} · {b.status}</small></div>
                    <span>₹{Number(b.gigId?.rate || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
