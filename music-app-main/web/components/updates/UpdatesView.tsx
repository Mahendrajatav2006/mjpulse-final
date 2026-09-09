"use client";

import React from "react";
import { Sparkles, Plus, CheckCircle2, Clock } from "lucide-react";
import { AppUpdateItem } from "../../types/music";

interface UpdatesViewProps {
  updates: AppUpdateItem[];
  onOpenPushUpdate: () => void;
}

export default function UpdatesView({ updates, onOpenPushUpdate }: UpdatesViewProps) {
  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            <span>App Release & Update History</span>
          </h2>
          <p className="text-xs text-white/50">OTA and store version management for Android, iOS & Web</p>
        </div>

        <button
          onClick={onOpenPushUpdate}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Update</span>
        </button>
      </div>

      <div className="space-y-4">
        {updates.map((up) => (
          <div
            key={up.id}
            className="p-6 rounded-3xl bg-[#0f111e] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#00F2FE] px-2.5 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30">
                  {up.version}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                  {up.status}
                </span>
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {up.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{up.title}</h3>
              <p className="text-xs text-white/60 max-w-2xl">{up.description}</p>

              {up.highlights && up.highlights.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {up.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-white/80 border border-white/5 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#00F2FE]" />
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => alert(`Broadcasting ${up.version} push notification to all devices`)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
              >
                Send OTA Ping
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
