"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Maximize2,
  ListMusic,
  BarChart2,
} from "lucide-react";
import { Track } from "../../types/music";

interface BottomPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function BottomPlayer({
  currentTrack,
  isPlaying,
  volume,
  isMuted,
  currentTime,
  duration,
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
}: BottomPlayerProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-22 sm:h-24 backdrop-blur-2xl bg-[#080911]/95 border-t border-white/10 px-4 sm:px-8 flex items-center justify-between z-50 shadow-2xl">
      {/* Left: Song Metadata & Favorite */}
      <div className="flex items-center space-x-3 w-1/4 min-w-[180px]">
        {currentTrack ? (
          <>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/15 shadow-lg group">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-xs sm:text-sm font-bold text-white truncate hover:text-[#00F2FE] transition cursor-pointer">
                {currentTrack.title}
              </p>
              <p className="text-[10px] sm:text-xs text-white/50 truncate">{currentTrack.artist}</p>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-white/40 hover:text-[#FF007F] transition flex-shrink-0 p-1"
              aria-label="Favorite"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "text-[#FF007F] fill-current" : ""
                }`}
              />
            </button>
          </>
        ) : (
          <div className="text-xs text-white/40 italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/20 animate-pulse"></span>
            Select a track to start playback
          </div>
        )}
      </div>

      {/* Center: Playback Controls & Interactive Timeline Scrubber */}
      <div className="flex flex-col items-center space-y-1.5 flex-1 max-w-xl px-2 sm:px-6">
        {/* Playback Controls Row */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition hidden sm:block ${
              isShuffle ? "text-[#00F2FE]" : "text-white/40 hover:text-white"
            }`}
            aria-label="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrev}
            disabled={!currentTrack}
            className="text-white/60 hover:text-white hover:scale-110 active:scale-95 transition disabled:opacity-30"
            aria-label="Previous"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Glowing Play/Pause Center Button from Image 3 */}
          <button
            onClick={onTogglePlayPause}
            disabled={!currentTrack}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#FF007F] via-[#8B5CF6] to-[#00F2FE] text-black flex items-center justify-center shadow-lg shadow-[#FF007F]/25 hover:scale-105 active:scale-95 transition ${
              !currentTrack ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current text-black" />
            ) : (
              <Play className="w-5 h-5 fill-current text-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!currentTrack}
            className="text-white/60 hover:text-white hover:scale-110 active:scale-95 transition disabled:opacity-30"
            aria-label="Next"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition hidden sm:block ${
              isRepeat ? "text-[#00F2FE]" : "text-white/40 hover:text-white"
            }`}
            aria-label="Repeat"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber Timeline Bar */}
        <div className="w-full flex items-center space-x-2 text-[10px] sm:text-xs text-white/40 font-mono">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center group cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration > 0 ? duration : 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              disabled={!currentTrack || duration <= 0}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE] group-hover:h-1.5 transition-all"
            />
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Animated Soundwave Visualizer Bars */}
      <div className="flex items-center justify-end space-x-3 sm:space-x-4 w-1/4">
        {/* Animated Neon Visualizer Spectrum Bars (Image 3) */}
        <div className="hidden md:flex items-end space-x-1 h-5 px-2">
          {[60, 100, 40, 80, 50, 90, 70].map((h, i) => (
            <div
              key={i}
              style={{
                height: isPlaying ? `${h}%` : "20%",
                transition: "height 0.25s ease-in-out",
              }}
              className="w-1 rounded-full bg-gradient-to-t from-[#FF007F] to-[#00F2FE]"
            />
          ))}
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="text-white/60 hover:text-white transition"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-14 sm:w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
            aria-label="Volume Slider"
          />
        </div>
      </div>
    </footer>
  );
}
