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
  const [history, setHistory] = useState<Track[]>([]);

  // Engine state: "html5" | "youtube" | "none"
  const activeEngineRef = useRef<"html5" | "youtube" | "none">("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Native HTML5 Audio Engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (activeEngineRef.current === "html5") {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      }
    };

    const onPlaying = () => {
      if (activeEngineRef.current === "html5") {
        setIsPlaying(true);
      }
    };

    const onPause = () => {
      if (activeEngineRef.current === "html5") {
        setIsPlaying(false);
      }
    };

    const onEnded = () => {
      if (activeEngineRef.current === "html5") {
        setIsPlaying(false);
        handleNextTrack();
      }
    };

    const onError = async (e: Event) => {
      console.warn("[HTML5 Audio Engine] Playback event error:", e);
      // If direct stream had an issue, attempt auto-recovery via /api/stream
      if (currentTrack) {
        try {
          const res = await fetch(`/api/stream?q=${encodeURIComponent(`${currentTrack.title} ${currentTrack.artist}`)}`);
          const json = await res.json();
          if (json.success && json.streamUrl && json.streamUrl !== audio.src) {
            audio.src = json.streamUrl;
            audio.play().catch((err) => console.warn("[HTML5 Audio Engine] Recovery play:", err));
          }
        } catch (_) {}
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    setIsReady(true);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Initialize YouTube IFrame API as secondary engine
  useEffect(() => {
    const initYtPlayer = () => {
      const container = document.getElementById("hidden-yt-player");
      if (!container || !window.YT || !window.YT.Player) return;

      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch (_) {}
        }

        ytPlayerRef.current = new window.YT.Player("hidden-yt-player", {
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
              event.target.setVolume(80);
            },
            onStateChange: (event: any) => {
              if (activeEngineRef.current !== "youtube") return;
              // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
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
                handleNextTrack();
              }
            },
            onError: (err: any) => {
              console.warn("[YouTube Engine Error]:", err);
              if (activeEngineRef.current === "youtube") {
                setIsPlaying(false);
              }
            },
          },
        });
      } catch (e) {
        console.warn("Failed to construct YT.Player:", e);
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
        initYtPlayer();
      };
    } else {
      initYtPlayer();
    }
  }, []);

  // Sync YouTube progress timer when active engine is YouTube
  useEffect(() => {
    if (isPlaying && activeEngineRef.current === "youtube") {
      progressTimerRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
          const time = ytPlayerRef.current.getCurrentTime() || 0;
          setCurrentTime(time);
          const total = ytPlayerRef.current.getDuration() || 0;
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

  /**
   * Unified playTrack:
   * Prioritizes direct audio stream URL with HTML5 audio element for instant, lossless playback.
   * If not available, resolves via /api/stream or falls back to YouTube.
   */
  const playTrack = useCallback(async (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    saveHistory(track);

    if (track.duration) {
      setDuration(track.duration);
    }

    const audio = audioRef.current;

    // Check if track has a direct audio stream URL
    if (track.streamUrl && track.streamUrl.startsWith("http")) {
      // Pause YouTube player if active
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (_) {}
      }

      activeEngineRef.current = "html5";
      if (audio) {
        audio.src = track.streamUrl;
        audio.volume = isMuted ? 0 : volume / 100;
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (playErr) {
          console.warn("[HTML5 Audio] Direct play rejected (possible autoplay restriction):", playErr);
          setIsPlaying(true); // User initiated click, state reflects playing intent
        }
      }
      return;
    }

    // If no direct stream URL, check if ID looks like a 11-char YouTube ID
    const isYouTubeId = /^[a-zA-Z0-9_-]{11}$/.test(track.id);

    if (isYouTubeId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
      if (audio) {
        audio.pause();
      }
      activeEngineRef.current = "youtube";
      try {
        ytPlayerRef.current.loadVideoById({
          videoId: track.id,
          startSeconds: 0,
        });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (err) {
        console.warn("[YouTube Engine] loadVideoById error:", err);
      }
      return;
    }

    // Otherwise, fetch stream URL dynamically from /api/stream
    try {
      const query = `${track.title} ${track.artist}`.trim();
      const res = await fetch(`/api/stream?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.streamUrl && audio) {
        // Pause YouTube
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
          try {
            ytPlayerRef.current.pauseVideo();
          } catch (_) {}
        }

        activeEngineRef.current = "html5";
        audio.src = data.streamUrl;
        audio.volume = isMuted ? 0 : volume / 100;
        await audio.play();
        setIsPlaying(true);
        return;
      }
    } catch (err) {
      console.warn("[useMusicPlayer] /api/stream fetch failed:", err);
    }

    // Ultimate fallback: high reliability stream
    if (audio) {
      activeEngineRef.current = "html5";
      audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audio.volume = isMuted ? 0 : volume / 100;
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [saveHistory, isMuted, volume]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;

    if (activeEngineRef.current === "html5" && audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch((e) => console.warn("Audio play:", e));
      }
      return;
    }

    if (activeEngineRef.current === "youtube" && ytPlayerRef.current) {
      if (isPlaying) {
        if (typeof ytPlayerRef.current.pauseVideo === "function") {
          ytPlayerRef.current.pauseVideo();
        }
        setIsPlaying(false);
      } else {
        if (typeof ytPlayerRef.current.playVideo === "function") {
          ytPlayerRef.current.playVideo();
        }
        setIsPlaying(true);
      }
      return;
    }

    // If no song playing yet, play first track
    if (!currentTrack && tracks.length > 0) {
      playTrack(tracks[0]);
    }
  }, [isPlaying, currentTrack, tracks, playTrack]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);

    if (activeEngineRef.current === "html5" && audioRef.current) {
      audioRef.current.currentTime = seconds;
      return;
    }

    if (activeEngineRef.current === "youtube" && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      ytPlayerRef.current.seekTo(seconds, true);
    }
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    const muted = newVolume === 0;
    setIsMuted(muted);

    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : newVolume / 100;
    }

    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === "function") {
      ytPlayerRef.current.setVolume(newVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      const restoreVolume = volume > 0 ? volume : 80;
      setIsMuted(false);
      setVolume(restoreVolume);

      if (audioRef.current) {
        audioRef.current.volume = restoreVolume / 100;
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === "function") {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(restoreVolume);
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === "function") {
        ytPlayerRef.current.mute();
      }
    }
  }, [isMuted, volume]);

  /**
   * Smart Next Track
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
