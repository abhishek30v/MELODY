import React, { createContext, useContext, useState, useCallback } from "react";

const YouTubePlayerContext = createContext();

export const YouTubePlayerProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const play = useCallback((video) => {
    setCurrentVideo(video);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setCurrentVideo(null);
  }, []);

  return (
    <YouTubePlayerContext.Provider
      value={{ currentVideo, isVisible, play, close }}
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
