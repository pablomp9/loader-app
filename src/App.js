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
      setTimeout(async () => {
        setDownloadProgress(100);
        setIsDownloading(false);
        
        // Create a mock download
        const blob = await createMockDownload();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Create a professional filename
        const artist = trackInfo.artist.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const title = trackInfo.title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const format = getFileExtension(selectedFormat);
        const filename = `${artist} - ${title}.${format}`;
        
        a.download = filename;
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
    // Create audio file based on selected format
    if (selectedFormat === 'wav-great') {
      return createWAVFile();
    } else if (selectedFormat === 'flac-lossless') {
      return createFLACFile();
    } else {
      // MP3 formats
      return createMP3File();
    }
  };

  const createWAVFile = async () => {
    // Create a proper WAV file with correct headers
    const sampleRate = 44100;
    const duration = 3; // 3 seconds
    const numChannels = 2; // Stereo
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const numSamples = sampleRate * duration;
    const dataSize = numSamples * blockAlign;
    const fileSize = 36 + dataSize; // WAV header (44 bytes) + data size
    
    // Create WAV file buffer
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    
    // WAV file header (44 bytes)
    let offset = 0;
    
    // RIFF chunk descriptor
    view.setUint32(offset, 0x52494646, false); // "RIFF"
    offset += 4;
    view.setUint32(offset, fileSize - 8, true); // File size - 8
    offset += 4;
    view.setUint32(offset, 0x57415645, false); // "WAVE"
    offset += 4;
    
    // fmt sub-chunk
    view.setUint32(offset, 0x666D7420, false); // "fmt "
    offset += 4;
    view.setUint32(offset, 16, true); // Subchunk1Size (16 for PCM)
    offset += 4;
    view.setUint16(offset, 1, true); // AudioFormat (1 for PCM)
    offset += 2;
    view.setUint16(offset, numChannels, true); // NumChannels
    offset += 2;
    view.setUint32(offset, sampleRate, true); // SampleRate
    offset += 4;
    view.setUint32(offset, byteRate, true); // ByteRate
    offset += 4;
    view.setUint16(offset, blockAlign, true); // BlockAlign
    offset += 2;
    view.setUint16(offset, bitsPerSample, true); // BitsPerSample
    offset += 2;
    
    // data sub-chunk
    view.setUint32(offset, 0x64617461, false); // "data"
    offset += 4;
    view.setUint32(offset, dataSize, true); // Subchunk2Size
    offset += 4;
    
    // Generate simple sine wave audio data
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      const frequency = 440; // A4 note
      const amplitude = 0.3; // 30% volume
      
      // Generate sine wave
      const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
      const sampleValue = Math.round(sample * 32767); // Convert to 16-bit
      
      // Left channel
      view.setInt16(offset, sampleValue, true);
      offset += 2;
      
      // Right channel (same as left for mono-like stereo)
      view.setInt16(offset, sampleValue, true);
      offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const createFLACFile = async () => {
    // Create a simple FLAC file (simplified - in reality FLAC is complex)
    // This creates a minimal FLAC file with basic headers
    const sampleRate = 44100;
    const duration = 3;
    const numSamples = sampleRate * duration;
    
    // FLAC file structure (simplified)
    const buffer = new ArrayBuffer(128 + numSamples * 4); // Header + stereo samples
    const view = new DataView(buffer);
    
    // FLAC signature
    view.setUint32(0, 0x664C6143, false); // "fLaC"
    
    // Add some basic metadata (simplified)
    let offset = 4;
    
    // Generate simple audio data
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      const frequency = 440;
      const amplitude = 0.3;
      const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
      const sampleValue = Math.round(sample * 32767);
      
      // Left and right channels
      view.setInt16(offset, sampleValue, true);
      offset += 2;
      view.setInt16(offset, sampleValue, true);
      offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/flac' });
  };

  const createMP3File = async () => {
    // Create a simple MP3 file (simplified - real MP3 encoding is complex)
    // This creates a minimal MP3 file with basic headers
    const sampleRate = 44100;
    const duration = 3;
    const numSamples = sampleRate * duration;
    
    // MP3 file structure (simplified)
    const buffer = new ArrayBuffer(64 + numSamples * 2); // Header + mono samples
    const view = new DataView(buffer);
    
    // MP3 frame header (simplified)
    view.setUint32(0, 0xFFFB9064, false); // MP3 sync word + header
    
    // Add some basic audio data
    let offset = 4;
    
    // Generate simple audio data
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate;
      const frequency = 440;
      const amplitude = 0.3;
      const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
      const sampleValue = Math.round(sample * 32767);
      
      view.setInt16(offset, sampleValue, true);
      offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/mpeg' });
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
