"use client";

import React, { useState } from "react";
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Sliders,
  Radio,
  Music2,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Zap,
} from "lucide-react";

export default function DownloadHubView() {
  const [copied, setCopied] = useState(false);
  const downloadUrl = "https://github.com/Mahendrajatav2006/music-app/releases/latest/download/MJPulse-Music.apk";

  const copyUrl = () => {
    navigator.clipboard?.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-950 to-pink-950/50 border border-purple-500/30 p-8 md:p-12 backdrop-blur-xl shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Official Android Release v1.3.0
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Download <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">MJ PULSE</span> for Android
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Experience dynamic genre streaming, studio 5-band equalizer, bass exciter, synced karaoke lyrics, and low-latency audio playback directly on your Android phone.
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                📦 Version 1.3.0 (Build 3)
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                ⚡ ~18.4 MB
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                📱 Android 8.0 to 15 (API 24-36)
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Keystore Signed
              </span>
            </div>
          </div>

          {/* Primary CTA Button Block */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href="/api/download"
              download="MJPulse-Music.apk"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-pink-500/25 transition-all duration-200 transform hover:scale-102 active:scale-98"
            >
              <Download className="w-5 h-5 animate-bounce" />
              Download APK (v1.3.0)
            </a>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={copyUrl}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-2 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Link Copied!" : "Copy Direct Link"}
              </button>

              <a
                href="https://github.com/Mahendrajatav2006/music-app/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-2 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                All Releases
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Release Notes & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" />
                What&apos;s New in Version 1.3.0
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Released September 2026 • Optimized for seamless listening
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
              Latest
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dynamic Genre Streaming</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant real-time station filtering for Synthwave, EDM, Lo-Fi Chill, Punjabi Pop, and Bollywood hits with zero playback stalling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Studio 5-Band Equalizer & Bass Exciter</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Custom frequency curve shaping with 6 audiophile acoustic presets and sub-bass haptic boost.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Music2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dual-Pane Synced Karaoke Lyrics</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time glowing text highlighting that follows song progression with automated smooth center scrolling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Consistent Keystore Signature</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Maintains signing keys across builds so existing users can update over older APKs without uninstalling or losing saved offline songs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <FileCode className="w-4 h-4 text-purple-400" />
            Build Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Package ID</span>
              <span className="font-mono text-slate-200">com.aistudio.mjpulse.audiomx</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Version Name</span>
              <span className="font-mono text-pink-400 font-bold">1.3.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Version Code</span>
              <span className="font-mono text-purple-400 font-bold">3</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Min Android</span>
              <span className="text-slate-200">Android 8.0 (API 24)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Target Android</span>
              <span className="text-slate-200">Android 15 (API 36)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Permissions</span>
              <span className="text-slate-200">Audio, Internet, Vibrate</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Pricing</span>
              <span className="text-emerald-400 font-bold">100% Free / No Ads</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Installation Guide */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-purple-400" />
          How to Install on Android
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Download APK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tap the download button above to save <span className="text-white font-mono">MJPulse-Music.apk</span> to your Android phone.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Allow Unknown Sources</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When prompted by Android or Chrome, tap &quot;Settings&quot; and toggle &quot;Allow from this source&quot; to permit direct APK installation.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Open & Enjoy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Launch MJ PULSE, turn on Party Mode or Equalizer, and stream your favorite tracks in high-fidelity sound.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
