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
  const { currentVideo, isVisible, close } = useYouTubePlayer();
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
        <button
          className="close-player"
          style={{ marginLeft: 16 }}
          onClick={close}
        >
          ✕
        </button>
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
          }?autoplay=1&rel=0&modestbranding=1`}
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
