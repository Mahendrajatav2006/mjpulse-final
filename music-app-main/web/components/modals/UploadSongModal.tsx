"use client";

import React, { useState } from "react";
import { X, UploadCloud, Music, CheckCircle2 } from "lucide-react";
import { Track } from "../../types/music";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongUploaded: (track: Track) => void;
}

export default function UploadSongModal({ isOpen, onClose, onSongUploaded }: UploadSongModalProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [videoId, setVideoId] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isHiRes, setIsHiRes] = useState(true);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    const newTrack: Track = {
      id: videoId || "NJAv_7lHUIU",
      title,
      artist,
      album: album || "MJ PULSE Singles",
      thumbnail:
        coverUrl ||
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      duration: 210,
      durationFormatted: "3:30",
      source: "Uploaded / Lossless",
      plays: "1.2K",
    };

    onSongUploaded(newTrack);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTitle("");
      setArtist("");
      setAlbum("");
      setVideoId("");
      setCoverUrl("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f111a] border border-white/10 p-6 shadow-2xl shadow-[#00F2FE]/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] flex items-center justify-center text-black shadow-lg">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Upload New Song</h2>
            <p className="text-xs text-white/50">Add music to the MJ PULSE Master Catalog</p>
          </div>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-[#00F2FE] animate-bounce mb-3" />
            <h3 className="text-base font-bold text-white">Song Added Successfully!</h3>
            <p className="text-xs text-white/50">Stream ready in high-definition</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Song Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Pulse / Kesariya"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F2FE] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Artist *</label>
                <input
                  type="text"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Arijit Singh"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F2FE] focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Album</label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="e.g. Master Edition"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F2FE] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">YouTube Stream ID</label>
                <input
                  type="text"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="e.g. NJAv_7lHUIU"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F2FE] focus:outline-none transition font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F2FE] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="hires"
                checked={isHiRes}
                onChange={(e) => setIsHiRes(e.target.checked)}
                className="rounded accent-[#00F2FE]"
              />
              <label htmlFor="hires" className="text-xs text-white/70 cursor-pointer">
                Enable Lossless 24-bit/96kHz & Spatial Audio Master
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-bold text-xs shadow-lg shadow-[#00F2FE]/25 hover:scale-105 active:scale-95 transition"
              >
                Upload & Stream
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
