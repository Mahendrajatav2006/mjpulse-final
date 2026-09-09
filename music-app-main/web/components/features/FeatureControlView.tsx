"use client";

import React, { useState } from "react";
import { Sliders, Volume2, Radio, Flame, Brain, Music, Eye } from "lucide-react";

export default function FeatureControlView() {
  const [features, setFeatures] = useState([
    {
      id: "party_mode",
      name: "Party Mode (Haptic Pulse)",
      desc: "Synchronizes device bass vibration and strobe screen flash with music rhythm.",
      enabled: true,
      icon: Flame,
      color: "text-[#FF007F]",
    },
    {
      id: "spatial_audio",
      name: "Spatial Audio 360°",
      desc: "Virtual 3D binaural surround sound processing for headphones.",
      enabled: true,
      icon: Radio,
      color: "text-[#00F2FE]",
    },
    {
      id: "hires_lossless",
      name: "Hi-Res Master 320kbps / FLAC",
      desc: "Delivers studio master streaming bitrate without audio compression.",
      enabled: true,
      icon: Volume2,
      color: "text-emerald-400",
    },
    {
      id: "visualizer_spectrum",
      name: "Neon Audio Visualizer Spectrum",
      desc: "Real-time canvas audio frequency bars dancing on the bottom player.",
      enabled: true,
      icon: Eye,
      color: "text-[#8B5CF6]",
    },
    {
      id: "ai_recommendations",
      name: "AI Smart DJ & Vibe Matcher",
      desc: "Machine learning engine analyzing track acoustics to suggest seamless next songs.",
      enabled: true,
      icon: Brain,
      color: "text-[#FFB300]",
    },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#00F2FE]" />
          <span>Feature Flag & Engine Control</span>
        </h2>
        <p className="text-xs text-white/50">
          Enable or disable core audio engine capabilities dynamically in real time
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="p-6 rounded-3xl bg-[#0f111e] border border-white/10 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {feat.name}
                    {feat.enabled ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-[10px] font-bold">
                        DISABLED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 max-w-xl">{feat.desc}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleFeature(feat.id)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
                  feat.enabled ? "bg-[#00F2FE]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-black shadow-md transform transition-transform duration-300 ${
                    feat.enabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
