import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import RightPanel from '../components/RightPanel';

import '../styles/Dashboard.css';
import axios from 'axios';
import useAuthStore from '../store/auth.token.js';
import { toast } from 'react-toastify'
import {
  FaRoad, FaAmbulance, FaTree, FaTrash, FaTint, FaBolt,
  FaThumbsUp, FaMapMarkerAlt, FaUserCircle,
  FaEye, FaHardHat, FaCheckCircle, FaHourglassHalf, FaEllipsisV, FaCommentAlt, FaTimes, FaImage
} from 'react-icons/fa';

// Category metadata: icon, label, placeholder gradient colour
const CATEGORY_META = {
  roads: { icon: <FaRoad />, label: 'Roads & Infrastructure', color: '#4a90a4' },
  accident: { icon: <FaAmbulance />, label: 'Accident / Emergency', color: '#c0392b' },
  tree: { icon: <FaTree />, label: 'Fallen Tree', color: '#27ae60' },
  garbage: { icon: <FaTrash />, label: 'Garbage / Sanitation', color: '#e67e22' },
  water: { icon: <FaTint />, label: 'Water Supply', color: '#2980b9' },
  electricity: { icon: <FaBolt />, label: 'Electricity', color: '#f39c12' },
};


// Official progress statuses shown to citizens
const OFFICIAL_STATUS = {
  open: { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review', icon: <FaHourglassHalf /> },
  'in-review': { bg: '#dbeafe', text: '#1e40af', label: 'Seen by Officials', icon: <FaEye /> },
  'in-progress': { bg: '#ede9fe', text: '#5b21b6', label: 'Work In Progress', icon: <FaHardHat /> },
  resolved: { bg: '#dcfce7', text: '#166534', label: 'Issue Resolved', icon: <FaCheckCircle /> },
  closed: { bg: '#fee2e2', text: '#991b1b', label: 'Closed', icon: <FaCheckCircle /> },
  fake: { bg: '#e5e7eb', text: '#4b5563', label: 'Fake Complaint', icon: <FaTrash /> },
};

const sortComplaintsBySupport = (items) =>
  [...items].sort((a, b) => {
    const likesDiff = (b.likes ?? 0) - (a.likes ?? 0);
    if (likesDiff !== 0) return likesDiff;
    return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
  });

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

// Converts a date string to Instagram-style relative time (e.g. "2h", "3d", "just now")
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

function ComplaintCard({ complaint, index, setComplaints, onEdit, onDelete, profile }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const cat = CATEGORY_META[complaint.activeCategory?.id || complaint.category] || CATEGORY_META.roads;
  const status = OFFICIAL_STATUS[complaint.status] || OFFICIAL_STATUS.open;
  const likes = complaint.likes ?? 0;
  const accessToken = useAuthStore.getState().accessToken
  const isOwner = !!profile?._id;

  let handleLikes = (id) => {
    let isUser = false
    axios.post(`https://civicportal.onrender.com/complaints/like/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        isUser = res.data
        if (isUser) {
          console.log("Lmao Inc")
          setComplaints(prev =>
            sortComplaintsBySupport(
              prev.map(c => c._id === id ? { ...c, likes: (c.likes ?? 0) + 1 } : c)
            )
          );
          return
        }
        console.log("Lmao dec")
        setComplaints(prev =>
          sortComplaintsBySupport(
            prev.map(c => c._id === id ? { ...c, likes: (c.likes ?? 0) - 1 } : c)
          )
        );
      })
      .catch((err) => { console.error(err.response) })

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
      {/* â”€â”€ Top row: icon square LEFT + content RIGHT â”€â”€ */}
      <div className="cc-top-row" style={{ position: 'relative', paddingTop: '12px' }}>

        {/* Dropdown Menu */}
        {isOwner && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
            <button
              type="button"
              aria-label="Open complaint actions"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                border: '1px solid rgba(17,24,39,0.08)',
                background: '#fff',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#666',
                padding: 0
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaEllipsisV />
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 42,
                background: 'var(--clr-surface, #ffffff)',
                border: '1px solid var(--clr-border, #eee)',
                borderRadius: 'var(--radius-lg, 16px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                zIndex: 100,
                minWidth: '160px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--clr-text-main, #333)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid var(--clr-border, #eee)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-bg-main, #f9fafb)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowDropdown(false); onEdit(complaint); }}
                >
                  <i className="ti ti-edit" style={{ fontSize: '15px' }} aria-hidden="true" />
                  Update
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowDropdown(false); onDelete(complaint._id); }}
                >
                  <i className="ti ti-trash" style={{ fontSize: '15px' }} aria-hidden="true" />
                  Delete
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image / Icon square */}
        {complaint.image_url ? (
          <img
            className="cc-complaint-image"
            src={complaint.image_url}
            alt={complaint.title}
          />
        ) : (
          <div className="cc-icon-square" style={{ background: cat.color }}>
            {cat.icon}
          </div>
        )}

        {/* Content right */}
        <div className="cc-content">
          {/* Posted by */}
          <div className="cc-poster">
            <FaUserCircle className="cc-poster-icon" />
            <span className="cc-poster-name">{complaint.user || 'Citizen'}</span>
            <span className="cc-poster-tag">Â· Citizen</span>
            {complaint.createdAt && (
              <>
                <span className="cc-poster-dot">Â·</span>
                <span className="cc-poster-time" title={new Date(Number(complaint.createdAt)).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}>
                  {timeAgo(complaint.createdAt)}
                </span>
              </>
            )}
          </div>
          <h3 className="cc-title">{complaint.title}</h3>
          <p className="cc-desc">{complaint.description || 'No description provided.'}</p>
          <div className="cc-location">
            <FaMapMarkerAlt className="cc-loc-icon" />
            <span className="cc-loc-label">Location</span>
            <span className="cc-loc-value">{complaint.location || 'Not specified'}</span>
          </div>

          <div className={`cc-admin-comment ${complaint.adminComment?.trim() ? '' : 'cc-admin-comment--empty'}`}>
            <div className="cc-admin-comment-header">
              <div className="cc-admin-comment-label">Admin Comment</div>
              {complaint.adminComment?.trim() && (
                <span
                  className="cc-admin-comment-badge"
                  style={{ background: status.bg, color: status.text }}
                >
                  <FaCommentAlt className="cc-admin-comment-badge-icon" />
                  Official Note
                </span>
              )}
            </div>
            {complaint.adminComment?.trim() ? (
              <p className="cc-admin-comment-text">{complaint.adminComment}</p>
            ) : (
              <p className="cc-admin-comment-placeholder">
                No admin note yet. An official message may appear here later.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€ Stats bar full-width at bottom â”€â”€ */}
      <div className="cc-stats">
        <div className="cc-stat">
          <button className='likes-button' onClick={() => handleLikes(complaint._id)}>
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

function EditModal({ complaint, onClose, onSave }) {
  const [title, setTitle] = useState(complaint.title || "");
  const [description, setDescription] = useState(complaint.description || "");
  const [location, setLocation] = useState(complaint.location || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    if (image) formData.append("image", image);
    onSave(complaint._id, formData);
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#111',
    background: '#fff',
    transition: 'border 0.15s'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.55)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #eee',
        width: '90%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Edit complaint</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              color: '#555',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              lineHeight: 1
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter complaint title"
              required
              style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid #1a6b5a'}
              onBlur={e => e.target.style.border = '1px solid #ddd'}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.border = '1px solid #1a6b5a'}
              onBlur={e => e.target.style.border = '1px solid #ddd'}
            />
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <div style={{ position: 'relative' }}>
              <FaMapMarkerAlt style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '15px',
                color: '#999'
              }} />
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter location"
                style={{ ...inputStyle, paddingLeft: '34px' }}
                onFocus={e => e.target.style.border = '1px solid #1a6b5a'}
                onBlur={e => e.target.style.border = '1px solid #ddd'}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Update photo (optional)</label>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '20px',
              border: '1.5px dashed #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              background: preview ? '#fff' : '#fafafa',
              overflow: 'hidden',
              minHeight: '80px'
            }}>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <>
                  <FaImage style={{ fontSize: '28px', color: '#6b7280' }} />
                  <span style={{ fontSize: '13px', color: '#999' }}>Click to upload image</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: 0,
          background: '#fff'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              background: '#f5f5f5',
              color: '#333',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#1a6b5a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaCheckCircle /> Save changes
          </button>
        </div>

      </div>
    </div>
  );
}
function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [editingComplaint, setEditingComplaint] = useState(null);
  let [profile, setProfile] = useState({})
  let nav = useNavigate()
  const fetchComplaints = () => {
    const accessToken = useAuthStore.getState().accessToken;
    axios.get('https://civicportal.onrender.com/complaints/get', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => setComplaints(sortComplaintsBySupport(Array.isArray(res.data) ? res.data : [])))
      .catch((err) => console.error('Failed to fetch complaints:', err?.response));
  };

  let fetchUserDetails = () => {
    const token = useAuthStore.getState().accessToken;
    axios.get(`https://civicportal.onrender.com/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

      .then((payload) => setProfile(payload.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error");
        nav('/error', {
          state: { errorMessage: 'Unauthorised Person Detected' },
          replace: true
        })
      })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const accessToken = useAuthStore.getState().accessToken;
      let res = await axios.delete(`https://civicportal.onrender.com/complaints/delete/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.status === 200) {
        toast.success("Complaint deleted successfully");
        setComplaints(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete complaint");
    }
  }

  const handleUpdate = async (id, formData) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      let res = await axios.put(`https://civicportal.onrender.com/complaints/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status === 200) {
        toast.success("Complaint updated successfully");
        fetchComplaints();
        setEditingComplaint(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update complaint");
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 60 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -60 },
  };

  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  useEffect(() => { fetchComplaints(); fetchUserDetails() }, []);

  return (
    <motion.div
      className="dashboard-wrapper"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <TopBar profile={profile} setProfile={setProfile} />
      <div className="dashboard-body">

        <main className="dashboard-main">
          <div className="dash-header">
            <h2 className="dash-page-title">Community Feed</h2>
            <span className="dash-count">{complaints.length} public reports</span>
          </div>

          {complaints.length === 0 ? (
            <div className="empty-state">
              <i className="ti ti-inbox" />
              <p>No reports in the community yet</p>
              <Link to="/complaint-portal" className="empty-cta">Be the first to report â†’</Link>
            </div>
          ) : (
            <div className="cc-list">
              {complaints.map((c, i) => (
                <ComplaintCard key={c._id || i} complaint={c} index={i} setComplaints={setComplaints} onEdit={setEditingComplaint} onDelete={handleDelete} profile={profile} />
              ))}
            </div>
          )}
        </main>

        <RightPanel />
      </div>

      <AnimatePresence>
        {editingComplaint && (
          <EditModal
            complaint={editingComplaint}
            onClose={() => setEditingComplaint(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Dashboard;

