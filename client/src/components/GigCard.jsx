import { Link } from 'react-router-dom';
export default function GigCard({ gig }) {
  return <div className="card gig-card h-100 border-0 shadow-sm">
    <div className="card-body p-4 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3"><span className="badge category">{gig.category}</span><span className="price">₹{gig.rate}</span></div>
      <h5 className="fw-bold">{gig.title}</h5>
      <p className="text-secondary small mb-2">by {gig.creatorName}</p>
      <p className="text-secondary flex-grow-1">{gig.description}</p>
      <Link className="btn btn-dark w-100" to={`/gig/${gig._id}`}>View Gig</Link>
    </div>
  </div>;
}
