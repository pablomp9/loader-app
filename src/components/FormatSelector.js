import React, { useState } from 'react';

function FormatSelector({ selectedFormat, onFormatChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatOptions = [
    {
      id: 'mp3-good',
      name: 'MP3 - Fast Download',
      description: '128kbps, fastest download for mobile devices',
      quality: 'good'
    },
    {
      id: 'mp3-better',
      name: 'MP3 - Balanced Speed',
      description: '320kbps, optimal speed and quality balance',
      quality: 'better'
    },
    {
      id: 'wav-great',
      name: 'WAV - High Quality',
      description: '48kHz, professional quality, moderate speed',
      quality: 'best'
    },
    {
      id: 'flac-lossless',
      name: 'FLAC - Studio Quality',
      description: 'Lossless compression, highest quality, slower speed',
      quality: 'best'
    }
  ];

  const selectedOption = formatOptions.find(option => option.id === selectedFormat);

  const handleFormatSelect = (formatId) => {
    onFormatChange(formatId);
    setIsOpen(false);
  };

  return (
    <div className="card relative format-selector-container fade-in-up" style={{ zIndex: 1000 }}>
      <div className="mb-6">
        <label className="section-subheader block text-loader-green font-semibold text-xl mb-4">
          Download Format
        </label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="input-field w-full text-left flex items-center justify-between cursor-pointer interactive-hover"
          >
            <span className="font-semibold">{selectedOption?.name}</span>
            <svg
              className={`w-6 h-6 transition-all duration-500 ease-out ${
                isOpen ? 'rotate-180 text-loader-green' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div 
              className="format-options-dropdown"
              style={{
                position: 'absolute',
                zIndex: 99999,
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '12px',
                backgroundColor: '#1a1a1a',
                backdropFilter: 'none'
              }}
            >
              {formatOptions.map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => handleFormatSelect(option.id)}
                  className={`format-option ${
                    selectedFormat === option.id ? 'selected' : ''
                  }`}
                  style={{
                    backgroundColor: selectedFormat === option.id ? '#22c55e' : '#1a1a1a',
                    backdropFilter: 'none',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex-1">
                    <div className="format-name">{option.name}</div>
                    <div className="format-desc">{option.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {option.id === 'mp3-good' && '⚡ Fastest'}
                      {option.id === 'mp3-better' && '⚡⚡ Fast'}
                      {option.id === 'wav-great' && '⚡⚡⚡ Moderate'}
                      {option.id === 'flac-lossless' && '⚡⚡⚡⚡ Slower'}
                    </div>
                  </div>
                  <div className={`quality-indicator ${option.quality}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-300 text-base leading-relaxed">
        Choose your preferred balance of download speed and audio quality
      </p>
    </div>
  );
}

export default FormatSelector;
