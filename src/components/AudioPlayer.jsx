import React from 'react';
import { useAudio } from '../context/AudioContext';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const { currentSong, isPlaying, currentTime, duration, togglePlayPause, seekTo } = useAudio();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    const handleMouseMove = (e) => {
      handleSeek(e);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Only seek on initial mouse down, not on every move
    handleSeek(e);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <div className="player-content">
        <div className="song-info">
          <img src={currentSong.cover} alt={currentSong.title} className="song-cover" />
          <div className="song-details">
            <div className="song-title">{currentSong.title}</div>
            <div className="song-artist">{currentSong.artist}</div>
          </div>
        </div>

        <div className="player-controls">
          <button className="play-pause-btn" onClick={togglePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <div className="progress-bar" onMouseDown={handleMouseDown}>
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
                <div className="progress-thumb" />
              </div>
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;