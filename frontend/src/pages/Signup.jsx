import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import '../styles/Auth.css';

function Signup() {
  let [fullName, setFullName] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();
  let [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (fullName === "" || username === "" || password.trim() === "" || confirmPassword.trim() === "") {
      toast.error("Empty Fields");
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Passwords don't match");
      return;
    }
    let payload = {
      fullName: fullName.trim(),
      username: username.trim(),
      password: password.trim(),
      role:"CITIZEN"
    };
    axios.post("http://localhost:3000/auth/signup", payload)
      .then((status) => {
        setConfirmPassword("");
        setFullName("");
        setPassword("");
        setUsername("");
        console.log(status);
        toast.success(status.data?.message || "Signup successful");
        navigate('/login');
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response?.data?.message || "Signup failed");
      });
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
        Back to Home
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the Civic Portal community</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name Middle Name Last Name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Choose a Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a Strong Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>

          <button type="submit" className="btn-auth" onClick={handleSubmit}>
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;