import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ErrorPage.css';

const ErrorPage = ({ errorMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const displayMessage = errorMessage || location.state?.errorMessage || 'An unexpected error occurred.';

  return (
    <>
      <div className="error-page-container">
        <div className="error-bg-blob"></div>
        <div className="error-bg-blob-2"></div>
        {/* Accessible error container */}
        <div
          className="error-card"
          role="alert"
          aria-labelledby="error-title"
          aria-describedby="error-message"
        >
          {/* Prominent lock/shield icon with pulsing animation */}
          <div className="error-icon-wrapper" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          {/* Error Message Display */}
          <h1 id="error-title" className="error-title" style={{ marginBottom: '32px' }}>
            {displayMessage}
          </h1>

          {/* Action buttons matching site design */}
          <div className="error-actions">
            <button
              className="btn-error-secondary"
              aria-label="Go back to home"
              onClick={() => navigate('/')}
            >
              Go Back
            </button>
          </div>

          {/* Footer note */}
          <div className="error-footer">
            If this is a mistake, contact your <a href="/admin">administrator</a>.
          </div>
        </div>
      </div>
    </>
  );
};

// Typed props
ErrorPage.propTypes = {
  errorMessage: PropTypes.string
};

export default ErrorPage;
