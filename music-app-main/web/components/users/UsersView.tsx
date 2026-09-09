"use client";

import React, { useState } from "react";
import { Users, Smartphone, Globe, Radio, Shield } from "lucide-react";

export default function UsersView() {
  const [searchTerm, setSearchTerm] = useState("");

  const usersList = [
    { id: 1, name: "Aarav Sharma", email: "aarav@pulse.io", platform: "Android", status: "Listening", song: "Kesariya" },
    { id: 2, name: "Priya Patel", email: "priya@pulse.io", platform: "iOS", status: "Listening", song: "Night Drive" },
    { id: 3, name: "Rohan Gupta", email: "rohan@pulse.io", platform: "Android", status: "Listening", song: "Tum Hi Ho" },
    { id: 4, name: "Sneha Reddy", email: "sneha@pulse.io", platform: "Web", status: "Idle", song: "Born to Shine" },
    { id: 5, name: "Vikram Singh", email: "vikram@pulse.io", platform: "Android", status: "Listening", song: "Starboy" },
    { id: 6, name: "Ananya Iyer", email: "ananya@pulse.io", platform: "iOS", status: "Listening", song: "Channa Mereya" },
  ];

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.song.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00F2FE]" />
            <span>Active Listeners & User Directory</span>
          </h2>
          <p className="text-xs text-white/50">Real-time presence across Android, iOS and Web clients</p>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter listeners..."
          className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#00F2FE]"
        />
      </div>

      <div className="rounded-3xl bg-[#0f111e] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-white/40 font-mono">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Status</th>
                <th className="p-4">Now Playing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] flex items-center justify-center text-black font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-white/40">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-white/80 font-mono text-[11px]">
                      {user.platform === "Web" ? (
                        <Globe className="w-3.5 h-3.5 text-[#FFB300]" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-[#00F2FE]" />
                      )}
                      {user.platform}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === "Listening"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Listening" ? "bg-emerald-400 animate-ping" : "bg-white/40"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-white/80 font-medium">{user.song}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Synchronizing session with ${user.name}`)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-[#00F2FE]/20 hover:text-[#00F2FE] text-white/70 transition"
                    >
                      Sync Stream
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
