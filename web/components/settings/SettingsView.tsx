"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Shield,
  Trash2,
  Download,
  Info,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Volume2,
} from "lucide-react";

export default function SettingsView() {
  const [audioQuality, setAudioQuality] = useState("lossless");
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [gaplessPlayback, setGaplessPlayback] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    try {
      localStorage.removeItem("mj_pulse_listen_history");
      localStorage.removeItem("mj_pulse_search_history");
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    } catch {}
  };

  return (
    <div id="settings-view-container" className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wide text-white">
            App & Audio Settings
          </h1>
          <p className="text-xs text-white/50">
            Configure streaming engine, equalizer preferences, and system parameters
          </p>
        </div>
      </div>

      {/* Audio Engine Quality */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-pink-400">
          <Volume2 className="w-4 h-4" />
          <h2 className="text-sm font-bold text-white">Streaming Audio Quality</h2>
        </div>
        <p className="text-xs text-white/50">
          Select streaming bitrate for lossless playback. Web & Android engines auto-adapt to connection speed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: "lossless", label: "Studio Lossless (32-Bit)", desc: "FLAC / 320 kbps high bitrate", badge: "Recommended" },
            { id: "high", label: "High Definition", desc: "AAC / 256 kbps crisp audio", badge: "Balanced" },
            { id: "data-saver", label: "Data Saver", desc: "Opus / 128 kbps low bandwidth", badge: "Save 60%" },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setAudioQuality(item.id)}
              className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                audioQuality === item.id
                  ? "bg-pink-500/15 border-pink-500/50 shadow-md shadow-pink-500/10"
                  : "bg-white/[0.02] border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Playback & DSP Hardware Toggles */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-purple-400">
          <Sliders className="w-4 h-4" />
          <h2 className="text-sm font-bold text-white">DSP & Sound Enhancement</h2>
        </div>
        <div className="space-y-3 divide-y divide-white/5 text-xs">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-semibold text-white">Hardware Audio Acceleration</p>
              <p className="text-[11px] text-white/40">Uses device DAC and WebAudio API for low-latency filtering</p>
            </div>
            <button
              onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                hardwareAcceleration ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-white/10"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  hardwareAcceleration ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-white">Gapless Crossfade</p>
              <p className="text-[11px] text-white/40">Smooth transitions between consecutive tracks</p>
            </div>
            <button
              onClick={() => setGaplessPlayback(!gaplessPlayback)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                gaplessPlayback ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-white/10"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  gaplessPlayback ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Storage & Privacy */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Shield className="w-4 h-4" />
          <h2 className="text-sm font-bold text-white">Storage & Cache Management</h2>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-white">Clear Playback & Search Cache</p>
            <p className="text-[11px] text-white/40">
              Clears local history and temporary audio buffer. Liked songs remain safe.
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{cacheCleared ? "Cleared!" : "Clear Cache"}</span>
          </button>
        </div>
      </div>

      {/* App Version & Build Metadata */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">MJ PULSE Mobile & Web</h3>
              <p className="text-xs text-white/50">Developed by Mahendra Jatav • Official Release</p>
            </div>
          </div>
          <a
            href="/api/download"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK v1.3.0</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-white/40 block">App Version</span>
            <span className="text-white font-bold">1.3.0 (Build 3)</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-white/40 block">Android Target</span>
            <span className="text-emerald-400 font-bold">SDK 36 / Android 16</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-white/40 block">Audio Engine</span>
            <span className="text-pink-400 font-bold">32-Bit DSP Pipeline</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-white/40 block">Status</span>
            <span className="text-cyan-400 font-bold">Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
