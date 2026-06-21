import React, { useEffect, useState } from 'react';
import '../styles/Loading.css';

const Loading = ({ onComplete, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className="loading-container">
      <svg className="spinner-svg" viewBox="25 25 50 50">
        <circle
          className="spinner-circle-bg"
          cx="50"
          cy="50"
          r="20"
        ></circle>
        <circle
          className="spinner-circle"
          cx="50"
          cy="50"
          r="20"
        ></circle>
      </svg>
      <p className="loading-text">This Shall take few seconds of your time</p>
    </div>
  );
};

export default Loading;
