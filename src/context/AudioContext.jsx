import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };
    const handleLoadedData = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const playSong = (song, songList = []) => {
    if (currentSong?.id === song.id && isPlaying) {
      // If same song is playing, pause it
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      // Update playlist if provided
      if (songList.length > 0) {
        setPlaylist(songList);
        const index = songList.findIndex(s => s.id === song.id);
        setCurrentIndex(index >= 0 ? index : 0);
      }
      // Play new song or resume paused song
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    
    if (nextSong) {
      setCurrentIndex(nextIndex);
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    
    if (prevSong) {
      setCurrentIndex(prevIndex);
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const stopSong = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentTime(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log('Autoplay prevented');
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Handle page visibility changes to maintain audio state
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio || !currentSong) return;
      
      if (document.hidden) {
        // Page is hidden, but don't pause audio
        // Audio should continue playing in background
      } else {
        // Page is visible again
        if (isPlaying && audio.paused) {
          audio.play().catch(() => console.log('Resume failed'));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentSong, isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playlist,
        currentIndex,
        playSong,
        togglePlayPause,
        seekTo,
        playNext,
        playPrevious,
        stopSong,
      }}
    >
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url || ''}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            console.log('Audio playback error - no valid source');
            setIsPlaying(false);
          }}
        />
      )}
    </AudioContext.Provider>
  );
};
