import {
  FaThumbsUp,
  FaMapMarkerAlt,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCommentAlt,
  FaHourglassHalf,
  FaEye,
  FaHardHat,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaBars
} from 'react-icons/fa';
import useAuthStore from '../store/auth.token';
import AdminSidebar from '../components/AdminSidebar.jsx'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

const OFFICIAL_STATUS = {
  open: { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review', icon: FaHourglassHalf },
  'in-review': { bg: '#dbeafe', text: '#1e40af', label: 'Seen by Officials', icon: FaEye },
  'in-progress': { bg: '#ede9fe', text: '#5b21b6', label: 'Work In Progress', icon: FaHardHat },
  resolved: { bg: '#dcfce7', text: '#166534', label: 'Issue Resolved', icon: FaCheckCircle },
  closed: { bg: '#fee2e2', text: '#991b1b', label: 'Closed', icon: FaTimesCircle },
  fake: { bg: '#e5e7eb', text: '#4b5563', label: 'Fake Complaint', icon: FaTrash }
};

const DEMO_POSTERS = [
  'Rahul Sharma',
  'Priya Menon',
  'Arjun Nair',
  'Sneha Patil',
  'Kiran Desai',
  'Meera Iyer',
  'Rohan Gupta',
  'Ananya Joshi'
];

const normalizeStatus = (status) => {
  if (!status) return 'open';
  const normalized = String(status).toLowerCase();
  if (normalized === 'pending') return 'open';
  return OFFICIAL_STATUS[normalized] ? normalized : 'open';
};

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

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [statusDrafts, setStatusDrafts] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('https://civicportal.onrender.com/complaints/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch complaints:', err?.response || err);
      }
    };

    fetchComplaints();
  }, [token]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName?.toLowerCase();
      if (targetTag === 'textarea' || targetTag === 'input' || targetTag === 'select') return;
      if (complaints.length === 0) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentIndex((index) => Math.max(index - 1, 0));
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentIndex((index) => Math.min(index + 1, complaints.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [complaints.length]);

  const handleMove = (direction) => {
    if (complaints.length === 0) return;
    setCurrentIndex((index) => {
      const next = index + direction;
      if (next < 0) return 0;
      if (next > complaints.length - 1) return complaints.length - 1;
      return next;
    });
  };

  const handleCommentSave = async (complaint) => {
    const adminComment = (commentDrafts[complaint._id] ?? complaint.adminComment ?? '').trim();
    const status = statusDrafts[complaint._id] ?? complaint.status ?? 'open';

    try {
      const res = await axios.put(`https://civicportal.onrender.com/complaints/admins-update/${complaint._id}`, {
        adminComment,
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComplaints((prev) =>
        prev.map((c) =>
          (c._id === complaint._id
            ? (res.data?.complaint || { ...c, adminComment, status })
            : c)
        )
      );
      setCommentDrafts((prev) => ({ ...prev, [complaint._id]: adminComment }));
      setStatusDrafts((prev) => ({ ...prev, [complaint._id]: status }));
      toast.success(res.data?.message || 'Complaint updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save admin comment');
      console.error('Failed to save admin comment:', err?.response || err);
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="admin-layout">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="admin-main-content">
          <div className="admin-mobile-header">
            <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)}>
              <FaBars />
            </button>
            <h2>Complaints</h2>
          </div>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', marginTop: '24px' }}>
            No complaints found.
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = Math.min(currentIndex, complaints.length - 1);
  const complaint = complaints[activeIndex];
  const poster = complaint.user || DEMO_POSTERS[activeIndex % DEMO_POSTERS.length];
  const likes = complaint.likes ?? 0;
  const adminComment = commentDrafts[complaint._id] ?? complaint.adminComment ?? '';
  const statusValue = statusDrafts[complaint._id] ?? normalizeStatus(complaint.status);
  const statusMeta = OFFICIAL_STATUS[statusValue] || OFFICIAL_STATUS.open;
  const StatusIcon = statusMeta.icon;

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="admin-main-content">
        <div className="admin-mobile-header">
          <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)}>
            <FaBars />
          </button>
          <h2>Complaints</h2>
        </div>
        <div style={{ marginBottom: '24px' }} className="admin-desktop-header">
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>
            Complaints
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>
            Use the arrows or keyboard left and right keys to move between complaints.
          </p>
        </div>

        <div className="admin-complaint-wrapper">
          <button
            type="button"
            className="admin-nav-button admin-desktop-nav-btn"
            onClick={() => handleMove(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous complaint"
          >
            <FaChevronLeft />
          </button>

          <div className="cc-card" style={{ cursor: 'default', width: '100%', maxWidth: '1280px' }}>
            <div className="cc-top-row" style={{ position: 'relative' }}>
              {complaint.image_url ? (
                <img
                  className="cc-complaint-image"
                  src={complaint.image_url}
                  alt={complaint.title || 'Complaint photo'}
                />
              ) : (
                <div className="cc-icon-square" style={{ background: '#1D9E75' }}>
                  <FaCommentAlt />
                </div>
              )}

              <div className="cc-content">
                <div className="cc-poster">
                  <FaUserCircle className="cc-poster-icon" />
                  <span className="cc-poster-name">{poster}</span>
                  <span className="cc-poster-tag">Citizen</span>
                  {complaint.createdAt && (
                    <>
                      <span className="cc-poster-dot">Â·</span>
                      <span
                        className="cc-poster-time"
                        title={new Date(Number(complaint.createdAt)).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      >
                        {timeAgo(complaint.createdAt)}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="cc-title">{complaint.title || 'Untitled Complaint'}</h3>
                <p className="cc-desc">{complaint.description || 'No description provided.'}</p>

                <div className="cc-location">
                  <FaMapMarkerAlt className="cc-loc-icon" />
                  <span className="cc-loc-label">Location</span>
                  <span className="cc-loc-value">{complaint.location || 'Not specified'}</span>
                </div>

                <div className="cc-admin-comment">
                  <div className="cc-admin-comment-header">
                    <div className="cc-admin-comment-label">Admin Comment</div>
                    <span className="cc-admin-comment-badge">
                      <FaCommentAlt className="cc-admin-comment-badge-icon" />
                      Official Note
                    </span>
                  </div>
                  <textarea
                    className="cc-admin-comment-input"
                    rows={3}
                    value={adminComment}
                    onChange={(e) =>
                      setCommentDrafts((prev) => ({ ...prev, [complaint._id]: e.target.value }))
                    }
                    placeholder="Type your admin note here..."
                  />
                  <div className="cc-status-field">
                    <label className="cc-status-label" htmlFor={`status-${complaint._id}`}>
                      Official Status
                    </label>
                    <select
                      id={`status-${complaint._id}`}
                      className="cc-status-select"
                      value={statusValue}
                      onChange={(e) =>
                        setStatusDrafts((prev) => ({ ...prev, [complaint._id]: e.target.value }))
                      }
                    >
                      {Object.entries(OFFICIAL_STATUS).map(([value, meta]) => (
                        <option key={value} value={value}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="cc-admin-comment-actions">
                    <button
                      type="button"
                      className="cc-admin-comment-save"
                      onClick={() => handleCommentSave(complaint)}
                    >
                      Save Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="cc-stats">
              <div className="cc-stat">
                <button className="likes-button" style={{ cursor: 'default' }}>
                  <FaThumbsUp className="cc-stat-icon" />
                </button>
                <span className="cc-stat-num">{likes}</span>
                <span className="cc-stat-label">Support</span>
              </div>

              <div className="cc-stat-divider" />

              <div className="cc-stat">
                <span
                  className="cc-official-status"
                  style={{ background: statusMeta.bg, color: statusMeta.text }}
                >
                  <StatusIcon className="cc-official-status-icon" />
                  {statusMeta.label}
                </span>
                <span className="cc-stat-label">Official Status</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="admin-nav-button admin-desktop-nav-btn"
            onClick={() => handleMove(1)}
            disabled={activeIndex === complaints.length - 1}
            aria-label="Next complaint"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="admin-mobile-nav-controls">
          <button
            type="button"
            className="admin-nav-button"
            onClick={() => handleMove(-1)}
            disabled={activeIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <div style={{ textAlign: 'center', color: '#6b7280', fontWeight: 700, alignSelf: 'center' }}>
            {activeIndex + 1} / {complaints.length}
          </div>
          <button
            type="button"
            className="admin-nav-button"
            onClick={() => handleMove(1)}
            disabled={activeIndex === complaints.length - 1}
          >
            <FaChevronRight />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280', fontWeight: 700 }} className="admin-desktop-nav-btn">
          {activeIndex + 1} / {complaints.length}
        </div>
      </div>
    </div>
  );
}

