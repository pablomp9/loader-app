const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const https = require('https');

// Spotify API credentials
const SPOTIFY_CLIENT_ID = '0a82e6bc2ddb47c5b233a58f8b8d887a';
const SPOTIFY_CLIENT_SECRET = 'c58a3057e7e14d679307bbfd5a653f29';

// API credentials for enhanced artist information
const DISCOGS_API_KEY = 'JDAsDokbTKqmQiJFBLJsLhLcycMTcbCMCpNoWzFv';
const GENIUS_CLIENT_ID = 'JmHop0XEzOzNnyQR4PF162cOPcxNoILJ9JbrdtSKoApb_3NabBGRlkZjGMN7Vqd2';
const GENIUS_CLIENT_SECRET = '5dqKxGwgYU2-_ZWQ9b128Ab9eszhlD7NSNzGisR3LrwqTUfhpns8kBdu8SM6eHYXFxQtpgJpS6O5sORTskczzA';

let accessToken = null;
let tokenExpiry = null;

// Default download folder
const defaultDownloadFolder = require('os').homedir() + '/Downloads';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a'
  });

  // Load the React app
  // Always load from development server for now
  mainWindow.loadURL('http://localhost:3000');
  
  // Open DevTools in development
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

// Utility function for making HTTPS requests
function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Get Spotify access token
async function getSpotifyToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const response = await makeHttpsRequest('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (response.status === 200) {
      accessToken = response.data.access_token;
      tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return accessToken;
    }
  } catch (error) {
    console.error('Failed to get Spotify token:', error);
  }
  return null;
}

// Extract Spotify track ID from URL
function extractSpotifyId(url) {
  const match = url.match(/\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Get Spotify track metadata
async function getSpotifyTrackMetadata(trackId) {
  try {
    const token = await getSpotifyToken();
    if (!token) {
      throw new Error('Failed to get Spotify access token');
    }

    const response = await makeHttpsRequest(`https://api.spotify.com/v1/tracks/${trackId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const track = response.data;
      return {
        success: true,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        duration: formatDuration(track.duration_ms),
        artwork: track.album.images[0]?.url || null,
        releaseDate: track.album.release_date,
        trackNumber: track.track_number,
        totalTracks: track.album.total_tracks,
        spotifyId: track.id,
        externalUrl: track.external_urls.spotify,
        artists: track.artists
      };
    }
  } catch (error) {
    console.error('Failed to get Spotify metadata:', error);
  }
  return { success: false, error: 'Failed to get track metadata' };
}

// Format duration from milliseconds
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to get artist information from Discogs API
async function getDiscogsArtistInfo(artistName) {
  try {
    const encodedArtist = encodeURIComponent(artistName);
    const url = `https://api.discogs.com/database/search?q=${encodedArtist}&type=artist&key=${DISCOGS_API_KEY}`;
    
    const response = await makeHttpsRequest(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'LoaderApp/1.0'
      }
    });
    
    if (response.status === 200 && response.data.results && response.data.results.length > 0) {
      const artist = response.data.results[0];
      
      // Get detailed artist info
      const artistUrl = artist.resource_url;
      const artistResponse = await makeHttpsRequest(artistUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LoaderApp/1.0'
        }
      });
      
      if (artistResponse.status === 200) {
        const artistData = artistResponse.data;
        
        // Get the best available artist image
        let bestImage = null;
        if (artistData.images && artistData.images.length > 0) {
          // Prioritize artist photos over album covers
          const artistPhoto = artistData.images.find(img => 
            img.type === 'primary' || 
            img.type === 'secondary' || 
            img.uri.includes('artist')
          );
          bestImage = artistPhoto ? artistPhoto.uri : artistData.images[0].uri;
        }
        
        return {
          success: true,
          bio: artistData.profile || 'No biography available',
          genre: artistData.genres?.[0] || 'Various Genres',
          era: artistData.years_active?.[0] || 'Active',
          image: bestImage,
          country: artistData.country || 'Unknown',
          realName: artistData.realname || artistName,
          aliases: artistData.alternate_names || [],
          members: artistData.members || []
        };
      }
    }
    
    return { success: false, error: 'Artist not found on Discogs' };
  } catch (error) {
    console.error('Failed to get Discogs artist info:', error);
    return { success: false, error: error.message };
  }
}

// Function to get artist information using Genius API
async function getGeniusArtistInfo(artistName, trackName) {
  try {
    // Search for the artist
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(artistName)}`;
    const searchResponse = await makeHttpsRequest(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GENIUS_CLIENT_SECRET}`,
        'User-Agent': 'LoaderApp/1.0'
      }
    });
    
    if (searchResponse.status === 200 && searchResponse.data.response && searchResponse.data.response.hits && searchResponse.data.response.hits.length > 0) {
      const artistHit = searchResponse.data.response.hits.find(hit => 
        hit.type === 'artist' || hit.result.primary_artist.name.toLowerCase().includes(artistName.toLowerCase())
      );
      
      if (artistHit) {
        const artistId = artistHit.result.primary_artist.id;
        
        // Get artist details
        const artistUrl = `https://api.genius.com/artists/${artistId}`;
        const artistResponse = await makeHttpsRequest(artistUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GENIUS_CLIENT_SECRET}`,
            'User-Agent': 'LoaderApp/1.0'
          }
        });
        
        if (artistResponse.status === 200) {
          const artist = artistResponse.data.response.artist;
          
          // Search for the specific song
          const songSearchUrl = `https://api.genius.com/search?q=${encodeURIComponent(`${artistName} ${trackName}`)}`;
          const songSearchResponse = await makeHttpsRequest(songSearchUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${GENIUS_CLIENT_SECRET}`,
              'User-Agent': 'LoaderApp/1.0'
            }
          });
          
          let songInfo = null;
          if (songSearchResponse.status === 200 && songSearchResponse.data.response && songSearchResponse.data.response.hits && songSearchResponse.data.response.hits.length > 0) {
            songInfo = songSearchResponse.data.response.hits[0].result;
          }
          
          return {
            success: true,
            bio: artist.description?.plain || 'No biography available',
            genre: artist.genres?.[0] || 'Various Genres',
            era: artist.creation_for_display || 'Active',
            image: artist.image_url || null,
            country: artist.country || 'Unknown',
            realName: artist.name || artistName,
            aliases: artist.alternate_names || [],
            followers: artist.followers_count || 0,
            songInfo: songInfo,
            source: 'Genius'
          };
        }
      }
    }
    
    return { success: false, error: 'Artist not found on Genius' };
  } catch (error) {
    console.error('Failed to get Genius artist info:', error);
    return { success: false, error: error.message };
  }
}

// Function to get enhanced Spotify artist information
async function getEnhancedSpotifyArtistInfo(artistId) {
  try {
    const token = await getSpotifyToken();
    if (!token) {
      throw new Error('Failed to get Spotify access token');
    }
    
    // Get artist details
    const artistResponse = await makeHttpsRequest(`https://api.spotify.com/v1/artists/${artistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (artistResponse.status === 200) {
      const artist = artistResponse.data;
      
      // Get artist's top tracks
      const tracksResponse = await makeHttpsRequest(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Get related artists
      const relatedResponse = await makeHttpsRequest(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return {
        success: true,
        popularity: artist.popularity || 0,
        followers: artist.followers?.total || 0,
        genres: artist.genres || [],
        images: artist.images || [], // Keep all images for quality selection
        topTracks: tracksResponse.status === 200 ? tracksResponse.data.tracks?.slice(0, 5) || [] : [],
        relatedArtists: relatedResponse.status === 200 ? relatedResponse.data.artists?.slice(0, 5) || [] : []
      };
    }
    
    return { success: false, error: 'Failed to get enhanced Spotify data' };
  } catch (error) {
    console.error('Failed to get enhanced Spotify artist info:', error);
    return { success: false, error: error.message };
  }
}

// IPC handlers
ipcMain.handle('get-metadata', async (event, url) => {
  try {
    const trackId = extractSpotifyId(url);
    if (!trackId) {
      return { success: false, error: 'Invalid Spotify URL' };
    }

    console.log('Getting metadata for Spotify track:', trackId);
    const metadata = await getSpotifyTrackMetadata(trackId);
    
    if (!metadata.success) {
      return metadata;
    }

    console.log('Successfully got Spotify metadata:', metadata);
    
    // Get additional artist information from multiple APIs
    try {
      // Extract artist ID from Spotify metadata
      const artistId = metadata.artists?.[0]?.id || null;
      
      const [discogsInfo, geniusInfo, enhancedSpotifyInfo] = await Promise.allSettled([
        getDiscogsArtistInfo(metadata.artist),
        getGeniusArtistInfo(metadata.artist, metadata.title),
        artistId ? getEnhancedSpotifyArtistInfo(artistId) : Promise.resolve({ success: false })
      ]);
      
      // Combine all the data
      const enrichedMetadata = {
        ...metadata,
        discogsArtist: discogsInfo.status === 'fulfilled' && discogsInfo.value.success ? discogsInfo.value : null,
        geniusArtist: geniusInfo.status === 'fulfilled' && geniusInfo.value.success ? geniusInfo.value : null,
        enhancedSpotify: enhancedSpotifyInfo.status === 'fulfilled' && enhancedSpotifyInfo.value.success ? enhancedSpotifyInfo.value : null
      };
      
      console.log('Successfully enriched metadata with multiple API data');
      return enrichedMetadata;
    } catch (apiError) {
      console.warn('Some APIs failed, returning Spotify data only:', apiError);
      return metadata;
    }
  } catch (error) {
    console.error('Error in get-metadata handler:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('download', async (event, { url, format }) => {
  try {
    console.log('Starting download with format:', format);
    
    // Extract track info from URL for search
    const trackId = extractSpotifyId(url);
    if (!trackId) {
      throw new Error('Invalid Spotify URL');
    }

    const metadata = await getSpotifyTrackMetadata(trackId);
    if (!metadata.success) {
      throw new Error('Failed to get track metadata');
    }

    const searchQuery = `${metadata.artist} - ${metadata.title}`;
    console.log('Search query:', searchQuery);

    // Build yt-dlp arguments based on format
    const ytdlpArgs = [
      '--output',
      `${defaultDownloadFolder}/%(title)s.%(ext)s`,
      '--no-playlist',
      '--force-overwrites',
      '--no-warnings',
      '--extract-audio'
    ];

    switch (format) {
      case 'mp3-good':
        ytdlpArgs.push('--audio-format', 'mp3', '--audio-quality', '9');
        break;
      case 'mp3-better':
        ytdlpArgs.push('--audio-format', 'mp3', '--audio-quality', '0');
        break;
      case 'wav-great':
        ytdlpArgs.push('--audio-format', 'wav', '--postprocessor-args', 'ffmpeg:-ar 48000 -ac 2 -f wav');
        break;
      case 'flac-lossless':
        ytdlpArgs.push('--audio-format', 'flac');
        break;
      default:
        ytdlpArgs.push('--audio-format', 'mp3', '--audio-quality', '0');
    }

    ytdlpArgs.push(`ytsearch1:${searchQuery}`);
    console.log('yt-dlp args:', ytdlpArgs);

    // Start download process
    const downloadProcess = spawn('yt-dlp', ytdlpArgs);
    let fullOutput = '';

    downloadProcess.stdout.on('data', (data) => {
      const output = data.toString();
      fullOutput += output;
      event.sender.send('log-update', output);
    });

    downloadProcess.stderr.on('data', (data) => {
      const output = data.toString();
      fullOutput += output;
      event.sender.send('log-update', output);
    });

    downloadProcess.on('close', (code) => {
      console.log('Download process closed with code:', code);
      console.log('Full output log:', fullOutput);
      
      const success = code === 0 && !fullOutput.includes('ERROR:');
      event.sender.send(success ? 'download-complete' : 'download-error', {
        success,
        code,
        output: fullOutput
      });
    });

    downloadProcess.on('error', (error) => {
      console.error('Download process error:', error);
      event.sender.send('download-error', error.message);
    });

  } catch (error) {
    console.error('Download error:', error);
    event.sender.send('download-error', error.message);
  }
});

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
