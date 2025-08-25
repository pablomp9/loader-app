import React from 'react';

function Header() {
  return (
    <header className="text-center fade-in-up">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-loader-green font-helvetica mb-3 sm:mb-4 transition-all duration-700 ease-out hover:scale-105 hover:text-white transform">
        Loader
      </h1>
      <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed transition-all duration-500 ease-out hover:text-loader-green px-4">
        The fastest Spotify downloader
      </p>
    </header>
  );
}

export default Header;
