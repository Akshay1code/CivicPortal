import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import '../styles/Profile.css';
import axios from 'axios'
import useAuthStore from '../store/auth.token';
function Profile() {
  let[profile,setProfile]=useState({})
  let nav=useNavigate()
  let fetchUserDetails=()=>{
    const token = useAuthStore.getState().accessToken;
    console.log(token)
    axios.get(`http://localhost:3000/auth/profile`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((payload)=>setProfile(payload.data))
    .catch((err)=>console.error(err.stack))
  }
  let handleDelete=()=>{
    const token = useAuthStore.getState().accessToken;
    axios.delete(`http://localhost:3000/auth/delete`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((del)=>{
      toast.success(del.data.message||del)
      nav('/')
    })
    .catch((err)=>{
      toast.error(err.response?.data?.message||err)
    })
  }



  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  useEffect(
    ()=>{
      fetchUserDetails()
    }
    ,[]
  )
  return (
    <motion.div 
      className="profile-container"
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

      <div className="profile-card">
        <div className="profile-card-header"></div>
        <div className="profile-avatar">
          {profile?.fullName?.charAt(0)||""}
        </div>
        
        <div className="profile-body">
          <h2 className="profile-name">{profile.fullName}</h2>
          <div className="profile-role">Citizen Account</div>
          
          <div className="profile-details-list">
            <div className="detail-item">
              <div className="detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">Username</span>
                <span className="detail-value">{profile.username}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">Password</span>
                <span className="detail-value">{profile.password}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn-profile btn-edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Profile
            </button>
            <button className="btn-profile btn-delete" onClick={handleDelete}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
