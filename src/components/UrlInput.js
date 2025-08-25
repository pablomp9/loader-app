import React from 'react';

function UrlInput({ value, onChange }) {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.includes('spotify.com')) {
      onChange(pastedText);
    }
  };

  return (
    <div className="card fade-in-up">
      <div className="mb-6">
        <label className="section-subheader block text-loader-green font-semibold text-xl mb-4">
          Spotify URL
        </label>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="Paste a Spotify track URL here..."
          className="input-field w-full text-lg"
        />
      </div>
      <p className="text-gray-300 text-base leading-relaxed">
        Paste any Spotify track URL to get started. We'll automatically detect and fetch track information.
      </p>
    </div>
  );
}

export default UrlInput;
