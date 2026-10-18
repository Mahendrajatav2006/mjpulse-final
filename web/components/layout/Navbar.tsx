"use client";

import React from "react";
import { Radio, Sparkles } from "lucide-react";
import SearchBar from "../ui/SearchBar";

interface NavbarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function Navbar({ onSearch, isLoading }: NavbarProps) {
  return (
    <header className="px-6 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-[#080911]/80 sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSearch("Top Hits Trending")}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] flex items-center justify-center shadow-lg shadow-[#00F2FE]/20">
          <Radio className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-[#00F2FE] via-white to-[#FF007F] bg-clip-text text-transparent">
            MJ PULSE
          </h1>
          <p className="text-[11px] text-white/50 tracking-wide">High Fidelity Music Engine</p>
        </div>
      </div>

      {/* Center Search */}
      <SearchBar onSearch={onSearch} isLoading={isLoading} />

      {/* Right Action / Status */}
      <div className="hidden sm:flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
          <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse"></span>
          <span>Lossless Stream</span>
        </div>
      </div>
    </header>
  );
}
