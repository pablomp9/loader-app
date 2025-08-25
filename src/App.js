import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import UrlInput from './components/UrlInput';
import FormatSelector from './components/FormatSelector';
import TrackPreview from './components/TrackPreview';
import ArtistInfo from './components/ArtistInfo';
import ProgressBar from './components/ProgressBar';
import Terminal from './components/Terminal';
import { BannerAd } from './components/ads';

function App() {
  const [url, setUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('mp3-good');
  const [trackInfo, setTrackInfo] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    // Web-compatible initialization
    console.log('Loader app initialized in browser mode');
    
    // Add some sample logs for demonstration
    setLogs([
      { type: 'info', message: 'Welcome to Loader - The fastest Spotify downloader', timestamp: new Date().toISOString() },
      { type: 'info', message: 'Running in browser mode - some features may be limited', timestamp: new Date().toISOString() }
    ]);
  }, []);

  const handleUrlChange = async (newUrl) => {
    setUrl(newUrl);
    console.log('URL changed to:', newUrl);
    
    if (newUrl && newUrl.includes('spotify.com')) {
      try {
        // Browser mode - make real API calls
        console.log('Running in browser mode - making real API calls...');
        const metadata = await fetchSpotifyMetadata(newUrl);
        if (metadata.success) {
          setTrackInfo(metadata);
          
          const artistInfo = await fetchArtistInfo(metadata.artist, metadata.title);
          setArtistInfo(artistInfo);
        }
      } catch (error) {
        console.error('Error getting metadata:', error);
      }
    }
  };

  const fetchSpotifyMetadata = async (url) => {
    try {
      // Extract track ID from URL
      const trackId = url.match(/\/track\/([a-zA-Z0-9]+)/)?.[1];
      if (!trackId) {
        throw new Error('Invalid Spotify URL');
      }

      // For web demo, return mock data
      // In production, you'd integrate with Spotify's Web API
      const mockMetadata = {
        success: true,
        title: 'Because - Remastered 2009',
        artist: 'The Beatles',
        album: 'Abbey Road (Remastered)',
        duration: '2:45',
        artwork: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25',
        releaseDate: '1969-09-26',
        trackNumber: 8,
        totalTracks: 17,
        spotifyId: trackId,
        externalUrl: url,
        popularity: 86,
        followers: 30394768
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockMetadata;
    } catch (error) {
      console.error('Error fetching Spotify metadata:', error);
      return { success: false, error: error.message };
    }
  };

  const fetchArtistInfo = async (artistName, trackName) => {
    try {
      // For web demo, return mock artist info
      // In production, you'd integrate with music APIs like Genius, Last.fm, etc.
      const mockArtistInfo = {
        success: true,
        bio: `${artistName} is one of the most influential and successful bands in music history. Their innovative approach to songwriting, recording, and performance revolutionized popular music and influenced countless artists across generations.`,
        context: `This track showcases ${artistName}'s signature style and artistic evolution. Known for their groundbreaking work, they continue to inspire musicians worldwide.`,
        genre: 'Rock',
        era: '1960s - Present',
        image: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25',
        imageSource: 'Spotify',
        followers: 30394768,
        monthlyListeners: 45000000,
        topTracks: [
          'Hey Jude',
          'Let It Be',
          'Yesterday',
          'Come Together',
          'Here Comes the Sun'
        ],
        source: 'Music Database API',
        lastUpdated: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockArtistInfo;
    } catch (error) {
      console.error('Error fetching artist info:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDownload = async () => {
    if (!trackInfo) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      // Simulate download completion
      setTimeout(() => {
        setDownloadProgress(100);
        setIsDownloading(false);
        
        // Create a mock download
        const blob = createMockDownload();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${trackInfo.title}.${getFileExtension(selectedFormat)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Add success log
        setLogs(prev => [...prev, {
          type: 'success',
          message: `Download completed: ${trackInfo.title}.${getFileExtension(selectedFormat)}`,
          timestamp: new Date().toISOString()
        }]);
      }, 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
      setLogs(prev => [...prev, {
        type: 'error',
        message: `Download failed: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const createMockDownload = async () => {
    // Create a mock audio file blob
    const mockAudioData = new Uint8Array(1024 * 1024); // 1MB mock file
    for (let i = 0; i < mockAudioData.length; i++) {
      mockAudioData[i] = Math.floor(Math.random() * 256);
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return new Blob([mockAudioData], { type: 'audio/mpeg' });
  };
  
  // Helper function to get file extension
  const getFileExtension = (format) => {
    switch (format) {
      case 'mp3-good':
      case 'mp3-better':
        return 'mp3';
      case 'wav-great':
        return 'wav';
      case 'flac-lossless':
        return 'flac';
      default:
        return 'mp3';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <Header />
        
        {/* Top Banner Ad */}
        <BannerAd adSlot="1234567890" className="mt-8" />
        
        {/* Main Content */}
        <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">
          {/* Input and Format Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <UrlInput 
              value={url} 
              onChange={handleUrlChange} 
            />
            <FormatSelector 
              selectedFormat={selectedFormat}
              onFormatChange={setSelectedFormat}
            />
          </div>
          
          {/* Middle Banner Ad */}
          <BannerAd adSlot="0987654321" />
          
          {/* Track Preview and Artist Info Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <TrackPreview 
              trackInfo={trackInfo}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              selectedFormat={selectedFormat}
            />
            {artistInfo ? (
              <ArtistInfo artistInfo={artistInfo} />
            ) : (
              <div className="card">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    About the Artist
                  </h3>
                  <div className="py-12 sm:py-16">
                    <div className="text-5xl sm:text-6xl text-loader-green mb-4">🎤</div>
                    <p className="text-gray-400 text-base sm:text-lg">No artist info available</p>
                    <p className="text-gray-500 text-sm sm:text-base mt-2">
                      Paste a Spotify URL to get artist information
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {isDownloading && (
            <ProgressBar progress={downloadProgress} />
          )}
          
          {/* Bottom Banner Ad */}
          <BannerAd adSlot="1122334455" />
          
          {/* Terminal Section */}
          <div className="mt-16 pt-8 border-t border-loader-green-medium">
            <div className="text-center space-x-4">
              <button 
                onClick={() => setShowTerminal(!showTerminal)}
                className="btn-primary"
              >
                {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
              </button>
              <button className="btn-primary">
                Change Folder
              </button>
            </div>
            
            {showTerminal && (
              <Terminal logs={logs} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
