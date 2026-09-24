import { useEffect, useMemo, useState } from 'react';
import GigCard from '../components/GigCard';
import Loader from '../components/Loader';
import { getGigs } from '../api';
const categories = ['All','Graphic Design','Video Editing','Photography','Content Writing','Web Development','Social Media','Music & Audio','Animation','Digital Marketing','UI/UX Design'];
export default function Marketplace() {
  const [gigs,setGigs]=useState([]),[q,setQ]=useState(''),[category,setCategory]=useState('All'),[loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{getGigs().then(r=>setGigs(r.data)).catch(()=>setError('Could not load gigs. Please check your connection and try again in a moment.')).finally(()=>setLoading(false));},[]);
  const filtered=useMemo(()=>gigs.filter(g=>(category==='All'||g.category===category)&&`${g.title} ${g.description} ${g.creatorName}`.toLowerCase().includes(q.toLowerCase())),[gigs,q,category]);
  return <main className="container py-5"><div className="page-head"><span className="eyebrow">MARKETPLACE</span><h1>Find the right creator.</h1><p>Search services, compare offers and book directly.</p></div><div className="search-panel shadow-sm"><input className="form-control form-control-lg" placeholder="Search gigs, creators or skills..." value={q} onChange={e=>setQ(e.target.value)}/><div className="filter-row">{categories.map(c=><button key={c} className={`btn ${category===c?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>{error&&<div className="alert alert-warning mt-4">{error}</div>}{loading?<Loader text="Loading gigs…"/>:<div className="row g-4 mt-2">{filtered.map(g=><div className="col-md-6 col-lg-4" key={g._id}><GigCard gig={g}/></div>)}{!filtered.length&&!error&&<div className="empty">No gigs match your search.</div>}</div>}</main>;
}
