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
  const [autoPlay, setAutoPlay] = useState(false); // Auto-play for Songs section
  const audioRef = useRef(null);

  // Custom event to notify other players to stop
  const notifyOtherPlayers = () => {
    window.dispatchEvent(
      new CustomEvent("audioPlayerStarted", {
        detail: { source: "audio", songId: currentSong?.id },
      })
    );
  };

  // Listen for other players starting
  useEffect(() => {
    const handleOtherPlayerStarted = (event) => {
      if (event.detail.source !== "audio" && isPlaying) {
        // Another player (YouTube) started, stop this one
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("audioPlayerStarted", handleOtherPlayerStarted);
    return () => {
      window.removeEventListener(
        "audioPlayerStarted",
        handleOtherPlayerStarted
      );
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (autoPlay) {
        playNext();
      }
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
  }, [currentSong, autoPlay]);

  const playSong = (song, songList = [], enableAutoPlay = false) => {
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
        const index = songList.findIndex((s) => s.id === song.id);
        setCurrentIndex(index >= 0 ? index : 0);
      }

      // Set auto-play based on parameter
      setAutoPlay(enableAutoPlay);

      // Play new song or resume paused song
      setCurrentSong(song);
      setIsPlaying(true);

      // Notify other players to stop
      notifyOtherPlayers();
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
      notifyOtherPlayers();
    }
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;

    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];

    if (prevSong) {
      setCurrentIndex(prevIndex);
      setCurrentSong(prevSong);
      setIsPlaying(true);
      notifyOtherPlayers();
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
      notifyOtherPlayers();
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
    setAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    let playPromise;
    if (isPlaying) {
      playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented:", error.message);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {}); // Cleanup any pending promise
      }
    };
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
          audio
            .play()
            .catch((error) => console.warn("Resume failed:", error.message));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        autoPlay,
        playSong,
        togglePlayPause,
        seekTo,
        playNext,
        playPrevious,
        stopSong,
        toggleAutoPlay,
      }}
    >
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url || ""}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(error) => {
            console.warn("Audio playback error:", error);
            setIsPlaying(false);
          }}
        />
      )}
    </AudioContext.Provider>
  );
};
