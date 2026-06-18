import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import RightPanel from '../components/RightPanel';
import Sidebar from '../components/SideBar';
import '../styles/Dashboard.css';
import axios from 'axios';

import {toast} from 'react-toastify'
import {
  FaRoad, FaAmbulance, FaTree, FaTrash, FaTint, FaBolt,
  FaThumbsUp, FaChartBar, FaMapMarkerAlt, FaUserCircle,
  FaEye, FaHardHat, FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa';

// Category metadata: icon, label, placeholder gradient colour
const CATEGORY_META = {
  roads:       { icon: <FaRoad />,      label: 'Roads & Infrastructure', color: '#4a90a4' },
  accident:    { icon: <FaAmbulance />, label: 'Accident / Emergency',    color: '#c0392b' },
  tree:        { icon: <FaTree />,      label: 'Fallen Tree',             color: '#27ae60' },
  garbage:     { icon: <FaTrash />,     label: 'Garbage / Sanitation',    color: '#e67e22' },
  water:       { icon: <FaTint />,      label: 'Water Supply',            color: '#2980b9' },
  electricity: { icon: <FaBolt />,      label: 'Electricity',             color: '#f39c12' },
};



// Demo poster names – replaced with real data once backend provides it
const DEMO_POSTERS = [
  'Rahul Sharma', 'Priya Menon', 'Arjun Nair', 'Sneha Patil',
  'Kiran Desai', 'Meera Iyer', 'Rohan Gupta', 'Ananya Joshi',
];

// Official progress statuses shown to citizens
const OFFICIAL_STATUS = {
  open:        { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review',    icon: <FaHourglassHalf /> },
  'in-review': { bg: '#dbeafe', text: '#1e40af', label: 'Seen by Officials', icon: <FaEye /> },
  'in-progress':{ bg: '#ede9fe', text: '#5b21b6', label: 'Work In Progress',  icon: <FaHardHat /> },
  resolved:    { bg: '#dcfce7', text: '#166534', label: 'Issue Resolved',    icon: <FaCheckCircle /> },
  closed:      { bg: '#fee2e2', text: '#991b1b', label: 'Closed',            icon: <FaCheckCircle /> },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

function ComplaintCard({ complaint, index ,setComplaints}) {
  const cat    = CATEGORY_META[complaint.activeCategory?.id || complaint.category] || CATEGORY_META.roads;
  const status = OFFICIAL_STATUS[complaint.status] || OFFICIAL_STATUS.open;
  const likes  = complaint.likes  ?? Math.floor(Math.random() * 200);
  // Demo poster: use real field if available, else pick from demo list
  const poster = complaint.user || DEMO_POSTERS[index % DEMO_POSTERS.length];
  let handleLikes=(id)=>{
    let isUser=false
    axios.post(`http://localhost:3000/complaints/like/${id}/${localStorage.getItem('userId')}`)
    .then((res)=>{
        isUser=res.data
        if(isUser){
          setComplaints(
            prev => prev.map(c =>c._id === id ? { ...c, likes: c.likes + 1 }: c)
          );
          return
        }
        setComplaints(
            prev => prev.map(c =>c._id === id ? { ...c, likes: c.likes - 1 }: c)
          );
    })
    .catch((err)=>{console.error(err.response)})
     
  }
  return (
    <motion.div
      className="cc-card"
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
    >
      {/* ── Top row: icon square LEFT + content RIGHT ── */}
      <div className="cc-top-row">
        {/* Icon square */}
        <div className="cc-icon-square" style={{ background: cat.color }}>
          {cat.icon}
        </div>

        {/* Content right */}
        <div className="cc-content">
          {/* Posted by */}
          <div className="cc-poster">
            <FaUserCircle className="cc-poster-icon" />
            <span className="cc-poster-name">{poster}</span>
            <span className="cc-poster-tag">· Citizen</span>
          </div>
          <h3 className="cc-title">{complaint.title}</h3>
          <p className="cc-desc">{complaint.description || 'No description provided.'}</p>
          <div className="cc-location">
            <FaMapMarkerAlt className="cc-loc-icon" />
            <span className="cc-loc-label">Location</span>
            <span className="cc-loc-value">{complaint.location || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* ── Stats bar full-width at bottom ── */}
      <div className="cc-stats">
        <div className="cc-stat">
          <button className='likes-button' onClick={()=>handleLikes(complaint._id)}>
            <FaThumbsUp className="cc-stat-icon" />
          </button>
          <span className="cc-stat-num">{likes}</span>
          <span className="cc-stat-label">Support</span>
        </div>

        <div className="cc-stat-divider" />

        {/* Official Progress Status */}
        <div className="cc-stat">
          <span
            className="cc-official-status"
            style={{ background: status.bg, color: status.text }}
          >
            <span className="cc-official-status-icon">{status.icon}</span>
            {status.label}
          </span>
          <span className="cc-stat-label">Official Status</span>
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  let [profile,setProfile] = useState({})
  const fetchComplaints = () => {
    axios.get('http://localhost:3000/complaints/get')
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error('Failed to fetch complaints:', err?.response));
  };
  let fetchUserDetails=()=>{
    axios.get(`http://localhost:3000/auth/profile/${localStorage.getItem('userId')}`)
    .then((payload)=>setProfile(payload.data))
    .catch((err)=>toast.error(err.response.data.message))
  }

  const pageVariants = {
    initial: { opacity: 0, x: 60 },
    in:      { opacity: 1, x: 0 },
    out:     { opacity: 0, x: -60 },
  };

  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  useEffect(() => { fetchComplaints();fetchUserDetails() },[]);

  return (
    <motion.div
      className="dashboard-wrapper"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <TopBar profile={profile} setProfile={setProfile}/>
      <div className="dashboard-body">
        <Sidebar activePath="/dashboard" />

        <main className="dashboard-main">
          <div className="dash-header">
            <h2 className="dash-page-title">Community Feed</h2>
            <span className="dash-count">{complaints.length} public reports</span>
          </div>

          {complaints.length === 0 ? (
            <div className="empty-state">
              <i className="ti ti-inbox" />
              <p>No reports in the community yet</p>
              <Link to="/complaint-portal" className="empty-cta">Be the first to report →</Link>
            </div>
          ) : (
            <div className="cc-list">
              {complaints.map((c, i) => (
                <ComplaintCard key={c._id || i} complaint={c} index={i} setComplaints={setComplaints} />
              ))}
            </div>
          )}
        </main>

        <RightPanel />
      </div>
    </motion.div>
  );
}

export default Dashboard;