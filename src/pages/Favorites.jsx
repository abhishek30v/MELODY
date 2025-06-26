import { useState, useEffect } from "react";
import "./Favorites.css";
import { useYouTubePlayer } from "../context/YouTubePlayerContext";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const { play: playYouTube } = useYouTubePlayer();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem("melody-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const removeFavorite = (songId) => {
    const newFavorites = favorites.filter((fav) => fav.id !== songId);
    setFavorites(newFavorites);
    localStorage.setItem("melody-favorites", JSON.stringify(newFavorites));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("melody-favorites");
  };

  const handlePlayVideo = (song) => {
    setCurrentPlaying(song.id);
    playYouTube({
      id: song.id,
      youtubeId: song.youtubeId,
      title: song.title,
      thumbnail: song.artwork,
      channelTitle: song.artist,
    });
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <span className="title-icon">❤️</span>
          <span className="gradient-text">Your Favorites</span>
        </h1>
        <p className="favorites-subtitle">
          {favorites.length} song{favorites.length !== 1 ? "s" : ""} in your
          collection
        </p>

        {favorites.length > 0 && (
          <button onClick={clearAllFavorites} className="clear-button">
            🗑️ Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h3>No favorites yet</h3>
          <p>Start discovering music and add songs to your favorites!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((song) => (
            <div
              key={song.id}
              className={`favorite-card spotify-card glass-effect hover-lift${
                currentPlaying === song.id ? " playing" : ""
              }`}
              onClick={() => handlePlayVideo(song)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div className="song-artwork" style={{ position: "relative" }}>
                <img
                  src={song.artwork}
                  alt={song.title}
                  className="artwork-image spotify-song-cover"
                />
                <div className="favorite-play-overlay">
                  {currentPlaying === song.id ? (
                    <span className="favorite-play-icon playing">⏸️</span>
                  ) : (
                    <span className="favorite-play-icon">▶️</span>
                  )}
                </div>
              </div>
              <div className="song-info spotify-song-details">
                <h3 className="song-title spotify-song-title">{song.title}</h3>
                <p className="song-artist spotify-song-artist">{song.artist}</p>
                <p className="song-album">{song.album}</p>
              </div>
              <div className="song-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(song.id);
                  }}
                  className="remove-button"
                >
                  💔 Remove
                </button>
              </div>
              {song.preview && (
                <audio controls className="preview-audio">
                  <source src={song.preview} type="audio/mpeg" />
                </audio>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
