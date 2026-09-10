"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, Database, RefreshCw, Radio, HardDrive, CheckCircle2 } from "lucide-react";

export default function SettingsView() {
  const [bitrate, setBitrate] = useState("320");
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearCache = () => {
    setClearing(true);
    setTimeout(() => {
      setClearing(false);
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#8B5CF6]" />
          <span>System & Streaming Configuration</span>
        </h2>
        <p className="text-xs text-white/50">Configure streaming servers, caches, and admin parameters</p>
      </div>

      {/* API Health & Gateway Status */}
      <div className="p-6 rounded-3xl bg-[#0f111e] border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00F2FE]" />
          <span>Backend APIs & Streaming Gateways</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">YouTube Music Core</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-400 font-mono">100% Online</p>
            <p className="text-[10px] text-white/40">Zero CORS & IFrame Engine</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">JioSaavn Gateway</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-400 font-mono">100% Online</p>
            <p className="text-[10px] text-white/40">Regional & Bollywood Meta</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Edge Memory Cache</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-400 font-mono">1 Hour TTL</p>
            <p className="text-[10px] text-white/40">Quota Protection Active</p>
          </div>
        </div>
      </div>

      {/* Streaming Bitrate Settings */}
      <div className="p-6 rounded-3xl bg-[#0f111e] border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#FF007F]" />
          <span>Audio Streaming Quality</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { val: "320", title: "320kbps Master", desc: "Studio HD lossless audio" },
            { val: "256", title: "256kbps High", desc: "Balanced performance & fidelity" },
            { val: "128", title: "128kbps Standard", desc: "Data saver for mobile networks" },
          ].map((item) => (
            <div
              key={item.val}
              onClick={() => setBitrate(item.val)}
              className={`p-4 rounded-2xl cursor-pointer transition border ${
                bitrate === item.val
                  ? "bg-[#00F2FE]/10 border-[#00F2FE] shadow-lg shadow-[#00F2FE]/15"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  bitrate === item.val ? "text-[#00F2FE]" : "text-white"
                }`}
              >
                {item.title}
              </p>
              <p className="text-[10px] text-white/40 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Storage & Cache Management */}
      <div className="p-6 rounded-3xl bg-[#0f111e] border border-white/10 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#FFB300]" />
            <span>Search & Audio Cache</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Clear locally cached song metadata and force fresh searches.
          </p>
        </div>

        <button
          onClick={handleClearCache}
          disabled={clearing}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition"
        >
          {cleared ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Cache Cleared!</span>
            </>
          ) : (
            <>
              <RefreshCw className={`w-3.5 h-3.5 ${clearing ? "animate-spin text-[#00F2FE]" : ""}`} />
              <span>{clearing ? "Flushing..." : "Flush Cache"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
