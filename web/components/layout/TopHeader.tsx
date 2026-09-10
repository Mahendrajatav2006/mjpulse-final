"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Mail,
  Moon,
  Sun,
  X,
  Compass,
  LayoutDashboard,
  Download,
  Smartphone,
  Settings,
  History,
  Trash2,
} from "lucide-react";
import { NavTab } from "../../types/music";

interface TopHeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  onGlobalSearch: (query: string) => void;
}

export default function TopHeader({
  activeTab,
  onSelectTab,
  onOpenMobileMenu,
  onGlobalSearch,
}: TopHeaderProps) {
  const [searchInput, setSearchInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Search History from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mj_pulse_search_history");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return ["Arijit Singh", "Diljit Dosanjh", "Kesariya", "Starboy", "Lo-Fi Beats"];
  });

  const saveQuery = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("mj_pulse_search_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      saveQuery(searchInput.trim());
      onGlobalSearch(searchInput.trim());
      setShowHistoryDropdown(false);
    }
  };

  const handleSelectHistory = (term: string) => {
    setSearchInput(term);
    saveQuery(term);
    onGlobalSearch(term);
    setShowHistoryDropdown(false);
  };

  const handleRemoveHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("mj_pulse_search_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("mj_pulse_search_history");
      } catch {}
    }
  };

  const notifications = [
    { id: 1, title: "MJ PULSE v1.3.0 Ready", desc: "Dynamic genre streaming & 5-band EQ released", time: "Just now" },
    { id: 2, title: "Lossless Audio Engine", desc: "Connected to high-bitrate streaming pipeline", time: "Active" },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080911]/95 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu + Search Bar */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white lg:hidden transition"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onFocus={() => setShowHistoryDropdown(true)}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search songs, artists, genres, lyrics..."
              className="w-full pl-10 pr-14 py-2 rounded-xl bg-[#111322] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#6366F1] focus:outline-none transition shadow-inner"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/40 font-mono pointer-events-none">
                ⌘ /
              </span>
            )}
          </form>

          {/* Search History Dropdown */}
          {showHistoryDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowHistoryDropdown(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0d0f1c] border border-white/10 rounded-2xl p-3 shadow-2xl z-50 space-y-2 max-w-lg">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#00F2FE]" />
                    <span>Search History</span>
                    {recentSearches.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/50 font-mono">
                        {recentSearches.length}
                      </span>
                    )}
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] text-white/40 hover:text-red-400 font-medium transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {recentSearches.length === 0 ? (
                  <div className="py-3 text-center text-xs text-white/30">
                    No recent searches
                  </div>
                ) : (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleSelectHistory(term)}
                        className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] text-xs text-white/80 hover:text-white cursor-pointer group transition"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <History className="w-3.5 h-3.5 text-[#00F2FE]/70 group-hover:text-[#00F2FE] flex-shrink-0" />
                          <span className="truncate">{term}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveHistory(term, e)}
                          className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-white/10 transition cursor-pointer"
                          title="Remove item"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 ml-4">
        {/* Quick Nav Switcher */}
        <div className="flex items-center bg-white/5 border border-white/10 p-0.5 rounded-xl text-xs">
          <button
            onClick={() => onSelectTab("android")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "android"
                ? "bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-black shadow-lg shadow-[#00F2FE]/25"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App</span>
          </button>
          <button
            onClick={() => onSelectTab("music")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "music"
                ? "bg-purple-600 text-white font-bold shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>Stream</span>
          </button>
          <button
            onClick={() => onSelectTab("equalizer")}
            className={`hidden md:flex px-2.5 sm:px-3 py-1 rounded-lg transition items-center gap-1.5 ${
              activeTab === "equalizer"
                ? "bg-pink-600 text-white font-bold shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>Equalizer</span>
          </button>
        </div>

        {/* Direct APK Download Button */}
        <a
          href="/api/download"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition shadow-sm shadow-pink-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download APK</span>
          <span className="sm:hidden text-[11px]">APK</span>
        </a>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f111e] border border-white/15 p-3 shadow-2xl z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                <span className="text-xs font-bold text-white">System Status</span>
                <span className="text-[10px] text-pink-400 font-mono">Online</span>
              </div>
              <div className="space-y-2 pt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/5 transition"
                  >
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-[10px] text-white/50">{n.desc}</p>
                    <span className="text-[9px] text-pink-400 font-mono mt-1 block">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Moon Icon */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition hidden sm:flex"
          aria-label="Toggle Theme"
        >
          {isDark ? <Moon className="w-4 h-4 text-white/70" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Profile Badge */}
        <div
          onClick={() => onSelectTab("settings")}
          className="flex items-center space-x-2 pl-1 cursor-pointer group"
          title="Open Settings"
          role="button"
          tabIndex={0}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] p-0.5 group-hover:scale-105 transition shadow">
            <div className="w-full h-full rounded-full bg-[#111322] flex items-center justify-center text-white font-bold text-xs">
              MJ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
