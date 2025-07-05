import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Songs from "./pages/Songs";
import Discover from "./pages/Discover";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import { AudioProvider } from "./context/AudioContext";
import "./App.css";
import {
  YouTubePlayerProvider,
  useYouTubePlayer,
} from "./context/YouTubePlayerContext";

// Sticky YouTube Player component
const StickyYouTubePlayer = () => {
  const { currentVideo, isVisible, close, playNext, autoPlay, toggleAutoPlay, playlist, currentIndex } = useYouTubePlayer();
  
  React.useEffect(() => {
    if (!isVisible || !currentVideo) return;
    
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'video-progress' && data.info && data.info.playerState === 0) {
            // Video ended (playerState 0 = ended)
            setTimeout(() => playNext(), 1000); // Small delay before next song
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isVisible, currentVideo, playNext]);
  
  if (!isVisible || !currentVideo) return null;
  
  return (
    <div
      className="youtube-player-sticky glass-effect"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        padding: "0 0 16px 0",
        background: "rgba(15,15,35,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="now-playing-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            style={{
              width: 48,
              height: 36,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <div>
            <div
              className="now-playing-title"
              style={{ color: "#fff", fontWeight: 600 }}
            >
              {currentVideo.title}
            </div>
            <div
              className="now-playing-artist"
              style={{ color: "#b3b3b3", fontSize: 13 }}
            >
              {currentVideo.channelTitle || currentVideo.artist}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="autoplay-button"
            style={{ 
              background: autoPlay ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)", 
              border: "none", 
              color: autoPlay ? "#22c55e" : "#fff", 
              padding: "4px 8px", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
            onClick={toggleAutoPlay}
            title={autoPlay ? "Disable Auto-play" : "Enable Auto-play"}
          >
            {autoPlay ? "🔄 ON" : "🔄 OFF"}
          </button>
          {playlist.length > 1 && (
            <span style={{ color: "#b3b3b3", fontSize: "12px" }}>
              {currentIndex + 1}/{playlist.length}
            </span>
          )}
          <button
            className="next-button"
            style={{ 
              background: "rgba(255,255,255,0.1)", 
              border: "none", 
              color: "#fff", 
              padding: "4px 8px", 
              borderRadius: "4px",
              cursor: "pointer",
              opacity: playlist.length <= 1 ? 0.5 : 1
            }}
            onClick={playNext}
            title="Next Song"
            disabled={playlist.length <= 1}
          >
            ⏭️
          </button>
          <button
            className="close-player"
            style={{ marginLeft: 8 }}
            onClick={close}
          >
            ✕
          </button>
        </div>
      </div>
      <div
        className="youtube-iframe-sticky"
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${
            currentVideo.youtubeId || currentVideo.id
          }?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: 120,
            border: "none",
            borderRadius: 10,
          }}
        ></iframe>
      </div>
    </div>
  );
};

function App() {
  return (
    <AudioProvider>
      <YouTubePlayerProvider>
        <div className="app-container">
          <Router>
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
            <StickyYouTubePlayer />
          </Router>
          <AudioPlayer />
        </div>
      </YouTubePlayerProvider>
    </AudioProvider>
  );
}

export default App;
