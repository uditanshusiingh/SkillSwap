import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  // Controlled by React (no Bootstrap JS) so the mobile menu also closes after you pick a page.
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div className="container py-2">
      <Link className="navbar-brand fw-bold brand" to="/" onClick={close}>Skill<span>Swap</span></Link>
      <button type="button" className="navbar-toggler" aria-controls="nav" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}><span className="navbar-toggler-icon"/></button>
      <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="nav">
        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <NavLink className="nav-link" to="/marketplace" onClick={close}>Marketplace</NavLink>
          <NavLink className="nav-link" to="/post-gig" onClick={close}>Post a Gig</NavLink>
          <NavLink className="nav-link" to="/creator-dashboard" onClick={close}>Creator Dashboard</NavLink>
          <NavLink className="nav-link" to="/my-bookings" onClick={close}>My Bookings</NavLink>
        </div>
      </div>
    </div>
  </nav>;
}
