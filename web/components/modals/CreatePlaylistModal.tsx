"use client";

import React, { useState } from "react";
import { X, ListPlus, CheckCircle2 } from "lucide-react";
import { PlaylistItem } from "../../types/music";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: PlaylistItem) => void;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onPlaylistCreated,
}: CreatePlaylistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newPlaylist: PlaylistItem = {
      id: `pl-${Date.now()}`,
      title,
      description: description || "Curated in MJ PULSE",
      songCount: 0,
      coverUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      isPrivate,
    };

    onPlaylistCreated(newPlaylist);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTitle("");
      setDescription("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f111a] border border-white/10 p-6 shadow-2xl shadow-[#FF007F]/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF007F] to-[#00F2FE] flex items-center justify-center text-black shadow-lg">
            <ListPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create New Playlist</h2>
            <p className="text-xs text-white/50">Curate tracks for yourself and the community</p>
          </div>
        </div>

        {success ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-[#FF007F] animate-bounce mb-3" />
            <h3 className="text-base font-bold text-white">Playlist Created!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Playlist Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Drive Vibes"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF007F] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your vibe or mood..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF007F] focus:outline-none transition resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="priv"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded accent-[#FF007F]"
              />
              <label htmlFor="priv" className="text-xs text-white/70 cursor-pointer">
                Keep this playlist private
              </label>
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-[#FF007F]/25 hover:scale-105 active:scale-95 transition"
              >
                Create Playlist
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
