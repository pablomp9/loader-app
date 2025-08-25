# 🎵 Loader - Music Downloader

A modern, beautiful music downloader application built with React, Tailwind CSS, and Electron.

## ✨ Features

- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Multiple Formats**: Support for MP3, WAV, and FLAC downloads
- **Quality Options**: Choose from different quality levels (128kbps, 320kbps, 48kHz, lossless)
- **Spotify Integration**: Paste Spotify URLs to get track information
- **Enhanced Artist Info**: AI-powered artist biographies and comprehensive music data
- **Real-time Progress**: Live download progress tracking
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Electron (Node.js)
- **APIs**: Spotify API, ChatGPT API, Discogs API
- **Audio Processing**: yt-dlp, FFmpeg
- **Styling**: Custom Tailwind components with dark theme

## 📋 Prerequisites

- Node.js 16+ and npm
- yt-dlp installed globally
- FFmpeg installed globally
- API keys for enhanced features

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Loader Main"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install global dependencies**
   ```bash
   # Install yt-dlp
   pip install yt-dlp
   
   # Install FFmpeg (macOS)
   brew install ffmpeg
   
   # Install FFmpeg (Ubuntu/Debian)
   sudo apt update && sudo apt install ffmpeg
   
   # Install FFmpeg (Windows)
   # Download from https://ffmpeg.org/download.html
   ```

4. **Configure API keys**
   
   Edit `public/electron.js` and replace the placeholder API keys:
   ```javascript
   const SPOTIFY_CLIENT_ID = 'your-actual-spotify-client-id';
   const SPOTIFY_CLIENT_SECRET = 'your-actual-spotify-client-secret';
   const OPENAI_API_KEY = 'your-actual-openai-api-key';
   const DISCOGS_API_KEY = 'your-actual-discogs-api-key';
   const DISCOGS_API_SECRET = 'your-actual-discogs-api-secret';
   ```

## 🎯 Usage

### Development Mode

1. **Start React development server**
   ```bash
   npm start
   ```

2. **In another terminal, start Electron**
   ```bash
   npm run electron-dev
   ```

### Production Build

1. **Build the React application**
   ```bash
   npm run build
   ```

2. **Package the Electron application**
   ```bash
   npm run electron-pack
   ```

## 🎨 Customization

### Tailwind CSS

The application uses custom Tailwind CSS components defined in `src/index.css`:

- **Colors**: Custom loader-green color scheme
- **Components**: Pre-built button, card, and input styles
- **Animations**: Custom fade-in and slide-up animations

### Theme Colors

```css
--loader-green: #1DB954
--loader-green-light: rgba(29, 185, 84, 0.1)
--loader-green-medium: rgba(29, 185, 84, 0.3)
--loader-green-dark: rgba(29, 185, 84, 0.6)
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Application header
│   ├── UrlInput.js     # Spotify URL input
│   ├── FormatSelector.js # Download format selection
│   ├── TrackPreview.js # Track information display
│   ├── ArtistInfo.js   # Artist biography and stats
│   ├── ProgressBar.js  # Download progress
│   └── Terminal.js     # System logs display
├── hooks/              # Custom React hooks
│   └── useElectron.js  # Electron IPC integration
├── App.js              # Main application component
├── index.js            # React entry point
└── index.css           # Tailwind CSS and custom styles

public/
├── electron.js         # Electron main process
├── preload.js          # Secure IPC bridge
└── index.html          # HTML template
```

## 🔧 Configuration

### Download Formats

Supported download formats are defined in `FormatSelector.js`:

- **MP3 - Good Quality**: 128kbps, mobile-friendly
- **MP3 - Better Quality**: 320kbps, high quality
- **WAV - Great Quality**: 48kHz, professional use
- **FLAC - Lossless**: Studio quality, lossless compression

### Default Settings

- **Download Folder**: User's Downloads directory
- **Window Size**: 1400x900 pixels
- **Theme**: Dark mode with green accents
- **Font**: Helvetica (official brand font)

## 🚨 Troubleshooting

### Common Issues

1. **yt-dlp not found**
   - Ensure yt-dlp is installed globally: `pip install yt-dlp`

2. **FFmpeg conversion errors**
   - Verify FFmpeg installation: `ffmpeg -version`
   - Check audio codec support

3. **API errors**
   - Verify API keys are correctly set
   - Check internet connection
   - Ensure API quotas haven't been exceeded

4. **Download failures**
   - Check terminal logs for detailed error messages
   - Verify track availability on YouTube
   - Try different download formats

### Debug Mode

Enable debug mode by setting environment variable:
```bash
NODE_ENV=development npm run electron-dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **yt-dlp**: YouTube downloader backend
- **FFmpeg**: Audio conversion engine
- **Spotify API**: Music metadata
- **OpenAI API**: AI-generated content
- **Discogs API**: Artist information
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Component-based UI library
- **Electron**: Cross-platform desktop framework

---

**Note**: This application is for personal use only. Please respect copyright laws and terms of service when downloading music.
