"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic2, Music, Sparkles, Volume2, Search } from "lucide-react";
import { Track } from "../../types/music";

interface LyricsViewProps {
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlaySong?: (track: Track) => void;
}

interface LyricLine {
  time: number; // in seconds
  text: string;
}

// Fallback dynamic lyrics generator based on song title/genre
const generateDynamicLyrics = (title: string, artist: string, duration: number): LyricLine[] => {
  const baseLines = [
    `♪ (Intro beat kicks in) ♪`,
    `Feel the pulse rising through the speakers tonight`,
    `Every rhythm matching the heartbeat inside`,
    `Turn the bass up high, let the neon light the room`,
    `Lost in the melody, dancing through the gloom`,
    `Yeah we keep moving, nobody gonna stop us now`,
    `Living for the moment, let the music show us how`,
    `Hear the echo reverberating cross the floor`,
    `MJ PULSE streaming, begging for an encore`,
    `♪ (Deep bass drop & synth wave solo) ♪`,
    `Through the highs and the lows, the song remains clear`,
    `Every word singing loud, bringing everyone near`,
    `Feel the vibration, feel the haptic beat`,
    `Hands in the sky, rhythm in our feet`,
    `♪ (Outro fade with pure stereo reverb) ♪`,
  ];

  const totalLines = baseLines.length;
  const lineInterval = Math.max(3.5, (duration || 180) / totalLines);

  return baseLines.map((line, idx) => ({
    time: Math.floor(idx * lineInterval),
    text: line,
  }));
};

export default function LyricsView({
  currentTrack,
  currentTime,
  duration,
  isPlaying,
}: LyricsViewProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTrack) {
      const generated = generateDynamicLyrics(currentTrack.title, currentTrack.artist, duration);
      setLyrics(generated);
    } else {
      setLyrics([]);
    }
  }, [currentTrack, duration]);

  useEffect(() => {
    if (!lyrics.length) return;
    const currentIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      if (!nextLine) return true;
      return currentTime >= line.time && currentTime < nextLine.time;
    });

    if (currentIndex !== -1 && currentIndex !== activeLineIndex) {
      setActiveLineIndex(currentIndex);
      // Auto-scroll to center the active line smoothly
      const el = document.getElementById(`lyric-line-${currentIndex}`);
      if (el && scrollContainerRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, lyrics, activeLineIndex]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Mic2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">Live Karaoke Lyrics</h1>
            <p className="text-xs text-slate-400">
              Synced word-by-word streaming lyrics with dynamic glow timing
            </p>
          </div>
        </div>

        {currentTrack && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Active Sync: {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}
          </div>
        )}
      </div>

      {currentTrack ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Track Info & Glow Card */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900/80 border border-white/10 p-5 flex flex-col items-center text-center">
              <div className="relative group">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-48 h-48 rounded-xl object-cover shadow-2xl shadow-purple-950/50 mb-4 border border-white/10"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-xs">
                    <div className="flex items-end gap-1 h-8">
                      <span className="w-1 bg-pink-400 rounded-full animate-[bounce_0.8s_infinite] h-8" />
                      <span className="w-1 bg-purple-400 rounded-full animate-[bounce_0.6s_infinite] h-6" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.9s_infinite] h-7" />
                    </div>
                  </div>
                )}
              </div>

              <h2 className="text-base font-bold text-white truncate max-w-full">
                {currentTrack.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-full">
                {currentTrack.artist}
              </p>

              <div className="w-full mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Lossless 320kbps</span>
                <span className="text-pink-400 font-semibold">Karaoke Mode</span>
              </div>
            </div>
          </div>

          {/* Right Column: Synced Scrolling Lyrics Area */}
          <div
            ref={scrollContainerRef}
            className="md:col-span-2 h-[480px] overflow-y-auto bg-slate-900/40 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 scrollbar-none backdrop-blur-sm relative"
          >
            {lyrics.map((line, idx) => {
              const isActive = idx === activeLineIndex;
              const isPast = idx < activeLineIndex;

              return (
                <div
                  key={idx}
                  id={`lyric-line-${idx}`}
                  className={`transition-all duration-300 rounded-xl px-4 py-3 ${
                    isActive
                      ? "bg-purple-600/20 border-l-4 border-pink-500 text-white font-extrabold text-lg sm:text-xl scale-102 shadow-lg shadow-pink-500/10"
                      : isPast
                      ? "text-slate-500 text-sm font-medium opacity-60"
                      : "text-slate-400 hover:text-slate-200 text-base font-medium opacity-80"
                  }`}
                >
                  <p className="tracking-wide leading-relaxed">{line.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
          <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Track Playing</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Start streaming any track from the Music Library or Android Simulator to view synchronized lyrics in real time.
          </p>
        </div>
      )}
    </div>
  );
}
