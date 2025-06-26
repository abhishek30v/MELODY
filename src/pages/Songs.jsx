import { useState, useEffect } from "react";
import { fetchBollywoodSongs } from "../services/musicService";
import { useAudio } from "../context/AudioContext";
import "./Songs.css";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSong, isPlaying, playSong } = useAudio();
  const [showController, setShowController] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const bollywoodSongs = await fetchBollywoodSongs();
      setSongs(Array.isArray(bollywoodSongs) ? bollywoodSongs : []);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
    playSong(song);
    setShowController(true);
  };

  if (loading) {
    return (
      <div className="songs-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading Bollywood hits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="songs-container">
      {/* Header Section */}
      <div className="songs-header">
        <h1 className="songs-title">
          <span className="title-icon">🎧</span>
          <span className="gradient-text">Bollywood Hits</span>
        </h1>
        <p className="songs-subtitle">
          Stream full Bollywood songs with high-quality audio
        </p>
      </div>

      {/* Songs Grid */}
      <div className="songs-grid">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`song-card spotify-card fade-in ${
              currentSong?.id === song.id ? "playing" : ""
            }`}
          >
            <div className="spotify-artwork-container">
              <img
                src={song.cover}
                alt={song.title}
                className="spotify-song-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x500/1db954/ffffff?text=🎵";
                }}
              />
              <button
                className={`spotify-play-button ${
                  currentSong?.id === song.id && isPlaying ? "playing" : ""
                }`}
                onClick={() => handlePlay(song)}
                aria-label={
                  currentSong?.id === song.id && isPlaying ? "Pause" : "Play"
                }
              >
                {currentSong?.id === song.id && isPlaying ? (
                  "⏸️"
                ) : (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="14" cy="14" r="14" fill="#1DB954" />
                    <polygon points="11,9 21,14 11,19" fill="#fff" />
                  </svg>
                )}
              </button>
            </div>
            <div className="spotify-song-details">
              <h3 className="spotify-song-title">{song.title}</h3>
              <p className="spotify-song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Audio Controller (Player UI) with Hide Button */}
      {currentSong && isPlaying && showController && (
        <div className="now-playing-container">
          <div className="now-playing-content">
            <div className="now-playing-icon">🎵</div>
            <div>
              <div className="now-playing-title">{currentSong.title}</div>
              <div className="now-playing-artist">{currentSong.artist}</div>
            </div>
            <button
              className="close-player"
              onClick={() => setShowController(false)}
              title="Hide Player"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Songs;
