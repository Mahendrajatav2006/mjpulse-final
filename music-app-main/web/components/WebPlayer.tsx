"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./layout/Sidebar";
import TopHeader from "./layout/TopHeader";
import OverviewView from "./dashboard/OverviewView";
import ShowcaseView from "./showcase/ShowcaseView";
import TrackGrid from "./track/TrackGrid";
import PlaylistsView from "./playlists/PlaylistsView";
import UpdatesView from "./updates/UpdatesView";
import AnnouncementsView from "./announcements/AnnouncementsView";
import FeatureControlView from "./features/FeatureControlView";
import SettingsView from "./settings/SettingsView";
import UsersView from "./users/UsersView";
import BottomPlayer from "./player/BottomPlayer";
import HiddenPlayerEngine from "./player/HiddenPlayerEngine";
import UploadSongModal from "./modals/UploadSongModal";
import CreatePlaylistModal from "./modals/CreatePlaylistModal";
import PushUpdateModal from "./modals/PushUpdateModal";
import NewAnnouncementModal from "./modals/NewAnnouncementModal";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { Track, NavTab, AppUpdateItem, AnnouncementItem, PlaylistItem } from "../types/music";

export default function WebPlayer() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Trending Hits");

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  // App Updates dynamic state
  const [updates, setUpdates] = useState<AppUpdateItem[]>([
    {
      id: "up-1",
      version: "v1.0.4",
      title: "Party Mode 2.0 & Haptic Pulse Released",
      date: "May 14, 2026",
      status: "Published",
      description: "Sub-bass tactile haptics, neon beat visualizer spectrum, and zero-latency audio engine.",
      highlights: ["Haptic Pulse Vibration", "Neon Visualizer Spectrum", "Bluetooth Latency Fix"],
    },
    {
      id: "up-2",
      version: "v1.0.3",
      title: "New Visualizer Added & Headless Core",
      date: "May 10, 2026",
      status: "Published",
      description: "Implemented client-side headless YouTube engine eliminating CORS and 403 Forbidden.",
      highlights: ["Headless YT IFrame Engine", "Zero-CORS Audio", "Edge Search Caching"],
    },
    {
      id: "up-3",
      version: "v1.0.2",
      title: "AI Playlist Recommendation Engine",
      date: "May 07, 2026",
      status: "Published",
      description: "Machine learning acoustics analysis and seamless track blending.",
      highlights: ["Smart DJ Crossfader", "Acoustic Vibe Matching"],
    },
  ]);

  // Announcements dynamic state
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: "ann-1",
      title: "New Party Mode is Live! 🔥",
      subtitle: "Feel the beat with haptic feedback, synchronized strobe lights & spatial sound.",
      timeAgo: "2 hours ago",
      iconType: "party",
    },
    {
      id: "ann-2",
      title: "New AI DJ Feature Released 🧠",
      subtitle: "AI will now automatically analyze your mood and curate perfect flow playlists.",
      timeAgo: "1 day ago",
      iconType: "ai",
    },
    {
      id: "ann-3",
      title: "Weekend Special: Top 50 Hits 🎵",
      subtitle: "Stream the top 50 trending chart-toppers in lossless 320kbps master.",
      timeAgo: "2 days ago",
      iconType: "playlist",
    },
  ]);

  // Playlists dynamic state
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([
    {
      id: "pl-1",
      title: "Bollywood Romantic Soul",
      description: "Arijit Singh, Pritam, Atif Aslam & Shreya Ghoshal classics.",
      songCount: 48,
      coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "pl-2",
      title: "Party Mode 2.0 Bass Hype",
      description: "Sub-woofer shaking Punjabi, EDM & Desi Hip-Hop drops.",
      songCount: 35,
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "pl-3",
      title: "Midnight Drive & Lo-Fi Chill",
      description: "Smooth synthwave and late-night nocturnal chillout beats.",
      songCount: 52,
      coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "pl-4",
      title: "Global Top 50 Viral Hits",
      description: "The most played songs in the world this week.",
      songCount: 50,
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    },
  ]);

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
      console.error("[WebPlayer] Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTracks("Top Hits Trending");
  }, [fetchTracks]);

  const handleGlobalSearch = (query: string) => {
    setActiveTab("music");
    setActiveCategory(query);
    fetchTracks(query);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    fetchTracks(category);
  };

  return (
    <div className="min-h-screen bg-[#080911] text-white flex font-sans selection:bg-[#00F2FE] selection:text-black">
      {/* Headless Player Engine (Persistent Audio Stream) */}
      <HiddenPlayerEngine />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAppPreview={() => setActiveTab("showcase")}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onGlobalSearch={handleGlobalSearch}
        />

        {/* Dynamic Tab Content */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <OverviewView
              onOpenUploadSong={() => setIsUploadOpen(true)}
              onOpenCreatePlaylist={() => setIsPlaylistOpen(true)}
              onOpenPushUpdate={() => setIsUpdateOpen(true)}
              onOpenNewAnnouncement={() => setIsAnnouncementOpen(true)}
              onPlaySong={playTrack}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTogglePlayPause={togglePlayPause}
              updates={updates}
              announcements={announcements}
            />
          )}

          {activeTab === "showcase" && (
            <ShowcaseView
              onSwitchToDashboard={() => setActiveTab("dashboard")}
              onPlaySong={playTrack}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTogglePlayPause={togglePlayPause}
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
              onPlay={playTrack}
              onTogglePlayPause={togglePlayPause}
            />
          )}

          {activeTab === "playlists" && (
            <PlaylistsView
              playlists={playlists}
              onOpenCreatePlaylist={() => setIsPlaylistOpen(true)}
              onPlaySong={playTrack}
            />
          )}

          {activeTab === "users" && <UsersView />}

          {activeTab === "updates" && (
            <UpdatesView
              updates={updates}
              onOpenPushUpdate={() => setIsUpdateOpen(true)}
            />
          )}

          {activeTab === "announcements" && (
            <AnnouncementsView
              announcements={announcements}
              onOpenNewAnnouncement={() => setIsAnnouncementOpen(true)}
            />
          )}

          {activeTab === "features" && <FeatureControlView />}

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

      {/* Modals */}
      <UploadSongModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSongUploaded={(newTrack) => {
          setTracks((prev) => [newTrack, ...prev]);
          playTrack(newTrack);
        }}
      />

      <CreatePlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        onPlaylistCreated={(newPlaylist) => {
          setPlaylists((prev) => [newPlaylist, ...prev]);
        }}
      />

      <PushUpdateModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onUpdatePushed={(newUpdate) => {
          setUpdates((prev) => [newUpdate, ...prev]);
        }}
      />

      <NewAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onAnnouncementCreated={(newAnn) => {
          setAnnouncements((prev) => [newAnn, ...prev]);
        }}
      />
    </div>
  );
}
