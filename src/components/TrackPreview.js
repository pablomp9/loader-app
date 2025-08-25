import React from 'react';

function TrackPreview({ trackInfo, onDownload, isDownloading, selectedFormat }) {
  return (
    <div className="card fade-in-up" style={{ zIndex: 1 }}>
      <div className="text-center">
        <h3 className="section-header text-3xl font-bold text-white mb-8">
          Track Preview
        </h3>
        
        {trackInfo ? (
          <>
            {/* Track Artwork */}
            <div className="relative inline-block mb-8 sm:mb-10">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-loader-green-medium shadow-xl sm:shadow-2xl shadow-loader-green/30 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-loader-green/40">
                <img
                  src={trackInfo.artwork}
                  alt="Album Artwork"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                />
              </div>
            </div>
            
            {/* Track Information */}
            <div className="space-y-5 text-left max-w-lg mx-auto">
              <div className="stat-item">
                <span className="stat-label">Title:</span>
                <span className="stat-value">{trackInfo.title}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Artist:</span>
                <span className="stat-value">{trackInfo.artist}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Album:</span>
                <span className="stat-value">{trackInfo.album}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Duration:</span>
                <span className="stat-value">{trackInfo.duration}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Release Date:</span>
                <span className="stat-value">{trackInfo.releaseDate}</span>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={onDownload}
                disabled={isDownloading}
                className={`btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isDownloading ? (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-base">Downloading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm sm:text-base">Download Track</span>
                  </div>
                )}
              </button>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 px-2">
                Format: {selectedFormat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
            
            {/* Download Status */}
            {isDownloading && (
              <div className="mt-8 p-6 bg-loader-green-light border border-loader-green rounded-2xl animate-pulse">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-loader-green"></div>
                  <p className="text-loader-green font-semibold text-xl">
                    Downloading... Please wait
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Placeholder when no track is selected */
          <div className="py-16 sm:py-20">
            <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto rounded-2xl sm:rounded-3xl border-2 border-dashed border-loader-green-medium flex items-center justify-center bg-loader-green-light bg-opacity-20 transition-all duration-500 ease-out hover:bg-opacity-30">
              <div className="text-center px-4">
                <div className="text-6xl sm:text-7xl lg:text-8xl text-loader-green mb-6 sm:mb-8 animate-bounce">🎵</div>
                <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">No track selected</p>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                  Paste a Spotify URL above to preview
                </p>
                <div className="text-loader-green text-sm sm:text-base space-y-1 sm:space-y-2">
                  <p>✨ Beautiful artwork</p>
                  <p>📊 Track details</p>
                  <p>⬇️ Easy download</p>
                  <p>🤖 Real-time artist info</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackPreview;
