import { Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import PostGig from './pages/PostGig';
import GigDetails from './pages/GigDetails';
import CreatorDashboard from './pages/CreatorDashboard';
import MyBookings from './pages/MyBookings';
export default function App(){return <><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/marketplace" element={<Marketplace/>}/><Route path="/post-gig" element={<PostGig/>}/><Route path="/gig/:id" element={<GigDetails/>}/><Route path="/creator-dashboard" element={<CreatorDashboard/>}/><Route path="/my-bookings" element={<MyBookings/>}/></Routes><footer className="footer"><div className="container d-flex justify-content-between"><span>SkillSwap</span><span>Creator Economy · AZIS-NEA3TC</span></div></footer></>}
