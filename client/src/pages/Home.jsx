import { Link } from 'react-router-dom';
export default function Home() {
  return <main>
    <section className="hero"><div className="container py-5"><div className="row align-items-center py-lg-5">
      <div className="col-lg-7"><span className="eyebrow">CREATOR ECONOMY · SKILLS MARKETPLACE</span><h1 className="display-3 fw-bold mt-3">Turn your skills into <span>real opportunities.</span></h1><p className="lead text-secondary mt-3 mb-4">SkillSwap connects young creators with clients who need design, video, development, writing and more.</p><div className="d-flex gap-2 flex-wrap"><Link className="btn btn-dark btn-lg px-4" to="/marketplace">Explore Gigs</Link><Link className="btn btn-outline-dark btn-lg px-4" to="/post-gig">Post a Gig</Link></div></div>
      <div className="col-lg-5 mt-5 mt-lg-0"><div className="hero-card"><div className="mini-label">HOW IT WORKS</div><div className="step"><b>01</b><div><strong>Creators list services</strong><small>Set your category, rate and offer.</small></div></div><div className="step"><b>02</b><div><strong>Clients discover & book</strong><small>Search for the right skill.</small></div></div><div className="step"><b>03</b><div><strong>Creators accept work</strong><small>Manage requests from your dashboard.</small></div></div></div></div>
    </div></div></section>
    <section className="container py-5 home-features"><div className="row g-4">
      <div className="col-md-4"><Link className="feature feature-link" to="/marketplace"><span>01</span><h4>Discover talent</h4><p>Search a focused marketplace of creator services.</p><small>Explore marketplace →</small></Link></div>
      <div className="col-md-4"><Link className="feature feature-link" to="/marketplace"><span>02</span><h4>Book with context</h4><p>Send your requirements and preferred delivery date.</p><small>Find a service →</small></Link></div>
      <div className="col-md-4"><Link className="feature feature-link" to="/creator-dashboard"><span>03</span><h4>Manage bookings</h4><p>Creators accept or decline requests and clients see live status.</p><small>Open dashboard →</small></Link></div>
    </div></section>
  </main>;
}
