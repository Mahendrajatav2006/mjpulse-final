"use client";

import React, { useState } from "react";
import { X, Megaphone, CheckCircle2 } from "lucide-react";
import { AnnouncementItem } from "../../types/music";

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnnouncementCreated: (item: AnnouncementItem) => void;
}

export default function NewAnnouncementModal({
  isOpen,
  onClose,
  onAnnouncementCreated,
}: NewAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [iconType, setIconType] = useState<"party" | "ai" | "playlist" | "system">("party");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle) return;

    const newAnnouncement: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title,
      subtitle,
      timeAgo: "Just Now",
      iconType,
    };

    onAnnouncementCreated(newAnnouncement);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTitle("");
      setSubtitle("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f111a] border border-white/10 p-6 shadow-2xl shadow-[#FFB300]/15">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFB300] to-[#FF007F] flex items-center justify-center text-black shadow-lg">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Broadcast Announcement</h2>
            <p className="text-xs text-white/50">Send banner alert to all active listeners</p>
          </div>
        </div>

        {success ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-[#FFB300] animate-bounce mb-3" />
            <h3 className="text-base font-bold text-white">Announcement Published!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Announcement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Party Mode is Live! 🔥"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFB300] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Description / Subtitle *</label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Feel the beat with haptic, lights & spatial audio."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFB300] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Category</label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#171926] border border-white/10 text-white focus:border-[#FFB300] focus:outline-none transition text-xs"
              >
                <option value="party">Party & Beats 🔥</option>
                <option value="ai">AI Feature 🧠</option>
                <option value="playlist">Special Playlist 🎵</option>
                <option value="system">System Notification 📢</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFB300] to-[#FF007F] text-black font-bold text-xs shadow-lg shadow-[#FFB300]/25 hover:scale-105 active:scale-95 transition"
              >
                Broadcast Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
