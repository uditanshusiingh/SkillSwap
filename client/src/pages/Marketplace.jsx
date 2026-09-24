import { useEffect, useMemo, useState } from 'react';
import GigCard from '../components/GigCard';
import Loader from '../components/Loader';
import { getGigs } from '../api';

const categories = ['All','Graphic Design','Video Editing','Photography','Content Writing','Web Development','Social Media','Music & Audio','Animation','Digital Marketing','UI/UX Design'];

export default function Marketplace() {
  const [gigs,setGigs]=useState([]),[q,setQ]=useState(''),[category,setCategory]=useState('All'),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const [showAll,setShowAll]=useState(false);

  useEffect(()=>{
    getGigs()
      .then(r=>setGigs(r.data))
      .catch(()=>setError('Could not load gigs. Please check your connection and try again in a moment.'))
      .finally(()=>setLoading(false));
  },[]);

  const filtered=useMemo(
    ()=>gigs.filter(g=>(category==='All'||g.category===category)&&`${g.title} ${g.description} ${g.creatorName}`.toLowerCase().includes(q.toLowerCase())),
    [gigs,q,category]
  );

  const visibleGigs = showAll ? filtered : filtered.slice(0, 6);

  return <main className="container py-5">
    <div className="page-head">
      <span className="eyebrow">MARKETPLACE</span>
      <h1>Find the right creator.</h1>
      <p>Search services, compare offers and book directly.</p>
    </div>

    <div className="search-panel shadow-sm">
      <input className="form-control form-control-lg" placeholder="Search gigs or creators…" aria-label="Search gigs" value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}}/>
      <div className="filter-row">{categories.map(c=><button key={c} className={`btn ${category===c?'btn-dark':'btn-outline-secondary'}`} onClick={()=>{setCategory(c);setShowAll(false)}}>{c}</button>)}</div>
    </div>

    {error&&<div className="alert alert-warning mt-4">{error}</div>}

    {loading?<Loader text="Loading gigs…"/>:<>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <p className="text-secondary mb-0">{filtered.length} gig{filtered.length===1?'':'s'} available</p>
        {filtered.length > 6 && <button className="btn btn-dark" onClick={()=>setShowAll(true)}>View All ({filtered.length})</button>}
      </div>

      <div className="row g-4 mt-1">
        {visibleGigs.map(g=><div className="col-md-6 col-lg-4" key={g._id}><GigCard gig={g}/></div>)}
        {!filtered.length&&!error&&<div className="empty">No gigs match your search.</div>}
      </div>

      {showAll && filtered.length > 6 && (
        <div className="marketplace-modal-backdrop" role="presentation" onClick={()=>setShowAll(false)}>
          <div className="marketplace-modal" role="dialog" aria-modal="true" aria-label="All gigs" onClick={e=>e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
              <div>
                <span className="eyebrow">ALL GIGS</span>
                <h3 className="mb-0 mt-1">{filtered.length} available gigs</h3>
              </div>
              <button className="btn-close" aria-label="Close" onClick={()=>setShowAll(false)} />
            </div>
            <div className="row g-3 marketplace-modal-grid">
              {filtered.map(g=><div className="col-md-6 col-xl-4" key={g._id}><GigCard gig={g}/></div>)}
            </div>
          </div>
        </div>
      )}
    </>}
  </main>;
}
