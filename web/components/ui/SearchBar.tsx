"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-4 sm:mx-8 relative">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#00F2FE] absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/5 border border-white/10 focus:border-[#00F2FE] focus:bg-white/[0.08] focus:outline-none text-sm text-white placeholder-white/40 transition-all duration-300 shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 text-white/40 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
