import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div className="container py-2">
      <Link className="navbar-brand fw-bold brand" to="/">Skill<span>Swap</span></Link>
      <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"/></button>
      <div className="collapse navbar-collapse" id="nav">
        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <NavLink className="nav-link" to="/marketplace">Marketplace</NavLink>
          <NavLink className="nav-link" to="/post-gig">Post a Gig</NavLink>
          <NavLink className="nav-link" to="/creator-dashboard">Creator Dashboard</NavLink>
          <NavLink className="nav-link" to="/my-bookings">My Bookings</NavLink>
        </div>
      </div>
    </div>
  </nav>;
}
