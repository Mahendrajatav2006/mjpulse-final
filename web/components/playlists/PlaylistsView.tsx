"use client";

import React from "react";
import { ListMusic, Plus, Play, Music, Lock, Globe } from "lucide-react";
import { PlaylistItem, Track } from "../../types/music";

interface PlaylistsViewProps {
  playlists: PlaylistItem[];
  onOpenCreatePlaylist: () => void;
  onPlaySong: (track: Track) => void;
}

export default function PlaylistsView({
  playlists,
  onOpenCreatePlaylist,
  onPlaySong,
}: PlaylistsViewProps) {
  const sampleTracks: Record<string, Track> = {
    "Kesariya Soul": {
      id: "NJAv_7lHUIU",
      title: "Kesariya (From Brahmastra)",
      artist: "Arijit Singh, Pritam",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
      duration: 269,
      durationFormatted: "4:29",
      source: "YouTube Music",
    },
    "Party Mode": {
      id: "3y-O-4IL-PU",
      title: "Starboy & Night Drive",
      artist: "The Weeknd ft. Daft Punk",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500",
      duration: 230,
      durationFormatted: "3:50",
      source: "YouTube Music",
    },
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#FF007F]" />
            <span>Curated & User Playlists</span>
          </h2>
          <p className="text-xs text-white/50">Manage playlists across MJ PULSE mobile and web</p>
        </div>

        <button
          onClick={onOpenCreatePlaylist}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#FF007F]/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 hover:border-white/20 transition group flex flex-col justify-between"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black/40">
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => onPlaySong(sampleTracks["Kesariya Soul"])}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF007F] to-[#00F2FE] text-black flex items-center justify-center shadow-lg hover:scale-110 transition"
                  aria-label="Play Playlist"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>

              {pl.isPrivate ? (
                <span className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-white/70">
                  <Lock className="w-3 h-3" />
                </span>
              ) : (
                <span className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-[#00F2FE]">
                  <Globe className="w-3 h-3" />
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#FF007F] transition truncate">
                {pl.title}
              </h3>
              <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{pl.description}</p>
              <div className="flex items-center justify-between text-[11px] text-white/40 mt-3 pt-2 border-t border-white/5">
                <span>{pl.songCount} Tracks</span>
                <span className="text-[#00F2FE]">Ready to Stream</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
