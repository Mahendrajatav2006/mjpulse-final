"use client";

import React from "react";
import { Megaphone, Plus, Bell, CheckCircle } from "lucide-react";
import { AnnouncementItem } from "../../types/music";

interface AnnouncementsViewProps {
  announcements: AnnouncementItem[];
  onOpenNewAnnouncement: () => void;
}

export default function AnnouncementsView({
  announcements,
  onOpenNewAnnouncement,
}: AnnouncementsViewProps) {
  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#FFB300]" />
            <span>Broadcasts & In-App Announcements</span>
          </h2>
          <p className="text-xs text-white/50">Push alerts, live listening events, and banner broadcasts</p>
        </div>

        <button
          onClick={onOpenNewAnnouncement}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFB300] to-[#FF007F] text-black font-bold text-xs shadow-lg shadow-[#FFB300]/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-3xl bg-[#0f111e] border border-white/10 hover:border-white/20 transition flex items-start space-x-4 shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFB300]/10 border border-[#FFB300]/20 flex items-center justify-center text-[#FFB300] flex-shrink-0 mt-0.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white truncate">{ann.title}</h3>
                <span className="text-[10px] text-white/40 font-mono flex-shrink-0 ml-2">
                  {ann.timeAgo}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{ann.subtitle}</p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Broadcast Active
                </span>
                <button
                  onClick={() => alert(`Re-broadcasting: ${ann.title}`)}
                  className="text-[#00F2FE] hover:underline"
                >
                  Send Push Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
