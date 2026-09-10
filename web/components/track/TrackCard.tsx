"use client";

import React from "react";
import { Play, Pause, BarChart2 } from "lucide-react";
import { Track } from "../../types/music";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (track: Track) => void;
  onTogglePlayPause: () => void;
}

export default function TrackCard({
  track,
  isPlaying,
  isCurrent,
  onPlay,
  onTogglePlayPause,
}: TrackCardProps) {
  const handleClick = () => {
    if (isCurrent) {
      onTogglePlayPause();
    } else {
      onPlay(track);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isCurrent
          ? "bg-[#00F2FE]/10 border-[#00F2FE] shadow-lg shadow-[#00F2FE]/20"
          : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
      } backdrop-blur-md flex flex-col justify-between`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black/40">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Hover / Active Play Button Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition flex items-center justify-center ${
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center shadow-lg shadow-[#00F2FE]/30 hover:scale-110 transition">
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Duration Badge */}
        {track.durationFormatted && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white/80">
            {track.durationFormatted}
          </div>
        )}

        {/* Equalizer Badge if Playing */}
        {isCurrent && isPlaying && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#00F2FE] text-black text-[10px] font-bold flex items-center gap-1 shadow">
            <BarChart2 className="w-3 h-3 animate-pulse" />
            PLAYING
          </div>
        )}
      </div>

      {/* Track Meta */}
      <div>
        <h3
          className={`font-semibold text-sm line-clamp-1 transition ${
            isCurrent ? "text-[#00F2FE]" : "text-white group-hover:text-[#00F2FE]"
          }`}
        >
          {track.title}
        </h3>
        <p className="text-xs text-white/50 mt-1 line-clamp-1">{track.artist}</p>
        {track.album && (
          <p className="text-[11px] text-white/30 mt-0.5 line-clamp-1">{track.album}</p>
        )}
      </div>
    </div>
  );
}
