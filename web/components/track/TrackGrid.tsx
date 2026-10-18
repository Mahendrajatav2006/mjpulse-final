"use client";

import React from "react";
import { Music, Flame, SearchX } from "lucide-react";
import { Track } from "../../types/music";
import TrackCard from "./TrackCard";

interface TrackGridProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onPlay: (track: Track) => void;
  onTogglePlayPause: () => void;
}

const CATEGORIES = [
  "Trending Hits",
  "Arijit Singh",
  "Bollywood Romance",
  "Punjabi Beats",
  "Global Top 50",
  "Lo-Fi Chill",
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
  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full pb-36">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-[#00F2FE] text-black border-[#00F2FE] shadow-lg shadow-[#00F2FE]/25 font-bold"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-[#00F2FE]" />
          <span>{activeCategory || "Trending Hits"}</span>
          <span className="text-xs text-white/40 font-normal">({tracks.length} tracks)</span>
        </h2>
        {isLoading && (
          <span className="text-xs text-[#00F2FE] font-medium animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
            Loading tracks...
          </span>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && tracks.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse"
            >
              <div className="aspect-video rounded-xl bg-white/10 mb-3" />
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/40">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No songs found</h3>
          <p className="text-sm text-white/40 max-w-sm mb-5">
            Try searching for another artist, track name, or click on one of the popular categories above.
          </p>
          <button
            onClick={() => onSelectCategory("Trending Hits")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-semibold text-xs shadow-lg shadow-[#00F2FE]/20 hover:scale-105 transition"
          >
            Load Trending Hits
          </button>
        </div>
      )}

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={isPlaying}
            isCurrent={currentTrack?.id === track.id}
            onPlay={onPlay}
            onTogglePlayPause={onTogglePlayPause}
          />
        ))}
      </div>
    </main>
  );
}
