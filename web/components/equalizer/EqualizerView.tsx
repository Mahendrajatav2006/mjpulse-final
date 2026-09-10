"use client";

import React, { useState } from "react";
import { Sliders, Volume2, Sparkles, Activity, Zap, RotateCcw } from "lucide-react";
import { Track } from "../../types/music";

interface EqualizerViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
}

interface Band {
  freq: string;
  label: string;
  value: number; // -12dB to +12dB
}

const PRESETS: Record<string, number[]> = {
  "Studio Flat": [0, 0, 0, 0, 0],
  "Bass Explosion": [9, 6, 1, 3, 5],
  "EDM Pulse": [8, 5, -1, 4, 7],
  "Vocal Clarity": [-2, 1, 6, 5, 2],
  "Synthwave Dream": [7, 3, 2, 6, 8],
  "Acoustic Live": [2, 4, 3, 2, 4],
};

export default function EqualizerView({ currentTrack, isPlaying }: EqualizerViewProps) {
  const [bands, setBands] = useState<Band[]>([
    { freq: "60 Hz", label: "Sub Bass", value: 4 },
    { freq: "230 Hz", label: "Bass Punch", value: 3 },
    { freq: "910 Hz", label: "Mids", value: 0 },
    { freq: "3.6 kHz", label: "Highs", value: 3 },
    { freq: "14 kHz", label: "Air Sparkle", value: 5 },
  ]);

  const [bassBoost, setBassBoost] = useState<number>(65); // 0 to 100%
  const [activePreset, setActivePreset] = useState<string>("Synthwave Dream");
  const [partyMode, setPartyMode] = useState<boolean>(true);

  const handleBandChange = (index: number, val: number) => {
    setBands((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: val };
      return updated;
    });
    setActivePreset("Custom");
  };

  const applyPreset = (presetName: string) => {
    const values = PRESETS[presetName];
    if (!values) return;
    setBands((prev) =>
      prev.map((b, idx) => ({
        ...b,
        value: values[idx],
      }))
    );
    setActivePreset(presetName);
  };

  const resetFlat = () => {
    applyPreset("Studio Flat");
    setBassBoost(0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/40 border border-purple-500/20 p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse text-pink-400" />
              MJ PULSE 32-Bit Studio DSP Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
              5-Band Studio Equalizer & Bass Boost
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Fine-tune frequency soundstage, enhance low-end sub-harmonics, and synchronize real-time Party Mode haptic pulses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetFlat}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Flat
            </button>
            <button
              onClick={() => setPartyMode(!partyMode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                partyMode
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                  : "bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${partyMode ? "animate-bounce text-yellow-300" : ""}`} />
              Party Mode {partyMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Live Audio Spectrum Bars */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-end justify-between gap-1 h-20 px-2">
          {Array.from({ length: 32 }).map((_, i) => {
            const heightMultiplier = isPlaying ? Math.sin((i / 32) * Math.PI) * 0.7 + 0.3 : 0.15;
            const randomizedHeight = isPlaying
              ? Math.max(15, Math.min(100, (heightMultiplier + (i % 3) * 0.15) * 100))
              : 12;
            return (
              <div
                key={i}
                className={`w-full rounded-t-sm transition-all duration-150 ${
                  partyMode
                    ? "bg-gradient-to-t from-pink-500 via-purple-500 to-cyan-400"
                    : "bg-gradient-to-t from-purple-800 to-purple-400"
                }`}
                style={{
                  height: `${randomizedHeight}%`,
                  opacity: isPlaying ? 0.9 : 0.25,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Acoustic Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.keys(PRESETS).map((pName) => {
            const isSelected = activePreset === pName;
            return (
              <button
                key={pName}
                onClick={() => applyPreset(pName)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30 border border-purple-400/40"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                }`}
              >
                {pName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5-Band Slider Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equalizer Sliders */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Graphic Equalizer (+12dB to -12dB)
            </h3>
            <span className="text-xs text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30 font-medium">
              Preset: {activePreset}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-6 pt-4 pb-2">
            {bands.map((band, idx) => (
              <div key={band.freq} className="flex flex-col items-center space-y-3">
                {/* dB Value Badge */}
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    band.value > 0
                      ? "text-pink-300 bg-pink-500/20"
                      : band.value < 0
                      ? "text-cyan-300 bg-cyan-500/20"
                      : "text-slate-400 bg-white/5"
                  }`}
                >
                  {band.value > 0 ? `+${band.value}` : band.value} dB
                </span>

                {/* Vertical Slider Track */}
                <div className="relative h-48 flex items-center justify-center">
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={band.value}
                    onChange={(e) => handleBandChange(idx, parseInt(e.target.value))}
                    className="w-44 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer -rotate-90 accent-purple-500 hover:accent-pink-500 transition"
                  />
                </div>

                {/* Frequency & Label */}
                <div className="text-center">
                  <p className="text-xs font-black text-white">{band.freq}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[65px]">{band.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bass Boost & Sound Stage Controls */}
        <div className="space-y-6">
          {/* Sub-Bass Booster */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-pink-400" />
                Sub-Bass Exciter
              </h3>
              <span className="text-xs font-bold text-pink-400 font-mono">{bassBoost}%</span>
            </div>

            <p className="text-xs text-slate-400">
              Low-frequency harmonic synthesis designed for punchy headphones and subwoofers.
            </p>

            <input
              type="range"
              min={0}
              max={100}
              value={bassBoost}
              onChange={(e) => setBassBoost(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Clean</span>
              <span>Punchy</span>
              <span className="text-pink-400 font-bold">Earthquake</span>
            </div>
          </div>

          {/* Currently Playing Feedback */}
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/60 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">
              Active Audio Output
            </p>
            {currentTrack ? (
              <div className="flex items-center gap-3">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                  <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-4 bg-pink-500 rounded-full animate-pulse" />
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No track playing right now. Select a song from Stream or Android simulator to hear live EQ curves.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
