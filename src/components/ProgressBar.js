import React from 'react';

function ProgressBar({ progress }) {
  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-4">
          Download Progress
        </h3>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-3">
          <span className="text-loader-green font-medium">
            {progress}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
