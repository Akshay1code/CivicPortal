import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Landing.css';
import axios from 'axios'
function Landing() {
  let nav=useNavigate();
  let sessionCheck=async()=>{
    let res=await axios.get(`http://localhost:3000/auth/session-active`,{
      withCredentials:true
    })
    console.log(res.data.status)
    if(res.data.status){
      nav('/dashboard')
    }
  }
  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  useEffect(
    ()=>{
      sessionCheck()
    }
    ,[]
  )
  return (
    <motion.div 
      className="landing-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-bg-curve"></div>
        <div className="hero-content">
          <div className="hero-left">
            <span className="tag-line">Civic Issue Management</span>
            <h1 className="hero-title">
              <span className="accent">Civic Portal</span><br />
              where complaints are tracked and resolved
            </h1>
            <p className="hero-subtext">
              Reduce the time it takes to resolve citizen complaints, streamline internal workflows, and manage a higher volume of civic issues across all departments.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">File a Complaint</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="phone-mockup-wrapper">
              <div className="phone-bg-circle">
                <div className="node node-1"></div>
                <div className="node node-2"></div>
                <div className="node node-3"></div>
              </div>
              <div className="phone phone-1">
                <div className="phone-header">Civic Portal</div>
                <div className="phone-body">
                  <div className="phone-card">
                    <div className="phone-card-title">Pothole on Main St.</div>
                    <span className="badge badge-open">Open</span>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-title">Broken Streetlight</div>
                    <span className="badge badge-progress">In Progress</span>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-title">Water Leak</div>
                    <span className="badge badge-resolved">Resolved</span>
                  </div>
                </div>
              </div>
              <div className="phone phone-2">
                <div className="phone-header">Staff View</div>
                <div className="phone-body">
                  <div className="phone-card">
                    <div className="phone-card-title">Assign Teams</div>
                    <span className="badge badge-progress">Pending</span>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-title">Review Reports</div>
                    <span className="badge badge-resolved">Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        Join 500+ municipalities using Civic Portal
      </div>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">1</div>
            <h4>Register a complaint</h4>
            <p>Start by opening the portal and registering your civic issue.</p>
          </div>
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">2</div>
            <h4>Take a picture</h4>
            <p>Capture a clear photo of the complaint issue for better review.</p>
          </div>
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">3</div>
            <h4>Click register</h4>
            <p>Submit the complaint after adding the photo and required details.</p>
          </div>
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">4</div>
            <h4>Gain priority support</h4>
            <p>More support from other citizens pushes your complaint higher in the queue.</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h4>Admins acknowledge and resolve</h4>
            <p>Admins visit, acknowledge the complaint, and work toward resolution.</p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="cta-section">
        <h2>Ready to modernize civic complaint management?</h2>
        <Link to="/signup" className="btn btn-cta">Get Started Today</Link>
      </section>
    </motion.div>
  );
}

export default Landing;
