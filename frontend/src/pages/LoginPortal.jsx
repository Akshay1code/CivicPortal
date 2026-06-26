import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import '../styles/Auth.css';
import useAuthStore from '../store/auth.token';

function LoginPortal() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [authState, setAuthState] = useState("idle");
  let nav = useNavigate();
  let setAccessToken = useAuthStore((state) => state.setAccessToken);
  let handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password.trim() === "") {
      toast.error("Empty Fields");
      return;
    }
    let payload = { username: username.trim(), password: password.trim() };
    let role="";
    let loadingTimer = setTimeout(() => {
      setAuthState("loading");
    }, 700);

    setAuthState("authenticating");

    try {
      let res = await axios.post("https://civicportal.onrender.com/auth/signin", payload, {
        withCredentials: true
      });
      clearTimeout(loadingTimer);
      toast.success(res.data?.message || res);
      console.log(res.data.accessToken)
      setAccessToken(res.data.accessToken);
      console.log("Zustand: ",useAuthStore.getState());
      role=res.data.role
      if(role=="ADMIN"){
        nav('/admin-dashboard')
        return
      }
      nav('/dashboard');
    } catch (err) {
      clearTimeout(loadingTimer);
      console.log(err.stack);
      toast.error(err.data?.message || err.response?.data?.message || "Login Failed");
      setAuthState("idle");
    }
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

  return (
    <motion.div 
      className="auth-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="auth-bg-blob"></div>
      <div className="auth-bg-blob-2"></div>
      
      <Link to="/" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your civic portal</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Enter Username" 
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control"
              placeholder="Enter Password" 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <button
            type="submit"
            className="btn-auth"
            onClick={handleSubmit}
            disabled={authState !== "idle"}
          >
            {authState === "authenticating"
              ? "Authenticating..."
              : authState === "loading"
                ? "Loading..."
                : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?
            <Link to='/signup' className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPortal;
