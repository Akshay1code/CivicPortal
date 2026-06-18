import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRoad, FaAmbulance, FaTree, FaTrash, FaTint, FaBolt } from 'react-icons/fa';
import '../styles/ComplaintPortal.css';
import {toast} from 'react-toastify'
import axios from 'axios'
const CATEGORIES = [
  { id: 'roads', icon: <FaRoad />, name: 'Roads & Infrastructure' },
  { id: 'accident', icon: <FaAmbulance />, name: 'Accident / Emergency' },
  { id: 'tree', icon: <FaTree />, name: 'Fallen Tree' },
  { id: 'garbage', icon: <FaTrash />, name: 'Garbage / Sanitation' },
  { id: 'water', icon: <FaTint />, name: 'Water Supply' },
  { id: 'electricity', icon: <FaBolt />, name: 'Electricity' }
];

function ComplaintPortal() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [user,setUser]=useState("");
  let [title,setTitle]=useState("");
  let [description,setDescription]=useState("");
  let [location,setLocation]=useState("");
  let fetchUserDetails=()=>{
    axios.get(`http://localhost:3000/auth/profile/${localStorage.getItem('userId')}`)
    .then((payload)=>{console.log(payload.data);setUser(payload.data.fullName)})
    .catch((err)=>toast.error(err.response.data.message))
  }
  useEffect(
    ()=>{
      fetchUserDetails()
    }
    ,[]
  )
  let handleSubmit=()=>{
    if(! title.trim()===""||! description.trim()===""||! location.trim()===""){
      toast.error('Empty fields')
    }
    let payload={
      user:user,
      title:title.trim(),
      description:description.trim(),
      location:location.trim(),
      category:activeCategory.id,
      likes:0,
      status:"PENDING",
      supportedUsers:[]
    }
    console.log(user)
    axios.post('http://localhost:3000/complaints/register',payload)
    .then((status)=>toast.success(status.data.message))
    .catch((err)=>toast.error(err.response.data.message))
  }
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      className="complaint-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Link to="/dashboard" className="back-link" style={{ top: '24px', left: '24px', position: 'absolute', color: '#085041', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Dashboard
      </Link>

      <div className="complaint-card">
        {/* Left Form Section */}
        <div className="complaint-form-section">
          <div className="complaint-header">
            {activeCategory.icon} {activeCategory.name}
          </div>

          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="e.g. Pothole near Kurla Station" 
            onChange={(e)=>setTitle(e.target.value)}/>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Provide details about the issue..."
            onChange={(e)=>setDescription(e.target.value)}></textarea>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="e.g. Kurla Station Road" 
            onChange={(e)=>setLocation(e.target.value)}/>
          </div>

          <button className="btn-submit" onClick={handleSubmit}>Submit</button>
        </div>

        {/* Right Categories Section */}
        <div className="complaint-categories-section">
          <div className="categories-title">Select Category</div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                className={`category-card ${activeCategory.id === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ComplaintPortal;