import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-animation">
          <div className="blockchain-loader">
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
          </div>
          <div className="loading-text">
            <span className="loading-message">{message}</span>
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
