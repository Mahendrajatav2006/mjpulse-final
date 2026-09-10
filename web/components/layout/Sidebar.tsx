"use client";

import React from "react";
import {
  Smartphone,
  Music2,
  Sliders,
  Mic2,
  Heart,
  Download,
  Settings,
  Music,
  ExternalLink,
  Headphones,
  Sparkles,
} from "lucide-react";
import { NavTab } from "../../types/music";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAppPreview: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAppPreview,
}: SidebarProps) {
  const navItems = [
    { id: "android", label: "Android Mobile App", icon: Smartphone, badge: "v1.3.0" },
    { id: "music", label: "Stream & Discover", icon: Music2 },
    { id: "equalizer", label: "Studio Equalizer", icon: Sliders },
    { id: "lyrics", label: "Karaoke Lyrics", icon: Mic2 },
    { id: "library", label: "My Library", icon: Heart },
    { id: "download", label: "Download APK", icon: Download, badge: "APK" },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#080912] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onSelectTab("android")}
          >
            {/* Audio Wave Logo */}
            <div className="flex items-center space-x-1">
              <span className="w-1 h-4 bg-[#EC4899] rounded-full animate-pulse" />
              <span className="w-1 h-6 bg-[#8B5CF6] rounded-full" />
              <span className="w-1 h-8 bg-[#00F2FE] rounded-full" />
              <span className="w-1 h-5 bg-[#8B5CF6] rounded-full" />
              <span className="w-1 h-3 bg-[#EC4899] rounded-full" />
            </div>
            <div>
              <span className="font-black tracking-widest text-base text-white">
                MJ PULSE
              </span>
              <span className="block text-[10px] text-pink-400 font-semibold tracking-wider">
                AUDIO ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavTab);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-white/50"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.id === "download"
                        ? "bg-pink-500 text-white animate-pulse"
                        : "bg-purple-500/30 text-purple-300 border border-purple-500/40"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section with App Info */}
        <div className="p-3 border-t border-white/5 space-y-3 bg-[#06070d]">
          {/* App Status Mini Card */}
          <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white text-[11px] block leading-none">
                    MJ PULSE Android
                  </span>
                  <span className="text-[9px] text-pink-400 leading-none font-mono">v1.3.0 Official</span>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Ready
              </span>
            </div>

            <div className="text-[10px] text-white/50 pt-1 border-t border-white/5 space-y-1">
              <div className="flex justify-between">
                <span>Audio Engine:</span>
                <span className="text-white font-medium">32-Bit Lossless</span>
              </div>
              <div className="flex justify-between">
                <span>Equalizer:</span>
                <span className="text-pink-400 font-medium">5-Band Studio DSP</span>
              </div>
            </div>

            {/* Direct Download Button */}
            <a
              href="/api/download"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK v1.3.0</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
