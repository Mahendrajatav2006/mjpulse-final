"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { AppUpdateItem } from "../../types/music";

interface PushUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePushed: (update: AppUpdateItem) => void;
}

export default function PushUpdateModal({
  isOpen,
  onClose,
  onUpdatePushed,
}: PushUpdateModalProps) {
  const [version, setVersion] = useState("v1.0.5");
  const [title, setTitle] = useState("");
  const [highlights, setHighlights] = useState("");
  const [status, setStatus] = useState<"Published" | "Staging">("Published");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newUpdate: AppUpdateItem = {
      id: `up-${Date.now()}`,
      version: version || "v1.0.5",
      title,
      date: "Just Now",
      status,
      description: "Pushed by Admin Mahendra via MJ PULSE Control Center.",
      highlights: highlights
        ? highlights.split("\n").filter((h) => h.trim())
        : ["New streaming optimizations", "Bug fixes & stability improvements"],
    };

    onUpdatePushed(newUpdate);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTitle("");
      setHighlights("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f111a] border border-white/10 p-6 shadow-2xl shadow-[#8B5CF6]/15">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#00F2FE] flex items-center justify-center text-black shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Push App Update</h2>
            <p className="text-xs text-white/50">Deploy new features & OTA patch to Android, iOS, & Web</p>
          </div>
        </div>

        {success ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-[#8B5CF6] animate-bounce mb-3" />
            <h3 className="text-base font-bold text-white">Update Pushed Live!</h3>
            <p className="text-xs text-white/50">{version} is now broadcasting to all clients</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Version Tag</label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.5"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#8B5CF6] focus:outline-none transition font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Deployment Channel</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#171926] border border-white/10 text-white focus:border-[#8B5CF6] focus:outline-none transition text-xs"
                >
                  <option value="Published">Production (Published)</option>
                  <option value="Staging">Staging Test</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Release Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spatial Audio 2.0 & Haptic Sync"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#8B5CF6] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Changelog Highlights (1 per line)
              </label>
              <textarea
                rows={3}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder={"- High-fidelity 320kbps audio engine\n- Added Neon Visualizer spectrum\n- Fixed Bluetooth headphone latency"}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#8B5CF6] focus:outline-none transition resize-none font-sans text-xs"
              />
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#8B5CF6]/25 hover:scale-105 active:scale-95 transition"
              >
                Push Release
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
