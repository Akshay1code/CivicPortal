import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaClipboardList, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import useAuthStore from '../store/auth.token';

const sidebarStyles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100
  },
  sidebarHeader: {
    padding: '24px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a6b5a',
    borderBottom: '1px solid #eee'
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
    flex: 1
  },
  navItem: {
    padding: '16px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    borderLeft: '3px solid transparent'
  },
  navItemActive: {
    backgroundColor: '#e8f5f0',
    borderLeft: '3px solid #1a6b5a',
    fontWeight: 'bold',
    color: '#1a6b5a'
  },
  logoutBtn: {
    margin: 'auto 24px 24px 24px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 'bold',
    color: '#333'
  }
};

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async() => {
    useAuthStore.getState().clearAccessToken();
    let response=await axios.get(`http://localhost:3000/auth/logout`,{
      withCredentials:true
    })
    if(response.data.status){
      navigate('/')
      return
    }
    toast.error("Couldn't perform logout")

  };

  const navItems = [
    { label: 'Complaints', path: '/admin-dashboard', icon: <FaClipboardList /> },
  ];

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.sidebarHeader}>CivicAdmin</div>
      <div style={sidebarStyles.navMenu}>
        {navItems.map(item => {
          // Exact match for active state
          const isActive = location.pathname === item.path || (item.label === 'Analysis' && false);
          return (
            <div 
              key={item.label}
              style={{
                ...sidebarStyles.navItem,
                ...(isActive ? sidebarStyles.navItemActive : {})
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </div>
      <div style={sidebarStyles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
}
