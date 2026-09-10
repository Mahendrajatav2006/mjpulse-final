"use client";

import React from "react";
import {
  Headphones,
  Play,
  Pause,
  Download,
  Sparkles,
  Volume2,
  Radio,
  Sliders,
  Users2,
  Brain,
  Shield,
  LayoutDashboard,
  CheckCircle,
  ExternalLink,
  Flame,
} from "lucide-react";
import { Track } from "../../types/music";

interface ShowcaseViewProps {
  onSwitchToDashboard: () => void;
  onPlaySong: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
}

export default function ShowcaseView({
  onSwitchToDashboard,
  onPlaySong,
  currentTrack,
  isPlaying,
  onTogglePlayPause,
}: ShowcaseViewProps) {
  const showcaseSong: Track = {
    id: "3y-O-4IL-PU",
    title: "Night Drive (MJ PULSE Mix)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Midnight Neon Session",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    duration: 230,
    durationFormatted: "3:50",
    source: "YouTube Music",
  };

  const isShowcaseTrackPlaying = currentTrack?.id === showcaseSong.id && isPlaying;

  const handleToggleMockupPlayback = () => {
    if (currentTrack?.id === showcaseSong.id) {
      onTogglePlayPause();
    } else {
      onPlaySong(showcaseSong);
    }
  };

  const featureCards = [
    {
      icon: Volume2,
      title: "Hi-Res Audio",
      desc: "24-bit/96kHz lossless audio stream",
      accent: "text-[#00F2FE]",
      border: "hover:border-[#00F2FE]/50",
    },
    {
      icon: Radio,
      title: "Spatial Audio 360°",
      desc: "360° virtualized soundstage",
      accent: "text-[#FF007F]",
      border: "hover:border-[#FF007F]/50",
    },
    {
      icon: Flame,
      title: "Party Mode",
      desc: "Sub-bass haptics & strobe light sync",
      accent: "text-[#FFB300]",
      border: "hover:border-[#FFB300]/50",
    },
    {
      icon: Brain,
      title: "AI Music Recommendation",
      desc: "Vibe analysis matches your mood",
      accent: "text-[#8B5CF6]",
      border: "hover:border-[#8B5CF6]/50",
    },
    {
      icon: Sliders,
      title: "DJ Deck & Crossfader",
      desc: "Dual tempo & pitch controls",
      accent: "text-[#00F2FE]",
      border: "hover:border-[#00F2FE]/50",
    },
    {
      icon: Users2,
      title: "Sync Party",
      desc: "Connect and listen simultaneously",
      accent: "text-emerald-400",
      border: "hover:border-emerald-400/50",
    },
  ];

  return (
    <div className="space-y-12 pb-32">
      {/* Hero Showcase Section (Images 1 & 2) */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#111322] via-[#0c0d18] to-[#080911] border border-white/10 p-6 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#00F2FE]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FF007F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#00F2FE]/10 to-[#FF007F]/10 border border-[#00F2FE]/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span className="bg-gradient-to-r from-[#00F2FE] to-[#FF007F] bg-clip-text text-transparent">
                FEEL THE MUSIC • LIVE THE BEAT
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Your <span className="text-[#FF007F]">Music.</span>
              <br />
              Your <span className="text-[#00F2FE]">Vibe.</span>
              <br />
              Your <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F2FE] bg-clip-text text-transparent">World.</span>
            </h1>

            <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
              MJ PULSE is more than a music player. It&apos;s a complete high-fidelity audio ecosystem with AI vibe sync, haptic pulse, spatial audio, and cloud streaming.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/api/download"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#00c6ff] text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#00F2FE]/30 hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download for Android (APK)</span>
              </a>

              <button
                onClick={() => alert("iOS App Store build coming soon with TestFlight")}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <span>Download for iOS</span>
              </button>

              <button
                onClick={onSwitchToDashboard}
                className="px-5 py-3 rounded-2xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#8B5CF6]" />
                <span>Go to Admin Panel</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">1M+</p>
                <p className="text-xs text-white/40">Happy Listeners</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#00F2FE] font-mono">10K+</p>
                <p className="text-xs text-white/40">Songs & Growing</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#FF007F] font-mono">50+</p>
                <p className="text-xs text-white/40">Audio Features</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Pedestal Headphones & Phone Mockup Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Pedestal Base Ring Glow */}
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center">
              {/* Outer Neon Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#00F2FE]/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-[#FF007F]/40" />
              <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-[#00F2FE]/20 via-transparent to-[#FF007F]/20 blur-xl" />

              {/* Glowing Headphones Pedestal Graphic */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] p-1 shadow-2xl shadow-[#00F2FE]/40 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-[#0a0c16] flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-[#00F2FE]" />
                  </div>
                </div>

                {/* Floating Music Note Badges */}
                <div className="absolute -top-2 -left-4 px-3 py-1 rounded-full bg-[#FF007F]/20 border border-[#FF007F] text-[#FF007F] text-xs font-bold shadow-lg animate-bounce">
                  🎵 320kbps
                </div>
                <div className="absolute -bottom-2 -right-4 px-3 py-1 rounded-full bg-[#00F2FE]/20 border border-[#00F2FE] text-[#00F2FE] text-xs font-bold shadow-lg">
                  ⚡ Party Mode
                </div>
              </div>
            </div>

            {/* Interactive Phone Player Mockup Card */}
            <div className="w-full max-w-sm mt-6 p-4 rounded-3xl bg-[#111320]/90 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  <img
                    src={showcaseSong.thumbnail}
                    alt={showcaseSong.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-[#00F2FE] font-bold uppercase tracking-wider block">
                    Now Playing
                  </span>
                  <p className="text-xs font-bold text-white truncate">{showcaseSong.title}</p>
                  <p className="text-[11px] text-white/40 truncate">{showcaseSong.artist}</p>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={handleToggleMockupPlayback}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center shadow-lg shadow-[#00F2FE]/30 hover:scale-110 active:scale-95 transition flex-shrink-0"
              >
                {isShowcaseTrackPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Row (from Image 2) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            Next-Gen Audio Technology
          </h2>
          <p className="text-xs text-white/50">
            Powered by modern web codecs, headless YouTube core, and Android native audio engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`p-6 rounded-3xl bg-[#0f111e] border border-white/10 transition-all duration-300 ${feat.border} hover:bg-white/[0.04] group shadow-xl`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Icon className={`w-6 h-6 ${feat.accent}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What's New & Release Highlights (Image 2) */}
      <section className="p-8 rounded-3xl bg-[#0f111e] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 text-xs font-mono font-bold">
            v1.0.4 UPDATE
          </span>
          <h3 className="text-xl font-black text-white mt-2">Party Mode 2.0 is Here!</h3>
          <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-lg">
            Experience music with synchronized bass haptics, neon beat visualizer spectrums, and zero-latency streaming.
          </p>
        </div>

        <button
          onClick={onSwitchToDashboard}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#8B5CF6]/30 hover:scale-105 active:scale-95 transition whitespace-nowrap"
        >
          Open Admin Control Panel
        </button>
      </section>
    </div>
  );
}
