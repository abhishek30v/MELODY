import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const YouTubePlayerContext = createContext();

export const YouTubePlayerProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef(null);

  // Custom event to notify other players to stop
  const notifyOtherPlayers = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("audioPlayerStarted", {
        detail: { source: "youtube", videoId: currentVideo?.id },
      })
    );
  }, [currentVideo?.id]);

  // Listen for other players starting
  useEffect(() => {
    const handleOtherPlayerStarted = (event) => {
      if (event.detail.source !== "youtube" && isVisible) {
        // Another player (Audio) started, close this one
        close();
      }
    };

    window.addEventListener("audioPlayerStarted", handleOtherPlayerStarted);
    return () => {
      window.removeEventListener(
        "audioPlayerStarted",
        handleOtherPlayerStarted
      );
    };
  }, [isVisible]);

  const playNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % playlist.length;
      return nextIndex;
    });
  }, [playlist.length]);

  const play = useCallback(
    (video, videoList = []) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setCurrentVideo(video);
      setIsVisible(true);

      if (videoList.length > 0) {
        setPlaylist(videoList);
        const index = videoList.findIndex((v) => v.id === video.id);
        setCurrentIndex(index >= 0 ? index : 0);
      }

      // Notify other players to stop
      notifyOtherPlayers();
    },
    [notifyOtherPlayers]
  );

  // Auto-play effect for Discover section
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (autoPlay && playlist.length > 1 && currentVideo && isVisible) {
      timerRef.current = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % playlist.length;
        const nextVideo = playlist[nextIndex];
        if (nextVideo) {
          setCurrentIndex(nextIndex);
          setCurrentVideo(nextVideo);
          notifyOtherPlayers();
        }
      }, 210000); // 3.5 minutes (210 seconds) - typical song length
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    currentVideo,
    currentIndex,
    playlist,
    autoPlay,
    isVisible,
    notifyOtherPlayers,
  ]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => {
      if (prev && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return !prev;
    });
  }, []);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
    setCurrentVideo(null);
    setPlaylist([]);
    setCurrentIndex(0);
  }, []);

  return (
    <YouTubePlayerContext.Provider
      value={{
        currentVideo,
        isVisible,
        playlist,
        currentIndex,
        autoPlay,
        play,
        playNext,
        toggleAutoPlay,
        close,
      }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  );
};

export const useYouTubePlayer = () => {
  const ctx = useContext(YouTubePlayerContext);
  if (!ctx)
    throw new Error(
      "useYouTubePlayer must be used within a YouTubePlayerProvider"
    );
  return ctx;
};
