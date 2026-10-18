"use client";

import React from "react";
import {
  LayoutDashboard,
  Music2,
  ListMusic,
  Users,
  Sparkles,
  Layers,
  Megaphone,
  BarChart3,
  Bell,
  Sliders,
  FileText,
  Settings,
  HelpCircle,
  ExternalLink,
  Radio,
  Headphones,
  Music,
  Download,
  Smartphone,
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
    { id: "android", label: "Android App (Mobile)", icon: Smartphone, badge: "Mobile" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "music", label: "Music Library", icon: Music2 },
    { id: "playlists", label: "Playlists", icon: ListMusic },
    { id: "users", label: "Users", icon: Users },
    { id: "updates", label: "Updates", icon: Sparkles, badge: "New" },
    { id: "content", label: "App Content", icon: Layers },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "push", label: "Push Notifications", icon: Bell },
    { id: "features", label: "Feature Control", icon: Sliders },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "support", label: "Support", icon: HelpCircle },
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
            onClick={() => onSelectTab("dashboard")}
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
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (activeTab === "showcase" && item.id === "content");

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "content") {
                    onSelectTab("showcase");
                  } else if (
                    item.id === "push" ||
                    item.id === "reports" ||
                    item.id === "support"
                  ) {
                    onSelectTab("settings");
                  } else {
                    onSelectTab(item.id as NavTab);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/30"
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
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EC4899] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section with Status Widget & 3D Headphones Graphic (Image 3) */}
        <div className="p-3 border-t border-white/5 space-y-3 bg-[#06070d]">
          {/* App Status Mini Card */}
          <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white text-[11px] block leading-none">
                    MJ PULSE
                  </span>
                  <span className="text-[9px] text-white/40 leading-none">v1.0.4</span>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40 pt-1 border-t border-white/5 font-mono">
              <div>
                Total Users: <span className="text-white font-bold block">12,842</span>
              </div>
              <div>
                Active Now: <span className="text-[#00F2FE] font-bold block">326</span>
              </div>
            </div>

            {/* View App Preview Button */}
            <button
              onClick={onOpenAppPreview}
              className="w-full mt-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
            >
              <span>View App Preview</span>
              <ExternalLink className="w-3 h-3 text-white/50" />
            </button>

            {/* Download APK Link */}
            <a
              href="/api/download"
              className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#00F2FE]/20 to-[#FF007F]/20 hover:from-[#00F2FE]/30 hover:to-[#FF007F]/30 border border-[#00F2FE]/40 text-[#00F2FE] hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3 h-3 text-[#00F2FE]" />
              <span>Download Android APK</span>
            </a>
          </div>

          {/* Glowing 3D Headphones on Pedestal (Image 3 bottom-left) */}
          <div className="pt-1 flex items-center justify-center">
            <div className="relative w-28 h-24 flex flex-col items-center justify-center">
              {/* Neon Pedestal Ring */}
              <div className="absolute bottom-1 w-20 h-4 rounded-full border border-[#00F2FE]/50 bg-gradient-to-r from-[#00F2FE]/20 via-[#8B5CF6]/30 to-[#EC4899]/20 blur-sm" />
              <div className="absolute bottom-2 w-16 h-3 rounded-full bg-[#00F2FE]/30" />

              {/* Glowing Headphones */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00F2FE] p-[2px] shadow-lg shadow-[#00F2FE]/30">
                <div className="w-full h-full rounded-full bg-[#0a0c16] flex items-center justify-center">
                  <Headphones className="w-7 h-7 text-[#00F2FE]" />
                </div>
              </div>

              {/* Musical notes */}
              <span className="absolute top-2 left-2 text-[10px] text-[#EC4899] animate-pulse">♪</span>
              <span className="absolute top-1 right-2 text-[11px] text-[#00F2FE] animate-bounce">♫</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
