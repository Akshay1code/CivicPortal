import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaClipboardList, FaChartLine, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import useAuthStore from '../store/auth.token';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async() => {
    useAuthStore.getState().clearAccessToken();
    try {
      let response = await axios.get(`https://civicportal.onrender.com/auth/logout`,{
        withCredentials:true
      });
      if(response.data.status){
        navigate('/');
        return;
      }
      toast.error("Couldn't perform logout");
    } catch (err) {
      toast.error("Couldn't perform logout");
    }
  };

  const navItems = [
    { label: 'Complaints', path: '/admin-dashboard', icon: <FaClipboardList /> },
  ];

  return (
    <>
      <div className={`admin-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span>CivicAdmin</span>
          <button className="admin-close-btn" onClick={onClose} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <div className="admin-nav-menu">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <div 
                key={item.label}
                className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="admin-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>
    </>
  );
}
