"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  ListPlus,
  Sparkles,
  Megaphone,
  TrendingUp,
  Users,
  PlayCircle,
  Music,
  ListMusic,
  CheckCircle2,
  Headphones,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  Globe,
  Radio,
  BarChart2,
  ChevronDown,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Track, AppUpdateItem, AnnouncementItem } from "../../types/music";

interface OverviewViewProps {
  onOpenUploadSong: () => void;
  onOpenCreatePlaylist: () => void;
  onOpenPushUpdate: () => void;
  onOpenNewAnnouncement: () => void;
  onPlaySong: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  updates: AppUpdateItem[];
  announcements: AnnouncementItem[];
}

export default function OverviewView({
  onOpenUploadSong,
  onOpenCreatePlaylist,
  onOpenPushUpdate,
  onOpenNewAnnouncement,
  onPlaySong,
  currentTrack,
  isPlaying,
  onTogglePlayPause,
  updates,
  announcements,
}: OverviewViewProps) {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [hoveredIndex, setHoveredIndex] = useState<number>(4); // default 1 Sep

  const topSongs: (Track & { playsFormatted: string })[] = [
    {
      id: "q1uPPBJ2tcI",
      title: "Tum Hi Ho",
      artist: "Arijit Singh",
      album: "Aashiqui 2",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
      duration: 262,
      durationFormatted: "4:22",
      playsFormatted: "125.4K",
      source: "YouTube Music",
    },
    {
      id: "NJAv_7lHUIU",
      title: "Kesariya",
      artist: "Arijit Singh",
      album: "Brahmastra",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      duration: 269,
      durationFormatted: "4:29",
      playsFormatted: "98.7K",
      source: "YouTube Music",
    },
    {
      id: "3y-O-4IL-PU",
      title: "Night Drive",
      artist: "MJ PULSE Mix",
      album: "Midnight Vibes",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
      duration: 230,
      durationFormatted: "3:50",
      playsFormatted: "87.2K",
      source: "YouTube Music",
    },
    {
      id: "YALvuUpY_b0",
      title: "Channa Mereya",
      artist: "Arijit Singh",
      album: "Ae Dil Hai Mushkil",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
      duration: 261,
      durationFormatted: "4:21",
      playsFormatted: "76.1K",
      source: "YouTube Music",
    },
    {
      id: "Lq0S1lqEjxo",
      title: "Heer Ranjha",
      artist: "Atif Aslam",
      album: "Soul Strings",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      duration: 213,
      durationFormatted: "3:33",
      playsFormatted: "65.3K",
      source: "YouTube Music",
    },
  ];

  const chartData = [
    { day: "28 Aug", plays: "11.2K", users: "6.1K", downloads: "2.8K" },
    { day: "29 Aug", plays: "12.4K", users: "7.0K", downloads: "3.2K" },
    { day: "30 Aug", plays: "13.8K", users: "7.8K", downloads: "3.6K" },
    { day: "31 Aug", plays: "14.2K", users: "8.1K", downloads: "4.0K" },
    { day: "1 Sep", plays: "15.2K", users: "8.7K", downloads: "4.3K" },
    { day: "2 Sep", plays: "14.5K", users: "8.3K", downloads: "4.1K" },
    { day: "3 Sep", plays: "16.1K", users: "9.2K", downloads: "4.7K" },
    { day: "4 Sep", plays: "17.4K", users: "9.8K", downloads: "5.1K" },
  ];

  return (
    <div className="space-y-5 pb-28">
      {/* 1. TOP HERO CARD & STATUS WIDGET (Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Welcome & Action Buttons Card */}
        <div className="lg:col-span-8 relative rounded-3xl bg-gradient-to-r from-[#101222] via-[#0d0f1c] to-[#170e28] border border-white/10 p-6 sm:p-7 overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-[#00F2FE]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-md">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Welcome back, Mahendra! <span className="text-2xl animate-bounce">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/50">
                Manage your music world. Update. Push. Inspire.
              </p>

              {/* 4 Action Buttons from Mockup */}
              <div className="flex flex-wrap items-center gap-2.5 pt-5">
                <button
                  onClick={onOpenUploadSong}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 text-white" />
                  <span>Upload Song</span>
                </button>

                <button
                  onClick={onOpenCreatePlaylist}
                  className="py-2.5 px-3.5 rounded-xl bg-[#161828] hover:bg-[#1f2237] border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition active:scale-95"
                >
                  <ListPlus className="w-4 h-4 text-white/70" />
                  <span>Create Playlist</span>
                </button>

                <button
                  onClick={onOpenPushUpdate}
                  className="py-2.5 px-3.5 rounded-xl bg-[#1d1533] hover:bg-[#281b47] border border-[#7C3AED]/40 text-[#c4b5fd] font-semibold text-xs flex items-center gap-2 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                  <span>Push Update</span>
                </button>

                <button
                  onClick={onOpenNewAnnouncement}
                  className="py-2.5 px-3.5 rounded-xl bg-[#161828] hover:bg-[#1f2237] border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition active:scale-95"
                >
                  <Megaphone className="w-4 h-4 text-white/70" />
                  <span>New Announcement</span>
                </button>
              </div>
            </div>

            {/* 3D Glowing Music Emblem Graphic (from Image 3 Center) */}
            <div className="relative flex-shrink-0 flex items-center justify-center self-center md:self-auto">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Concentric Neon Pedestal Rings */}
                <div className="absolute inset-0 rounded-full border border-[#7C3AED]/40 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full border-2 border-[#00F2FE]/30" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#7C3AED]/30 via-transparent to-[#00F2FE]/30 blur-md" />

                {/* Center MJ Note Rounded Box */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#00F2FE] p-[2px] shadow-2xl shadow-[#8B5CF6]/50">
                  <div className="w-full h-full rounded-2xl bg-[#0e101c] flex flex-col items-center justify-center">
                    <Music className="w-7 h-7 text-[#00F2FE]" />
                    <span className="text-[9px] font-black text-white/80 tracking-widest uppercase">
                      MJ
                    </span>
                  </div>
                </div>

                {/* Floating notes */}
                <span className="absolute -top-1 right-2 text-xs text-[#00F2FE] animate-pulse">♪</span>
                <span className="absolute bottom-1 -left-2 text-sm text-[#FF007F] animate-bounce">♫</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Status Card (Image 3 Right) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0f111e] border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/50 tracking-wider">App Status</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">MJ PULSE <span className="text-xs font-normal text-white/40">v1.0.4</span></h3>
              <p className="text-[11px] text-white/40">Latest Version</p>
              <div className="pt-2 text-[11px] text-white/50 space-y-0.5">
                <p>Last Updated: <span className="text-white/80">2 hours ago</span></p>
                <p>Build: <span className="text-white/80 font-mono">2026.09.04</span></p>
              </div>
            </div>

            {/* Glowing 3D Checkmark Pedestal Visual */}
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-[#6366F1]/50 animate-pulse" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#00F2FE] p-[2px] shadow-lg shadow-[#6366F1]/40">
                <div className="w-full h-full rounded-full bg-[#0a0c16] flex items-center justify-center">
                  <Check className="w-7 h-7 text-[#00F2FE] stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Core Audio Engine</span>
            <span className="text-[#00F2FE] font-mono">100% Stable</span>
          </div>
        </div>
      </div>

      {/* 2. 5 METRICS CARDS ROW (Image 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="text-xs text-white/60 font-medium">Total Users</span>
            <span className="text-emerald-400 font-bold text-[10px]">↑ 12.4%</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">12,842</div>
          <p className="text-[10px] text-white/40 mt-0.5">vs last 7 days</p>
          {/* Cyan SVG Spline */}
          <div className="mt-2 h-7 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 25 28, 50 15 T 100 5"
                fill="none"
                stroke="#00F2FE"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Total Plays */}
        <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="text-xs text-white/60 font-medium">Total Plays</span>
            <span className="text-emerald-400 font-bold text-[10px]">↑ 18.7%</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">1.25M</div>
          <p className="text-[10px] text-white/40 mt-0.5">vs last 7 days</p>
          {/* Purple SVG Spline */}
          <div className="mt-2 h-7 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M 0 22 Q 25 26, 50 18 T 100 3"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="text-xs text-white/60 font-medium">Active Users</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold">
              • Live
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">326</div>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6] ring-1 ring-[#0f111e]" />
              <div className="w-4 h-4 rounded-full bg-[#EC4899] ring-1 ring-[#0f111e]" />
              <div className="w-4 h-4 rounded-full bg-[#8B5CF6] ring-1 ring-[#0f111e]" />
            </div>
            <span className="text-[10px] text-white/40">+122 online</span>
          </div>
        </div>

        {/* Total Songs */}
        <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="text-xs text-white/60 font-medium">Total Songs</span>
            <Music className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">8,752</div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">+ Newly Added</p>
        </div>

        {/* Total Playlists */}
        <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-lg relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="text-xs text-white/60 font-medium">Total Playlists</span>
            <ListMusic className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,248</div>
          <p className="text-[10px] text-[#A855F7] font-semibold mt-1">+ 34 New</p>
        </div>
      </div>

      {/* 3. MIDDLE ROW (Top Played Songs + User Activity Spline + Quick Update Push) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Top Played Songs (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Top Played Songs</h3>
              <span className="text-xs text-white/40 hover:text-white cursor-pointer">View All</span>
            </div>

            <div className="space-y-2.5">
              {topSongs.map((song, idx) => {
                const isThisPlaying = currentTrack?.id === song.id && isPlaying;
                const isSelected = currentTrack?.id === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      if (isSelected) {
                        onTogglePlayPause();
                      } else {
                        onPlaySong(song);
                      }
                    }}
                    className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition border ${
                      isSelected
                        ? "bg-[#00F2FE]/10 border-[#00F2FE]/40"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="text-xs font-mono font-bold text-white/30 w-3 text-center">
                        {idx + 1}
                      </span>
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${
                            isThisPlaying ? "opacity-100" : "opacity-0 hover:opacity-100"
                          }`}
                        >
                          {isThisPlaying ? (
                            <Pause className="w-4 h-4 text-[#00F2FE] fill-current" />
                          ) : (
                            <Play className="w-4 h-4 text-[#00F2FE] fill-current ml-0.5" />
                          )}
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-[#00F2FE]" : "text-white"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-[10px] text-white/40 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-xs font-mono font-bold text-white/80">
                        {song.playsFormatted}
                      </span>
                      <div className="w-14 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div
                          style={{ width: `${100 - idx * 14}%` }}
                          className="h-full bg-[#EC4899] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[10px] text-white/40 flex items-center justify-between">
            <span>Play count updated live</span>
            <span className="text-emerald-400 font-mono">Sync active</span>
          </div>
        </div>

        {/* Center: User Activity (Last 7 Days) (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-white">
                  User Activity <span className="text-xs font-normal text-white/40">(Last 7 Days)</span>
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] focus:outline-none"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Legend (Plays, Users, Downloads) */}
            <div className="flex items-center space-x-4 text-[11px] text-white/60 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
                Plays
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F2FE]"></span>
                Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                Downloads
              </span>
            </div>

            {/* Spline Chart SVG */}
            <div className="relative h-44 w-full mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                {/* Horizontal guide lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" />

                {/* Left Y-axis text */}
                <text x="5" y="24" fill="rgba(255,255,255,0.3)" fontSize="9">20K</text>
                <text x="5" y="64" fill="rgba(255,255,255,0.3)" fontSize="9">15K</text>
                <text x="5" y="104" fill="rgba(255,255,255,0.3)" fontSize="9">10K</text>
                <text x="5" y="144" fill="rgba(255,255,255,0.3)" fontSize="9">5K</text>

                {/* Plays curve (Pink) */}
                <path
                  d="M 40 120 Q 110 90, 180 75 T 320 35 T 440 60 T 490 40"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="2.5"
                />

                {/* Users curve (Cyan) */}
                <path
                  d="M 40 135 Q 110 115, 180 95 T 320 65 T 440 85 T 490 60"
                  fill="none"
                  stroke="#00F2FE"
                  strokeWidth="2.5"
                />

                {/* Downloads curve (Purple) */}
                <path
                  d="M 40 145 Q 110 130, 180 120 T 320 95 T 440 110 T 490 90"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Clickable/Hoverable Points */}
                {[
                  { cx: 40, cy: 120 },
                  { cx: 105, cy: 95 },
                  { cx: 175, cy: 75 },
                  { cx: 245, cy: 55 },
                  { cx: 320, cy: 35 },
                  { cx: 385, cy: 50 },
                  { cx: 440, cy: 60 },
                  { cx: 490, cy: 40 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredIndex === i ? 6 : 4}
                    fill={hoveredIndex === i ? "#EC4899" : "#0f111e"}
                    stroke="#EC4899"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                ))}
              </svg>

              {/* Tooltip on Active Point (1 Sep by default like mockup) */}
              {hoveredIndex !== null && (
                <div
                  style={{ left: `${(hoveredIndex / 7) * 75 + 10}%` }}
                  className="absolute top-2 -translate-x-1/2 px-2.5 py-1.5 rounded-xl bg-[#17192a] border border-white/20 text-[10px] text-white shadow-2xl z-10 pointer-events-none"
                >
                  <span className="font-bold text-[#00F2FE] block mb-0.5">
                    {chartData[hoveredIndex].day}
                  </span>
                  <div className="space-y-0.5 text-white/80 font-mono">
                    <p className="flex justify-between gap-2">
                      <span className="text-[#EC4899]">• Plays:</span>
                      <span>{chartData[hoveredIndex].plays}</span>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span className="text-[#00F2FE]">• Users:</span>
                      <span>{chartData[hoveredIndex].users}</span>
                    </p>
                    <p className="flex justify-between gap-2">
                      <span className="text-[#8B5CF6]">• Downloads:</span>
                      <span>{chartData[hoveredIndex].downloads}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* X-axis days */}
            <div className="flex justify-between text-[10px] text-white/40 mt-3 font-mono">
              {chartData.map((d, i) => (
                <span
                  key={d.day}
                  onClick={() => setHoveredIndex(i)}
                  className={`cursor-pointer hover:text-white ${
                    hoveredIndex === i ? "text-[#EC4899] font-bold" : ""
                  }`}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Peak Day: 4 Sep (+17.4K Plays)</span>
            <span className="text-[#00F2FE]">Weekly Growth ↑ 28%</span>
          </div>
        </div>

        {/* Right: Quick Update Push (3 cols) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Quick Update Push</h3>
              <span className="text-xs text-white/40 hover:text-white cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              {updates.slice(0, 3).map((up) => (
                <div
                  key={up.id}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{up.version}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-semibold">
                      {up.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white/80 line-clamp-1">{up.title}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenPushUpdate}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#6366F1] text-white font-bold text-xs shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>+ Create New Update</span>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM ROW (Announcements + Device Donut + Feature Usage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Announcements (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Recent Announcements</h3>
              <span className="text-xs text-white/40 hover:text-white cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] flex-shrink-0 mt-0.5">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{ann.title}</p>
                    </div>
                    <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{ann.subtitle}</p>
                    <span className="text-[9px] text-white/30 font-mono mt-1 block">
                      {ann.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenNewAnnouncement}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>+ New Broadcast Alert</span>
          </button>
        </div>

        {/* Center: Device & Platform Stats (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Device & Platform Stats</h3>
            <p className="text-[11px] text-white/40 mb-3">Listener Distribution</p>

            <div className="flex items-center justify-center gap-6 py-2">
              {/* Donut SVG */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1c1f33" strokeWidth="16" />
                  {/* Android 68% (Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="16"
                    strokeDasharray="171 251"
                  />
                  {/* iOS 24% (Cyan) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#00F2FE"
                    strokeWidth="16"
                    strokeDasharray="60 251"
                    strokeDashoffset="-171"
                  />
                  {/* Web 6% (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="16"
                    strokeDasharray="15 251"
                    strokeDashoffset="-231"
                  />
                  {/* Other 2% (Pink) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="16"
                    strokeDasharray="5 251"
                    strokeDashoffset="-246"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs text-white/40">Total</span>
                  <span className="text-sm font-bold text-white font-mono">12.8K</span>
                  <span className="text-[9px] text-white/40">Users</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                  <span className="text-white/70">Android</span>
                  <span className="font-bold text-white font-mono">68%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]"></span>
                  <span className="text-white/70">iOS</span>
                  <span className="font-bold text-white font-mono">24%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className="text-white/70">Web</span>
                  <span className="font-bold text-white font-mono">6%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></span>
                  <span className="text-white/70">Other</span>
                  <span className="font-bold text-white font-mono">2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-center text-[11px] text-white/40">
            Native Jetpack Compose Android Engine + Next.js Web
          </div>
        </div>

        {/* Right: Feature Usage & 3D Headphones Graphic (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0f111e] border border-white/10 p-5 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="flex-1 space-y-3 pr-2">
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Feature Usage</h3>
              <p className="text-[11px] text-white/40">Most Active Modules</p>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: "Music Player", percent: 92 },
                { name: "Party Mode", percent: 68 },
                { name: "Haptic Sync", percent: 54 },
                { name: "Visualizer", percent: 71 },
                { name: "AI DJ", percent: 38 },
              ].map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/70">{feat.name}</span>
                    <span className="text-white font-mono font-bold">{feat.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${feat.percent}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glowing Headphones Graphic on Right (matching Image 3) */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/20 blur-xl animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00F2FE] p-[2px] shadow-lg shadow-[#8B5CF6]/30">
              <div className="w-full h-full rounded-full bg-[#0a0c16] flex items-center justify-center">
                <Headphones className="w-8 h-8 text-[#00F2FE]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
