import { useState, useEffect, useCallback } from "react";
import "./Discover.css";
import config from "../services/config";
import { useYouTubePlayer } from "../context/YouTubePlayerContext";
import { useAudio } from "../context/AudioContext";

// Using YouTube's public search without API key

function Discover() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { play: playYouTube } = useYouTubePlayer();
  const { stopSong } = useAudio();

  useEffect(() => {
    // Stop any playing audio when entering Discovery section
    stopSong();
    loadFavorites();
  }, [stopSong]);

  useEffect(() => {
    // On page load, do not show demo results
    setSearchResults([]);
  }, []);

  const searchYouTube = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const apiKey = config.YOUTUBE_API_KEY;
      const maxResults = 12;
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
        query + " song"
      )}&key=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("YouTube API error");
      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        setSearchResults([]);
        setError("No results found for your search.");
        return;
      }
      const videoData = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
      }));
      setSearchResults(videoData);
    } catch (error) {
      setError("Could not fetch results from YouTube. Please try again later.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    searchYouTube(searchTerm);
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem("melody-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (video) => {
    const videoData = {
      id: video.id,
      title: video.title,
      artist: video.channelTitle,
      artwork: video.thumbnail,
      youtubeId: video.id,
    };

    const isFavorite = favorites.some((fav) => fav.id === video.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== video.id);
    } else {
      newFavorites = [...favorites, videoData];
    }

    setFavorites(newFavorites);
    localStorage.setItem("melody-favorites", JSON.stringify(newFavorites));
  };

  const handlePlayVideo = (video) => {
    setCurrentPlaying(video.id);
    playYouTube({
      id: video.id,
      youtubeId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
    });
  };

  const isFavorite = (videoId) => {
    return favorites.some((fav) => fav.id === videoId);
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1 className="discover-title">
          <span className="title-icon">🔥</span>
          <span className="gradient-text">Discover Music Hits</span>
        </h1>
        <p className="discover-subtitle">
          Explore trending music hits and discover new favorites
        </p>

        <div className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for Bollywood songs..."
            className="search-input"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
          />
          <button
            type="button"
            className="search-button"
            onClick={handleSearch}
          >
            🔍 Search
          </button>
        </div>
        {error && (
          <div className="error-message">
            <h3>Oops!</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Discovering amazing music...</p>
        </div>
      ) : (
        <div className="songs-grid">
          {searchResults.map((video) => (
            <div
              key={video.id}
              className="discover-card glass-effect hover-lift"
            >
              <div className="song-artwork">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="artwork-image"
                />
                <div className="artwork-overlay">
                  <button
                    className="preview-button"
                    onClick={() => handlePlayVideo(video)}
                  >
                    {currentPlaying === video.id ? "⏸️" : "▶️"}
                  </button>
                </div>
              </div>

              <div className="song-info">
                <h3 className="song-title">{video.title}</h3>
                <p className="song-artist">{video.channelTitle}</p>
              </div>

              <div className="song-actions">
                <button
                  onClick={() => toggleFavorite(video)}
                  className={`favorite-button ${
                    isFavorite(video.id) ? "favorited" : ""
                  }`}
                >
                  {isFavorite(video.id) ? "❤️" : "🤍"}
                  {isFavorite(video.id) ? "Favorited" : "Add to Favorites"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Discover;
