import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('skillswap-theme') === 'dark'; } catch { return false; }
  });
  const close = () => setOpen(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('skillswap-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div className="container py-2">
      <Link className="navbar-brand fw-bold brand" to="/" onClick={close}>Skill<span>Swap</span></Link>
      <div className="d-flex align-items-center gap-2 order-lg-2">
        <button type="button" className="theme-toggle" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'} onClick={() => setDark((value) => !value)}>
          <span aria-hidden="true">{dark ? '☀️' : '🌙'}</span>
          <span className="d-none d-sm-inline">{dark ? 'Light' : 'Dark'}</span>
        </button>
        <button type="button" className="navbar-toggler" aria-controls="nav" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}><span className="navbar-toggler-icon"/></button>
      </div>
      <div className={'collapse navbar-collapse order-lg-1' + (open ? ' show' : '')} id="nav">
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
