import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import '../styles/Profile.css';
import axios from 'axios'
import useAuthStore from '../store/auth.token';

const NAME_RE = /^[a-zA-Z ]+$/;
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function Profile() {
  const [profile, setProfile] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const nav = useNavigate();

  let fetchUserDetails=()=>{
    const token = useAuthStore.getState().accessToken;
    axios.get(`https://civicportal.onrender.com/auth/profile`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((payload)=>{
      setProfile(payload.data);
      setOriginalProfile(payload.data);
      setEditForm({
        fullName: payload.data?.fullName || '',
        username: payload.data?.username || '',
        password: ''
      });
    })
    .catch((err)=>console.error(err.stack))
  }

  const openEditModal = () => {
    setEditForm({
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    const token = useAuthStore.getState().accessToken;
    const fullName = editForm.fullName.trim();
    const username = editForm.username.trim();
    const password = editForm.password.trim();
    const currentFullName = (originalProfile?.fullName || '').trim();
    const currentUsername = (originalProfile?.username || '').trim();

    const payload = {};

    if (fullName !== currentFullName) {
      if (!NAME_RE.test(fullName)) {
        toast.error('Name does not contains numbers or special Symbols');
        return;
      }

      if (fullName.split(' ').length !== 3) {
        toast.error("Full name doesn't meet with Gov guidelines mention names with spaces as shown in fields.");
        return;
      }

      payload.fullName = fullName;
    }

    if (username !== currentUsername) {
      if (!USERNAME_RE.test(username)) {
        toast.error("username doesn't meet with standard guidelines");
        return;
      }

      payload.username = username;
    }

    if (password) {
      if (!PASSWORD_RE.test(password)) {
        toast.error("password doesn't meet with standard guidelines");
        return;
      }

      payload.password = password;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      const res = await axios.put('https://civicportal.onrender.com/auth/update-details', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(res.data?.message || 'Profile updated successfully');
      if (res.data?.user) {
        setProfile(res.data.user);
        setOriginalProfile(res.data.user);
      } else {
        await fetchUserDetails();
      }
      setShowEditModal(false);
      setEditForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setIsSaving(false);
    }
  };

  let handleDelete=()=>{
    const token = useAuthStore.getState().accessToken;
    axios.delete(`https://civicportal.onrender.com/auth/delete`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((del)=>{
      toast.success(del.data.message||del)
      useAuthStore.getState().clearAccessToken();
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
      const previousOverflow = document.body.style.overflow;
      const previousHeight = document.body.style.height;
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      return () => {
        document.body.style.overflow = previousOverflow;
        document.body.style.height = previousHeight;
      };
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
      <a onClick={() => nav(-1)} className="back-link" style={{ cursor: 'pointer', top: '24px', left: '24px', position: 'absolute', color: '#085041', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
      </a>

      <div className="profile-card">
        <div className="profile-card-header"></div>
        <div className="profile-avatar">
          {profile?.fullName?.charAt(0)||""}
        </div>
        
        <div className="profile-body">
          <h2 className="profile-name">{profile.fullName}</h2>
          <div className="profile-role">{profile.role} Account</div>
          
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
              <span className="detail-value">********</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn-profile btn-edit" onClick={openEditModal} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Profile
          </button>
          <button className="btn-profile btn-delete" onClick={handleDelete} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              Delete Account
          </button>
        </div>
      </div>
    </div>

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8, 80, 65, 0.55)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 50
            }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: 0.98 }}
              transition={{ type: 'tween', duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '520px',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #eef2f7' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Edit Profile</h3>
                <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '14px' }}>
                  Update your display name, username, or password.
                </p>
              </div>

              <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    Full Name
                  </label>
                  <input
                    value={editForm.fullName}
                    onChange={(e) => handleEditChange('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    Username
                  </label>
                  <input
                    value={editForm.username}
                    onChange={(e) => handleEditChange('username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => handleEditChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div style={{ padding: '18px 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eef2f7' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    color: '#374151',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={isSaving}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isSaving ? '#6b8f84' : '#1D9E75',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Profile;
