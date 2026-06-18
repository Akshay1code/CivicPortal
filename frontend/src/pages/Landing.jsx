import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Landing.css';

function Landing() {
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
              <button className="btn btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Video
              </button>
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

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <h3>Easy complaint filing</h3>
            <p>Citizens can quickly submit issues with photos and location data in just a few taps.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Real-time tracking</h3>
            <p>Keep everyone informed with live status updates and transparent progress tracking.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
            </div>
            <h3>Department routing</h3>
            <p>Automatically route complaints to the correct municipal department for faster response.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <h3>Smart notifications</h3>
            <p>Automated alerts keep citizens and staff updated at every stage of the resolution process.</p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="stat-item">
          <div className="stat-number">78%</div>
          <div className="stat-label">Faster Resolution</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Municipalities</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">2M+</div>
          <div className="stat-label">Complaints Resolved</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">1</div>
            <h4>File a complaint</h4>
            <p>Submit an issue through our mobile-friendly portal.</p>
          </div>
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">2</div>
            <h4>Auto-assigned</h4>
            <p>The system routes the issue to the right department.</p>
          </div>
          <div className="step">
            <div className="step-arrow"></div>
            <div className="step-number">3</div>
            <h4>Track progress</h4>
            <p>Get real-time updates as work is being done.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Resolved & closed</h4>
            <p>The issue is fixed and the complaint is closed.</p>
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