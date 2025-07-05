import React from "react";
import { useAudio } from "../context/AudioContext";
import "./AudioPlayer.css";

const AudioPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playlist,
    currentIndex,
    autoPlay,
    togglePlayPause,
    seekTo,
    playNext,
    playPrevious,
    toggleAutoPlay,
  } = useAudio();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    const handleMouseMove = (e) => {
      handleSeek(e);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Only seek on initial mouse down, not on every move
    handleSeek(e);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const hasPlaylist = playlist.length > 1;

  return (
    <div className="audio-player">
      <div className="player-content">
        <div className="song-info">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="song-cover"
          />
          <div className="song-details">
            <div className="song-title">{currentSong.title}</div>
            <div className="song-artist">{currentSong.artist}</div>
            {hasPlaylist && (
              <div className="playlist-info">
                {currentIndex + 1} of {playlist.length}
              </div>
            )}
          </div>
        </div>

        <div className="player-controls">
          {hasPlaylist && (
            <button
              className="nav-btn"
              onClick={playPrevious}
              title="Previous song"
            >
              ⏮️
            </button>
          )}

          <button className="play-pause-btn" onClick={togglePlayPause}>
            {isPlaying ? "⏸️" : "▶️"}
          </button>

          {hasPlaylist && (
            <button className="nav-btn" onClick={playNext} title="Next song">
              ⏭️
            </button>
          )}

          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <div className="progress-bar" onMouseDown={handleMouseDown}>
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="progress-thumb" />
              </div>
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-options">
          {/* Modern toggle switch for Autoplay */}
          <label className="autoplay-toggle-label">
            <span className="autoplay-toggle-text">Autoplay</span>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={toggleAutoPlay}
              className="autoplay-toggle-input"
            />
            <span className="autoplay-toggle-slider" />
            <span className="autoplay-toggle-status">
              {autoPlay ? "On" : "Off"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
