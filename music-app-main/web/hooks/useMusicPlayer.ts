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

  const [history, setHistory] = useState<Track[]>([]);

  // Load history from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulse_playback_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  const saveHistory = useCallback((track: Track) => {
    try {
      setHistory((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        const updated = [track, ...filtered].slice(0, 50);
        localStorage.setItem("pulse_playback_history", JSON.stringify(updated));
        return updated;
      });
    } catch (_) {}
  }, []);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    saveHistory(track);

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
  }, [saveHistory]);

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

  /**
   * Smart Related Auto-Play:
   * Next track is fetched based on the current song's artist and style from /api/related
   * Guaranteed to be related and never random!
   */
  const handleNextTrack = useCallback(async () => {
    if (!currentTrack) {
      if (tracks && tracks.length > 0) playTrack(tracks[0]);
      return;
    }

    try {
      const res = await fetch(
        `/api/related?artist=${encodeURIComponent(currentTrack.artist)}&genre=${encodeURIComponent(
          currentTrack.album || ""
        )}&title=${encodeURIComponent(currentTrack.title)}&currentId=${encodeURIComponent(currentTrack.id)}&limit=10`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const nextRelated = data.data[0];
        playTrack(nextRelated);
        return;
      }
    } catch (_) {}

    // Fallback: next in active tracklist
    if (tracks && tracks.length > 0) {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = currentIndex >= 0 && currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
      playTrack(tracks[nextIndex]);
    }
  }, [currentTrack, tracks, playTrack]);

  const handlePrevTrack = useCallback(() => {
    // Replay previous song from playback history
    if (history.length >= 2) {
      const prev = history[0].id === currentTrack?.id ? history[1] : history[0];
      if (prev) {
        playTrack(prev);
        return;
      }
    }

    if (!tracks || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    playTrack(tracks[prevIndex]);
  }, [history, currentTrack, tracks, playTrack]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem("pulse_playback_history");
      setHistory([]);
    } catch (_) {}
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    isReady,
    history,
    clearHistory,
    playTrack,
    togglePlayPause,
    seekTo,
    changeVolume,
    toggleMute,
    nextTrack: handleNextTrack,
    prevTrack: handlePrevTrack,
  };
}

