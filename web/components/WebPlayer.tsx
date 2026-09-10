"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./layout/Sidebar";
import TopHeader from "./layout/TopHeader";
import TrackGrid from "./track/TrackGrid";
import AndroidSimulatorView from "./android/AndroidSimulatorView";
import EqualizerView from "./equalizer/EqualizerView";
import LyricsView from "./lyrics/LyricsView";
import LibraryView from "./library/LibraryView";
import DownloadHubView from "./download/DownloadHubView";
import SettingsView from "./settings/SettingsView";
import BottomPlayer from "./player/BottomPlayer";
import HiddenPlayerEngine from "./player/HiddenPlayerEngine";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { Track, NavTab } from "../types/music";

export default function WebPlayer() {
  const [activeTab, setActiveTab] = useState<NavTab>("android");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Trending Hits");

  // Persistent Player hook
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    playTrack,
    togglePlayPause,
    seekTo,
    changeVolume,
    toggleMute,
    nextTrack,
    prevTrack,
  } = useMusicPlayer(tracks);

  // Auto-record to real listening history
  const handlePlaySongWithHistory = useCallback(
    (track: Track) => {
      playTrack(track);
      try {
        const saved = localStorage.getItem("mj_pulse_listen_history");
        const list: Track[] = saved ? JSON.parse(saved) : [];
        const updated = [track, ...list.filter((t) => t.id !== track.id)].slice(0, 30);
        localStorage.setItem("mj_pulse_listen_history", JSON.stringify(updated));
      } catch {}
    },
    [playTrack]
  );

  // Search API fetcher
  const fetchTracks = useCallback(async (query: string) => {
    if (!query || !query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTracks(data.data);
      }
    } catch (err) {
      console.error("Error searching tracks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Global search from top header
  const handleGlobalSearch = (query: string) => {
    setActiveTab("music");
    fetchTracks(query);
  };

  // Genre / Category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    const queryMap: Record<string, string> = {
      "Trending Hits": "trending hindi english",
      "Bollywood Soul": "bollywood romance arijit shreya",
      "Party Mode 2.0": "party club punjabi edm bass",
      "Punjabi Pop": "punjabi pop ap dhillon diljit karan aujla",
      "Lo-Fi Chill": "lofi chill beats midnight",
      "Sub-Bass Drops": "bass boosted phonk electronic",
      "Global Top 50": "top global viral hits billboard",
      "Indie & Acoustic": "indian indie acoustic folk",
    };
    const q = queryMap[category] || category;
    fetchTracks(q);
  };

  // Initial load
  useEffect(() => {
    fetchTracks("trending hits 2026 arijit diljit the weeknd");
  }, [fetchTracks]);

  return (
    <div className="min-h-screen bg-[#05060b] text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Hidden Audio Engine */}
      <HiddenPlayerEngine />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAppPreview={() => setActiveTab("android")}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen pb-32">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onGlobalSearch={handleGlobalSearch}
        />

        {/* Dynamic Tab Content */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "android" && (
            <AndroidSimulatorView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySongWithHistory}
              onTogglePlayPause={togglePlayPause}
              currentTime={currentTime}
              duration={duration}
              onSeekTo={seekTo}
              onNextTrack={nextTrack}
              onPrevTrack={prevTrack}
              tracks={tracks}
            />
          )}

          {activeTab === "music" && (
            <TrackGrid
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              isLoading={loading}
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
              onPlay={handlePlaySongWithHistory}
              onTogglePlayPause={togglePlayPause}
            />
          )}

          {activeTab === "equalizer" && (
            <EqualizerView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          )}

          {activeTab === "lyrics" && (
            <LyricsView
              currentTrack={currentTrack}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySongWithHistory}
            />
          )}

          {activeTab === "library" && (
            <LibraryView
              onPlaySong={handlePlaySongWithHistory}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          )}

          {activeTab === "download" && <DownloadHubView />}

          {activeTab === "settings" && <SettingsView />}
        </div>
      </div>

      {/* Bottom Persistent Music Player */}
      <BottomPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        onTogglePlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seekTo}
        onVolumeChange={changeVolume}
        onToggleMute={toggleMute}
      />
    </div>
  );
}
