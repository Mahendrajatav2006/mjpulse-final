"use client";

import React from "react";
import { Play, Pause, Heart, Sparkles, Music2, Disc3 } from "lucide-react";
import { Track } from "../../types/music";

interface TrackGridProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onPlay: (track: Track) => void;
  onTogglePlayPause: () => void;
}

const CATEGORIES = [
  "Trending Hits",
  "Bollywood Soul",
  "Party Mode 2.0",
  "Punjabi Pop",
  "Lo-Fi Chill",
  "Sub-Bass Drops",
  "Global Top 50",
  "Indie & Acoustic",
];

export default function TrackGrid({
  tracks,
  currentTrack,
  isPlaying,
  isLoading,
  activeCategory,
  onSelectCategory,
  onPlay,
  onTogglePlayPause,
}: TrackGridProps) {
  // Local storage helper for likes
  const isTrackLiked = (trackId: string) => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("mj_pulse_liked_songs");
      const list: Track[] = saved ? JSON.parse(saved) : [];
      return list.some((t) => t.id === trackId);
    } catch {
      return false;
    }
  };

  const toggleLike = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("mj_pulse_liked_songs");
      const list: Track[] = saved ? JSON.parse(saved) : [];
      const exists = list.some((t) => t.id === track.id);
      const updated = exists
        ? list.filter((t) => t.id !== track.id)
        : [track, ...list];
      localStorage.setItem("mj_pulse_liked_songs", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  return (
    <div id="track-grid-container" className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 scale-105"
                  : "bg-[#111322] border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Header with Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Disc3 className="w-5 h-5 text-pink-400 animate-spin-slow" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            {activeCategory}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white/60">
            {tracks.length} Songs
          </span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#111322] border border-white/5 animate-pulse space-y-3"
            >
              <div className="w-full aspect-square rounded-xl bg-white/5" />
              <div className="h-3 w-3/4 bg-white/10 rounded" />
              <div className="h-2.5 w-1/2 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Track Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            const isThisCurrent = currentTrack?.id === track.id;
            const liked = isTrackLiked(track.id);

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isThisCurrent) {
                    onTogglePlayPause();
                  } else {
                    onPlay(track);
                  }
                }}
                className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isThisCurrent
                    ? "bg-[#16182c] border border-pink-500/50 shadow-lg shadow-pink-500/10"
                    : "bg-[#111322] border border-white/5 hover:border-white/20 hover:bg-[#141629]"
                }`}
              >
                {/* Artwork / Thumbnail */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-3 shadow-md">
                  {track.thumbnail ? (
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-900/40 to-pink-900/40">
                      <Music2 className="w-8 h-8 text-white/30" />
                    </div>
                  )}

                  {/* Playing Wave Overlay */}
                  {isThisPlaying && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex items-end gap-1 h-6">
                        <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                        <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
                        <span className="w-1 bg-pink-400 rounded-full animate-bounce h-5" />
                        <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.45s] h-3" />
                      </div>
                    </div>
                  )}

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 transform group-hover:scale-110 transition active:scale-95"
                      aria-label="Play song"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Like Button on Artwork */}
                  <button
                    onClick={(e) => toggleLike(track, e)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition ${
                      liked
                        ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                        : "bg-black/50 text-white/60 hover:text-white opacity-0 group-hover:opacity-100"
                    }`}
                    aria-label="Like song"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Song Meta */}
                <div className="space-y-1">
                  <h3
                    className={`text-xs font-bold truncate leading-tight ${
                      isThisCurrent ? "text-pink-400" : "text-white"
                    }`}
                    title={track.title}
                  >
                    {track.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <p className="truncate pr-1" title={track.artist}>
                      {track.artist}
                    </p>
                    {track.durationFormatted && (
                      <span className="text-[10px] font-mono text-white/30 shrink-0">
                        {track.durationFormatted}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tracks.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#111322] border border-white/5 space-y-3">
          <Music2 className="w-10 h-10 text-white/20 mx-auto" />
          <p className="text-sm font-semibold text-white/60">
            No songs found for this category.
          </p>
          <button
            onClick={() => onSelectCategory("Trending Hits")}
            className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30 hover:bg-pink-500/30 transition"
          >
            Load Trending Hits
          </button>
        </div>
      )}
    </div>
  );
}
