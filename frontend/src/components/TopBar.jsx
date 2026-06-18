import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function TopBar({profile, setProfile}) {
  const avatar = profile?.fullName?.charAt(0) || "?";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <i className="ti ti-menu-2" />
        <span className="topbar-title">Welcome {profile.fullName}</span>
      </div>
      <div className="topbar-right">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <i className="ti ti-logout" />
          <span>Logout</span>
        </button>
        <Link to="/profile" className="avatar" style={{textDecoration: 'none'}}>{avatar}</Link>
      </div>
    </div>
  );
}
export default TopBar