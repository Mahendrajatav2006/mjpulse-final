"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Track } from "../types/music";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function useMusicPlayer(tracks: Track[] = []) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    const initPlayer = () => {
      const container = document.getElementById("hidden-yt-player");
      if (!container || !window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (_) {}
        }

        playerRef.current = new window.YT.Player("hidden-yt-player", {
          height: "0",
          width: "0",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              event.target.setVolume(80);
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
              if (event.data === 1) {
                setIsPlaying(true);
                const trackDuration = event.target.getDuration();
                if (trackDuration && !isNaN(trackDuration)) {
                  setDuration(trackDuration);
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                // Auto play next track when song finishes
                handleNextTrack();
              }
            },
            onError: (err: any) => {
              console.error("[MusicPlayer Engine Error]:", err);
              setIsPlaying(false);
            },
          },
        });
      } catch (e) {
        console.error("Failed to construct YT.Player:", e);
      }
    };

    if (!window.YT) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Update current time progress smoothly
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          const time = playerRef.current.getCurrentTime() || 0;
          setCurrentTime(time);
          const total = playerRef.current.getDuration() || 0;
          if (total > 0 && total !== duration) {
            setDuration(total);
          }
        }
      }, 500);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, duration]);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);

    if (track.duration) {
      setDuration(track.duration);
    }

    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById({
        videoId: track.id,
        startSeconds: 0,
      });
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      if (typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      if (typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
    }
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(newVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      const restoreVolume = volume > 0 ? volume : 80;
      playerRef.current.unMute();
      playerRef.current.setVolume(restoreVolume);
      setIsMuted(false);
      setVolume(restoreVolume);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleNextTrack = useCallback(() => {
    if (!tracks || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = currentIndex >= 0 && currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    playTrack(tracks[nextIndex]);
  }, [tracks, currentTrack, playTrack]);

  const handlePrevTrack = useCallback(() => {
    if (!tracks || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    playTrack(tracks[prevIndex]);
  }, [tracks, currentTrack, playTrack]);

  return {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    isReady,
    playTrack,
    togglePlayPause,
    seekTo,
    changeVolume,
    toggleMute,
    nextTrack: handleNextTrack,
    prevTrack: handlePrevTrack,
  };
}
