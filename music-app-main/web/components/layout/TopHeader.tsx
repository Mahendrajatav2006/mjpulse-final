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
  const [isDark, setIsDark] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onGlobalSearch(searchInput.trim());
    }
  };

  const notifications = [
    { id: 1, title: "Party Mode 2.0 Live", desc: "Broadcasted to 12.8K listeners", time: "10m ago" },
    { id: 2, title: "High Concurrent Streamers", desc: "Active users reached 326", time: "1h ago" },
    { id: 3, title: "New Song Added", desc: "Kesariya Sufi Soul indexed", time: "2h ago" },
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

        {/* Global Search Bar (Image 3) */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search songs, users, playlists, updates..."
            className="w-full pl-10 pr-14 py-2 rounded-xl bg-[#111322] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#6366F1] focus:outline-none transition shadow-inner"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/40 font-mono pointer-events-none">
              ⌘ /
            </span>
          )}
        </form>
      </div>

      {/* Right Icons: Notification (8), Mail (2), Moon, User Profile (Image 3) */}
      <div className="flex items-center space-x-3 sm:space-x-4 ml-4">
        {/* Toggle Mode: Dashboard vs Showcase */}
        <div className="hidden sm:flex items-center bg-white/5 border border-white/10 p-0.5 rounded-xl text-xs">
          <button
            onClick={() => onSelectTab("dashboard")}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab !== "showcase"
                ? "bg-[#6366F1] text-white font-bold shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onSelectTab("showcase")}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "showcase"
                ? "bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-bold shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Showcase</span>
          </button>
        </div>

        {/* Notifications Icon with Red '8' Badge (Image 3) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
              8
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f111e] border border-white/15 p-3 shadow-2xl z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-[#00F2FE] cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 pt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/5 transition cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-[10px] text-white/50">{n.desc}</p>
                    <span className="text-[9px] text-[#00F2FE] font-mono mt-1 block">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mail Icon with Red '2' Badge (Image 3) */}
        <button
          onClick={() => onSelectTab("announcements")}
          className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition hidden sm:flex"
          aria-label="Messages"
        >
          <Mail className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        {/* Dark Mode Moon Icon (Image 3) */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition hidden sm:flex"
          aria-label="Toggle Theme"
        >
          {isDark ? <Moon className="w-4 h-4 text-white/70" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Profile Badge (MJ Mahendra Admin - Image 3) */}
        <div
          onClick={() => onSelectTab("settings")}
          className="flex items-center space-x-2.5 pl-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs shadow">
            MJ
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-none">Mahendra</p>
            <p className="text-[10px] text-white/40 leading-none mt-1">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
