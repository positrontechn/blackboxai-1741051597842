import React from 'react';
import './CommunityLoadingAnimation.css';

const CommunityLoadingAnimation = () => {
  return (
    <div className="community-loading-container">
      <div className="loading-content">
        <div className="loading-icon">
          <svg className="tree-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L3 19H21L12 2Z" 
              className="tree-path"
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 19V22" 
              className="tree-trunk"
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="loading-text">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLoadingAnimation;
