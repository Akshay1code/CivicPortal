import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/auth.token';
function TopBar({profile, setProfile}) {
  const avatar = profile?.fullName?.charAt(0) || "?";
  const navigate = useNavigate();

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

  return (
    <div className="topbar">
      <div className="topbar-left">
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
