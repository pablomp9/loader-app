import React from 'react';

function Terminal({ logs }) {
  return (
    <div className="mt-6">
      <div className="card">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">
            System Terminal
          </h3>
          <p className="text-gray-400 text-sm">
            Download logs and system information
          </p>
        </div>
        
        <div className="bg-black bg-opacity-50 rounded-lg p-4 h-64 overflow-y-auto">
          <div className="font-mono text-sm text-green-400 space-y-1">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                No logs available. Start a download to see activity here.
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-400 text-xs">
          <p>Terminal shows real-time download progress and system messages</p>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
