import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/Dashboard.css';
import {
  FaRoad, FaAmbulance, FaTree, FaTrash, FaTint, FaBolt,
  FaThumbsUp, FaMapMarkerAlt, FaUserCircle,
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

const OFFICIAL_STATUS = {
  open:        { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review',    icon: <FaHourglassHalf /> },
  'in-review': { bg: '#dbeafe', text: '#1e40af', label: 'Seen by Officials', icon: <FaEye /> },
  'in-progress':{ bg: '#ede9fe', text: '#5b21b6', label: 'Work In Progress',  icon: <FaHardHat /> },
  resolved:    { bg: '#dcfce7', text: '#166534', label: 'Issue Resolved',    icon: <FaCheckCircle /> },
  closed:      { bg: '#fee2e2', text: '#991b1b', label: 'Closed',            icon: <FaCheckCircle /> },
};

const DEMO_POSTERS = [
  'Rahul Sharma', 'Priya Menon', 'Arjun Nair', 'Sneha Patil',
  'Kiran Desai', 'Meera Iyer', 'Rohan Gupta', 'Ananya Joshi',
];

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#ffffff',
    color: '#333'
  },
  mainContent: {
    marginLeft: '260px',
    flex: 1,
    padding: '32px',
    backgroundColor: '#fdfdfd',
    minHeight: '100vh'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0
  },
  filterBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center'
  },
  input: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    flex: 1,
    outline: 'none',
    fontFamily: 'inherit'
  },
  select: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    cursor: 'pointer'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '24px',
    marginBottom: '24px'
  }
};

export default function AdminComplaints() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/complaints/get')
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error('Failed to fetch complaints:', err?.response));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    // Option to make API call here
    // axios.put(`http://localhost:3000/complaints/${id}`, { status: newStatus }).catch(console.error);
  };

  const filteredComplaints = complaints.filter(c => {
    const rawCat = c.activeCategory?.id || c.category || 'roads';
    const rawStatus = c.status || 'open';
    const cTitle = c.title || '';
    const cDesc = c.description || '';
    
    const matchesSearch = cTitle.toLowerCase().includes(search.toLowerCase()) || cDesc.toLowerCase().includes(search.toLowerCase());
    
    let matchesCat = true;
    if (categoryFilter !== 'All') {
      const filterCat = categoryFilter.toLowerCase();
      const itemCat = rawCat.toLowerCase();
      if (filterCat.includes('environment') && (itemCat.includes('tree') || itemCat.includes('garbage'))) {
        matchesCat = true;
      } else if (filterCat === 'other' && itemCat.includes('accident')) {
        matchesCat = true;
      } else {
        matchesCat = itemCat.includes(filterCat.split(' ')[0]);
      }
    }

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const filterStatusMap = {
        'Pending Review': 'open',
        'Seen by Officials': 'in-review',
        'Work In Progress': 'in-progress',
        'Closed': 'closed',
        'Issue Resolved': 'resolved'
      };
      const expectedBackendStatus = filterStatusMap[statusFilter];
      matchesStatus = rawStatus === expectedBackendStatus;
    }

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.mainContent}>
        <div style={styles.headerBar}>
          <h1 style={styles.pageTitle}>Complaints Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1a6b5a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </div>

        <div style={styles.filterBar}>
          <input 
            type="text" 
            placeholder="Search complaints..." 
            style={styles.input} 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select style={styles.select} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Road">Road</option>
            <option value="Tree / Environment">Tree / Environment</option>
            <option value="Water">Water</option>
            <option value="Other">Other</option>
          </select>
          <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Seen by Officials">Seen by Officials</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Issue Resolved">Issue Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="cc-list" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {filteredComplaints.length === 0 ? (
            <div style={{...styles.card, textAlign: 'center', color: '#666'}}>No complaints found matching filters.</div>
          ) : (
            filteredComplaints.map((complaint, index) => {
              const rawCat = complaint.activeCategory?.id || complaint.category || 'roads';
              const rawStatus = complaint.status || 'open';
              const cat = CATEGORY_META[rawCat] || CATEGORY_META.roads;
              const statusInfo = OFFICIAL_STATUS[rawStatus] || OFFICIAL_STATUS.open;
              const poster = complaint.user || DEMO_POSTERS[index % DEMO_POSTERS.length];
              const likes = complaint.likes ?? Math.floor(Math.random() * 200);

              return (
                <div key={complaint._id || index} className="cc-card" style={{margin: 0}}>
                  <div className="cc-top-row">
                    <div className="cc-icon-square" style={{ background: cat.color }}>
                      {cat.icon}
                    </div>

                    <div className="cc-content">
                      <div className="cc-poster">
                        <FaUserCircle className="cc-poster-icon" />
                        <span className="cc-poster-name">{poster}</span>
                        <span className="cc-poster-tag">· Citizen</span>
                      </div>
                      <h3 className="cc-title">{complaint.title || 'Untitled Complaint'}</h3>
                      <p className="cc-desc">{complaint.description || 'No description provided.'}</p>
                      <div className="cc-location">
                        <FaMapMarkerAlt className="cc-loc-icon" />
                        <span className="cc-loc-label">Location</span>
                        <span className="cc-loc-value">{complaint.location || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cc-stats">
                    <div className="cc-stat">
                      <button className="likes-button" style={{cursor:'default'}}>
                        <FaThumbsUp className="cc-stat-icon" />
                      </button>
                      <span className="cc-stat-num">{likes}</span>
                      <span className="cc-stat-label">Support</span>
                    </div>

                    <div className="cc-stat-divider" />

                    <div className="cc-stat" style={{flex: 1, justifyContent: 'flex-end', gap: '12px'}}>
                      <span className="cc-stat-label">Admin Action:</span>
                      <select 
                        style={{
                          ...styles.select, 
                          backgroundColor: statusInfo.bg, 
                          color: statusInfo.text,
                          fontWeight: '600',
                          border: `1px solid ${statusInfo.text}33`
                        }}
                        value={rawStatus}
                        onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      >
                        <option value="open">Pending Review</option>
                        <option value="in-review">Seen by Officials</option>
                        <option value="in-progress">Work In Progress</option>
                        <option value="resolved">Issue Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
