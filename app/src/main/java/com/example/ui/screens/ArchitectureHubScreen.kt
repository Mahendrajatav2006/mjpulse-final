package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Dataset
import androidx.compose.material.icons.filled.IntegrationInstructions
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.GlassCard
import com.example.ui.components.NeonBadge
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.NeonPink
import com.example.ui.theme.NeonViolet
import com.example.ui.theme.PulseBackground
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

@Composable
fun ArchitectureHubScreen(
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf("YT IFRAME ENGINE") }
    val tabs = listOf("YT IFRAME ENGINE", "STRUCTURE", "FIRESTORE", "NEXT.JS CODE", "FLUTTER", "SECURITY")

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Top Banner
        item {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.AccountTree,
                    contentDescription = null,
                    tint = NeonCyan,
                    modifier = Modifier.size(22.dp)
                )
                Text(
                    text = "MJ PULSE Architecture Hub",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Text(
                text = "Full-stack system blueprint: Next.js + Flutter + Firebase + Music API",
                fontSize = 12.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp, bottom = 10.dp)
            )
        }

        // Horizontal Category Tabs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                tabs.forEach { tab ->
                    val isSelected = selectedTab == tab
                    GlassCard(
                        shape = RoundedCornerShape(16.dp),
                        borderColor = if (isSelected) NeonCyan else Color(0x22FFFFFF),
                        backgroundColor = if (isSelected) NeonCyan.copy(alpha = 0.2f) else Color(0x11151A2E),
                        onClick = { selectedTab = tab },
                        modifier = Modifier.testTag("arch_tab_$tab")
                    ) {
                        Text(
                            text = tab,
                            color = if (isSelected) NeonCyan else TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                        )
                    }
                }
            }
        }

        // Dynamic Tab Content
        when (selectedTab) {
            "YT IFRAME ENGINE" -> {
                item {
                    ArchitectureCard(
                        title = "YouTube IFrame Audio Engine & Search API",
                        badge = "OFFICIAL GOOGLE API",
                        badgeColor = NeonCyan,
                        content = """
// 1. Backend: app/api/search/route.ts
// Uses Google's official YouTube Data API v3 (videoCategoryId=10 for Music)
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${'$'}{encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=15&key=${'$'}{process.env.YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.high?.url
  })));
}

// 2. Frontend: components/WebPlayer.tsx
// Loads official YouTube IFrame Player API (window.YT)
// The <iframe> container is styled:
// className="w-0 h-0 opacity-0 pointer-events-none absolute -top-[9999px]"
// Control playback seamlessly with:
// player.loadVideoById(track.id);
// player.playVideo(); player.pauseVideo(); player.seekTo(seconds);
                        """.trimIndent()
                    )
                }
            }
            "STRUCTURE" -> {
                item {
                    ArchitectureCard(
                        title = "Multi-Platform Repository Structure",
                        badge = "MONOREPO READY",
                        badgeColor = NeonCyan,
                        content = """
mj-pulse-ecosystem/
├── apps/
│   ├── web/                     # Next.js 14 (App Router)
│   │   ├── app/
│   │   │   ├── (public)/        # Landing, Hero, Features, Support
│   │   │   ├── (player)/        # Persistent Web Player routes
│   │   │   │   ├── search/
│   │   │   │   ├── library/
│   │   │   │   └── party/[id]/  # Realtime Sync Party Room
│   │   │   ├── layout.tsx       # Root layout holding <PersistentPlayer />
│   │   │   └── providers.tsx    # AudioProvider & FirebaseAuthProvider
│   │   ├── components/
│   │   │   ├── audio/           # Glassmorphism Player & Visualizer
│   │   │   └── 3d/              # Floating 3D Three.js canvas assets
│   │   └── lib/api/             # Jamendo & Open Music APIs
│   │
│   ├── mobile/                  # Flutter 3.x Cross-Platform App
│   │   ├── lib/
│   │   │   ├── core/audio/      # just_audio + audio_service + spatial HRTF
│   │   │   ├── features/
│   │   │   │   ├── party_mode/  # Haptic beat sync & visualizer
│   │   │   │   ├── dj_deck/     # Dual deck crossfader & BPM lock
│   │   │   │   └── ai_search/   # Mood/tempo DNA filters
│   │   │   └── main.dart
│   │
│   └── admin/                   # Next.js Admin Dashboard
│       └── app/admin/           # Remote Config, Song Meta, Live Rooms
│
└── backend/
    ├── firestore.rules          # Granular Role-Based Access Control
    └── functions/               # Firebase Cloud Functions (Gen 2)
                        """.trimIndent()
                    )
                }
            }
            "FIRESTORE" -> {
                item {
                    ArchitectureCard(
                        title = "Firestore Database Schema",
                        badge = "NOSQL SCHEMA",
                        badgeColor = NeonGreen,
                        content = """
// 1. users Collection
users/{userId}
  ├─ uid: string (Firebase Auth UID)
  ├─ displayName: string
  ├─ photoUrl: string
  ├─ musicDna: { bassEnergy: 0.88, valence: 0.72, preferredBpm: 128 }
  ├─ role: "user" | "artist" | "admin"
  └─ library: { favoriteSongIds: string[], recentSearches: string[] }

// 2. songs Collection (Cached Third-Party & Catalog)
songs/{songId}
  ├─ externalId: string (e.g., Jamendo Track ID)
  ├─ source: "jamendo" | "free_music_archive"
  ├─ title: string
  ├─ artist: string
  ├─ streamUrl: string (direct audio stream, no local hosting)
  ├─ coverArtUrl: string
  ├─ bpm: number
  ├─ codec: "FLAC" | "AAC_320"
  └─ stats: { playCount: number, partyPlays: number }

// 3. rooms Collection (Sync Party & DJ Mode)
rooms/{roomId}
  ├─ hostId: string
  ├─ currentSongId: string
  ├─ playbackPositionMs: number
  ├─ isPlaying: boolean
  ├─ bpm: number
  ├─ crossfaderPos: number (0.0 to 1.0)
  ├─ participants: string[] (User UIDs)
  └─ updatedAt: timestamp (Server timestamp for sub-100ms sync)
                        """.trimIndent()
                    )
                }
            }
            "NEXT.JS CODE" -> {
                item {
                    ArchitectureCard(
                        title = "Persistent Glassmorphism Audio Player",
                        badge = "NEXT.JS 14 (APP ROUTER)",
                        badgeColor = NeonPink,
                        content = """
// components/audio/GlassPlayer.tsx
"use client";
import React from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Pause, SkipForward, SkipBack, Zap } from "lucide-react";

export function GlassAudioPlayer() {
  const { currentTrack, isPlaying, progress, togglePlay, seek } = useAudio();
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50">
      <div className="backdrop-blur-xl bg-[#0e111f]/70 border border-cyan-400/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] rounded-2xl p-4 flex items-center justify-between">
        {/* Track Artwork & Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <img src={currentTrack.coverUrl} alt={currentTrack.title} className="object-cover w-full h-full" />
          </div>
          <div>
            <h4 className="font-bold text-white tracking-wide text-sm">{currentTrack.title}</h4>
            <p className="text-xs text-slate-400">{currentTrack.artist} • {currentTrack.bpm} BPM</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md px-6">
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-cyan-400"><SkipBack size={20} /></button>
            <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black flex items-center justify-center font-bold">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="text-slate-400 hover:text-cyan-400"><SkipForward size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
                        """.trimIndent()
                    )
                }
            }
            "FLUTTER" -> {
                item {
                    ArchitectureCard(
                        title = "Flutter Smart Audio & Haptic Beat Sync",
                        badge = "FLUTTER AUDIO ENGINE",
                        badgeColor = NeonCyan,
                        content = """
// lib/core/audio/audio_manager.dart
import 'package:just_audio/just_audio.dart';
import 'package:vibration/vibration.dart';

class PulseAudioEngine {
  final AudioPlayer _player = AudioPlayer();

  Future<void> streamTrack(String streamUrl, int bpm) async {
    await _player.setUrl(streamUrl);
    _player.play();
    _startBeatSyncHaptics(bpm);
  }

  void _startBeatSyncHaptics(int bpm) {
    final intervalMs = (60000 / bpm).round();
    _player.positionStream.listen((pos) {
      if (pos.inMilliseconds % intervalMs < 40) {
        Vibration.vibrate(duration: 25, amplitude: 180);
      }
    });
  }
}
                        """.trimIndent()
                    )
                }
            }
            "SECURITY" -> {
                item {
                    ArchitectureCard(
                        title = "Firestore Security & Role-Based Rules",
                        badge = "RULES V2",
                        badgeColor = NeonViolet,
                        content = """
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/${'$'}(database)/documents/users/${'$'}(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if request.auth.uid == userId || isAdmin();
    }

    match /songs/{songId} {
      allow read: if true; // Public catalogue
      allow write: if isAdmin();
    }

    match /rooms/{roomId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        request.auth.uid == resource.data.hostId ||
        request.auth.uid in resource.data.participants
      );
    }
  }
}
                        """.trimIndent()
                    )
                }
            }
        }
    }
}

@Composable
fun ArchitectureCard(
    title: String,
    badge: String,
    badgeColor: Color,
    content: String
) {
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        borderColor = badgeColor.copy(alpha = 0.4f),
        glowColor = badgeColor
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                NeonBadge(text = badge, color = badgeColor)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(Color(0xFF070912))
                    .padding(12.dp)
            ) {
                Text(
                    text = content,
                    color = Color(0xFFC7D2FE),
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.sp,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
