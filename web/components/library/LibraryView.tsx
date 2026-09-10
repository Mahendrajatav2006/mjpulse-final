"use client";

import React, { useState, useEffect } from "react";
import { Heart, History, Trash2, Play, Music, Sparkles } from "lucide-react";
import { Track } from "../../types/music";

interface LibraryViewProps {
  onPlaySong: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export default function LibraryView({
  onPlaySong,
  currentTrack,
  isPlaying,
}: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<"favorites" | "history">("favorites");
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  // Load real user data from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("mj_pulse_favorites");
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }

      const savedHist = localStorage.getItem("mj_pulse_listen_history");
      if (savedHist) {
        const parsed = JSON.parse(savedHist);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {}
  }, []);

  const removeFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter((t) => t.id !== trackId);
    setFavorites(updated);
    try {
      localStorage.setItem("mj_pulse_favorites", JSON.stringify(updated));
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("mj_pulse_listen_history");
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white">Your Personal Library</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Liked tracks and your recent listening history stored on this device
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "favorites"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "history"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Recent History ({history.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "favorites" ? (
        <div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {favorites.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onPlaySong(track)}
                    className={`group flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition border ${
                      isCurrent
                        ? "bg-purple-600/20 border-purple-500/50"
                        : "bg-slate-900/40 hover:bg-slate-900/80 border-white/5"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{track.title}</p>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>

                    <button
                      onClick={(e) => removeFavorite(track.id, e)}
                      title="Remove from favorites"
                      className="p-2 text-pink-400 hover:text-pink-300 opacity-60 group-hover:opacity-100 transition"
                    >
                      <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Favorite Songs Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Click the heart icon on any song in the Music Library or Android Simulator to build your personal collection.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {history.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear History
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((track, i) => (
                  <div
                    key={`${track.id}-${i}`}
                    onClick={() => onPlaySong(track)}
                    className="group flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 cursor-pointer transition"
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{track.title}</p>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>
                    <Play className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Listening History is Empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Songs you play will automatically appear here for quick access.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
