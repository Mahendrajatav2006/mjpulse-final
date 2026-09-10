"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home,
  Search,
  Zap,
  Sliders,
  History,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Heart,
  ChevronDown,
  Volume2,
  Radio,
  Sparkles,
  Download,
  Flame,
  Layers,
  Code2,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Music,
  Disc3,
  Waves,
  X,
  Check,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Trash2,
  Cpu,
  Flashlight,
  FlashlightOff,
  SunMedium,
  Maximize2,
  Minimize2,
  ListMusic,
  Plus,
  ChevronRight,
  Mic2,
  ListPlus,
} from "lucide-react";
import { Track, PlaylistItem } from "../../types/music";

interface AndroidSimulatorViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlaySong: (track: Track) => void;
  onTogglePlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeekTo: (seconds: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  tracks: Track[];
}

type AndroidScreen = "home" | "player" | "party" | "search" | "history" | "arch" | "settings";

// Low-latency Web Audio SFX synthesizer for DJ pads in Party Mode
function playDjSfx(type: "airhorn" | "laser" | "scratch" | "kick") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "airhorn") {
      [0, 0.1, 0.22].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(466.16, now + delay);
        osc.frequency.setValueAtTime(440, now + delay + 0.08);
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.11);
      });
    } else if (type === "laser") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1900, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.28);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (type === "scratch") {
      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.18);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === "kick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  } catch (e) {
    console.debug("SFX error:", e);
  }
}

const DEFAULT_TRENDING_TRACKS: Track[] = [
  {
    id: "qcEf8GY8",
    title: "Apna Bana Le",
    artist: "Arijit Singh, Sachin-Jigar",
    album: "Bhediya",
    thumbnail: "https://c.saavncdn.com/675/Trending-Love-Songs-Hindi-2026-20260506185328-500x500.jpg",
    streamUrl: "https://aac.saavncdn.com/675/1456dc2903d0fb4465d2d2904008803b_320.mp4",
    duration: 261,
    durationFormatted: "4:21",
    source: "MJ PULSE Cloud",
  },
  {
    id: "kesariya-01",
    title: "Kesariya",
    artist: "Arijit Singh, Pritam",
    album: "Brahmastra",
    thumbnail: "https://c.saavncdn.com/871/Brahmastra-Hindi-2022-20220717092837-500x500.jpg",
    streamUrl: "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
    duration: 268,
    durationFormatted: "4:28",
    source: "MJ PULSE Cloud",
  },
  {
    id: "vxARvIBX",
    title: "Heeriye",
    artist: "Jasleen Royal, Arijit Singh",
    album: "Heeriye",
    thumbnail: "https://c.saavncdn.com/416/Heeriye-Hindi-2026-20260529210207-500x500.jpg",
    streamUrl: "https://aac.saavncdn.com/416/008f026c4b4d75a95f3dec4acac93a20_320.mp4",
    duration: 233,
    durationFormatted: "3:53",
    source: "MJ PULSE Cloud",
  },
  {
    id: "chaleya-03",
    title: "Chaleya",
    artist: "Anirudh Ravichander, Arijit Singh",
    album: "Jawan",
    thumbnail: "https://c.saavncdn.com/026/Chaleya-From-Jawan-Hindi-2023-20230814014339-500x500.jpg",
    streamUrl: "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
    duration: 200,
    durationFormatted: "3:20",
    source: "MJ PULSE Cloud",
  },
];

// Curated high-fidelity instant presets for Home Screen genres
const GENRE_PRESET_TRACKS: Record<string, Track[]> = {
  "Synthwave": [
    {
      id: "kVFlWssi",
      title: "Valam (Synthwave)",
      artist: "Sachin-Jigar, Arijit Singh, VDJ Fly",
      album: "Valam (Synthwave)",
      thumbnail: "https://c.saavncdn.com/744/Valam-Synthwave-Hindi-2026-20260504164253-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/744/e4f6ff918f430c4da4356b7d0270b561_320.mp4",
      duration: 175,
      durationFormatted: "2:55",
      source: "MJ PULSE Cloud",
    },
    {
      id: "HFoKa01Z",
      title: "Main Agar (Synthwave)",
      artist: "VDJ Fly, Atif Aslam",
      album: "Main Agar (Synthwave)",
      thumbnail: "https://c.saavncdn.com/135/Main-Agar-Synthwave-Hindi-2026-20260611191259-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/135/2dcbada330d79de0448addd2e4cb42af_320.mp4",
      duration: 258,
      durationFormatted: "4:18",
      source: "MJ PULSE Cloud",
    },
    {
      id: "iZDrqjl_",
      title: "Synthwave Instrumental",
      artist: "Railhan Studios",
      album: "Synthwave",
      thumbnail: "https://c.saavncdn.com/070/Synthwave-Instrumental-2025-20250128131014-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/070/52aa59ffdd526a2650d79d5e057da8c0_320.mp4",
      duration: 239,
      durationFormatted: "3:59",
      source: "MJ PULSE Cloud",
    },
    {
      id: "synth-04",
      title: "Midnight Drive & Retro",
      artist: "Kavinsky & The Midnight",
      album: "Endless Summer",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
      streamUrl: "https://aac.saavncdn.com/675/1456dc2903d0fb4465d2d2904008803b_320.mp4",
      duration: 242,
      durationFormatted: "4:02",
      source: "MJ PULSE Cloud",
    },
  ],
  "EDM": [
    {
      id: "7KiLHIrj",
      title: "Porkanda Singam EDM Version",
      artist: "Anirudh Ravichander, Vishnu Edavan",
      album: "Vikram (Original Score)",
      thumbnail: "https://c.saavncdn.com/381/Vikram-Original-Background-Score-Tamil-2022-20220707163303-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/381/0a72c30e8c368ec7cac407b732691027_320.mp4",
      duration: 149,
      durationFormatted: "2:29",
      source: "MJ PULSE Cloud",
    },
    {
      id: "30uUaHb-",
      title: "Kaalam EDM Song",
      artist: "Alisha Thomas, Yunohoo, Yuvan Shankar Raja",
      album: "Nerkonda Paarvai",
      thumbnail: "https://c.saavncdn.com/785/Nerkonda-Paarvai-Tamil-2019-20190911115217-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/181/32c4179fd3a7342ac3f231facb693129_320.mp4",
      duration: 218,
      durationFormatted: "3:38",
      source: "MJ PULSE Cloud",
    },
    {
      id: "lE4flSMY",
      title: "Jhalamala EDM x Trance",
      artist: "Mantu Chhuria, Aseema Panda",
      album: "Odia Dj Dance Hits",
      thumbnail: "https://c.saavncdn.com/235/Odia-Dj-Dance-Hits-Oriya-2023-20230927041059-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/235/892b09d03e2cfcd6e1770676d4d7c690_320.mp4",
      duration: 240,
      durationFormatted: "4:00",
      source: "MJ PULSE Cloud",
    },
    {
      id: "edm-04",
      title: "Faded (Festival Drop)",
      artist: "Alan Walker",
      album: "Different World",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      streamUrl: "https://aac.saavncdn.com/416/008f026c4b4d75a95f3dec4acac93a20_320.mp4",
      duration: 212,
      durationFormatted: "3:32",
      source: "MJ PULSE Cloud",
    },
  ],
  "Lo-Fi": [
    {
      id: "bYm3rH-V",
      title: "Teri Ore (Lo-Fi Flip)",
      artist: "VIBIE, Shreya Ghoshal",
      album: "Teri Ore (Lo-Fi Flip)",
      thumbnail: "https://c.saavncdn.com/562/Teri-Ore-Lo-Fi-Flip--Hindi-2021-20211203014335-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/562/15993d00ca31a1ce132940bdf782a07a_320.mp4",
      duration: 243,
      durationFormatted: "4:03",
      source: "MJ PULSE Cloud",
    },
    {
      id: "PaHsQs3A",
      title: "To Chalun (Lo Fi)",
      artist: "Roopkumar Rathod",
      album: "To Chalun (Lo Fi)",
      thumbnail: "https://c.saavncdn.com/533/To-Chalun-Lo-Fi-Hindi-2024-20260420210224-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/533/a9ad493f770e27afadfced4c01c35129_320.mp4",
      duration: 300,
      durationFormatted: "5:00",
      source: "MJ PULSE Cloud",
    },
    {
      id: "lofi-03",
      title: "Kesariya (Midnight Lo-Fi)",
      artist: "Arijit Singh, Pritam",
      album: "Brahmastra Chill",
      thumbnail: "https://c.saavncdn.com/871/Brahmastra-Hindi-2022-20220717092837-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
      duration: 268,
      durationFormatted: "4:28",
      source: "MJ PULSE Cloud",
    },
    {
      id: "lofi-04",
      title: "Chaleya (Cozy Rain Lo-Fi)",
      artist: "Anirudh Ravichander, Arijit Singh",
      album: "Jawan Lo-Fi",
      thumbnail: "https://c.saavncdn.com/026/Chaleya-From-Jawan-Hindi-2023-20230814014339-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/026/Chaleya-From-Jawan-Hindi-2023-20230814014339-500x500.jpg",
      duration: 200,
      durationFormatted: "3:20",
      source: "MJ PULSE Cloud",
    },
  ],
  "Bass Boost": [
    {
      id: "nkNASCK4",
      title: "Raat Ka Nasha (Bass Boosted)",
      artist: "Dikshyant, Anu Malik, K. S. Chithra",
      album: "Bollywood Bass Boosted",
      thumbnail: "https://c.saavncdn.com/655/Bollywood-Bass-Boosted-Hindi-2025-20250326175802-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/655/5f32a77e8c83cac7b643163effc5a7b9_320.mp4",
      duration: 151,
      durationFormatted: "2:31",
      source: "MJ PULSE Cloud",
    },
    {
      id: "FkF5whUR",
      title: "Dupatta Beimaan Re (Bass Boosted)",
      artist: "Dikshyant, Vishal & Shekhar, Sunidhi Chauhan",
      album: "Bollywood Bass Boosted",
      thumbnail: "https://c.saavncdn.com/655/Bollywood-Bass-Boosted-Hindi-2025-20250326175802-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/655/9f9e649d3487c262c99dbc1488bdf839_320.mp4",
      duration: 114,
      durationFormatted: "1:54",
      source: "MJ PULSE Cloud",
    },
    {
      id: "yQWAZjbo",
      title: "Dekho Dekho Jaanam (Bass Boosted)",
      artist: "Dikshyant, Anu Malik, Udit Narayan",
      album: "Bollywood Bass Boosted",
      thumbnail: "https://c.saavncdn.com/655/Bollywood-Bass-Boosted-Hindi-2025-20250326175802-500x500.jpg",
      streamUrl: "https://aac.saavncdn.com/655/5b056b1a9f881f344896a1f1a43b8077_320.mp4",
      duration: 93,
      durationFormatted: "1:33",
      source: "MJ PULSE Cloud",
    },
  ],
  "Punjabi Pop": [
    {
      id: "punjabi-01",
      title: "Lover",
      artist: "Diljit Dosanjh",
      album: "MoonChild Era",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      streamUrl: "https://aac.saavncdn.com/675/1456dc2903d0fb4465d2d2904008803b_320.mp4",
      duration: 195,
      durationFormatted: "3:15",
      source: "MJ PULSE Cloud",
    },
    {
      id: "punjabi-02",
      title: "Proper Patola",
      artist: "Badshah, Diljit Dosanjh",
      album: "Namaste England",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
      streamUrl: "https://aac.saavncdn.com/416/008f026c4b4d75a95f3dec4acac93a20_320.mp4",
      duration: 180,
      durationFormatted: "3:00",
      source: "MJ PULSE Cloud",
    },
  ],
};

export default function AndroidSimulatorView({
  currentTrack,
  isPlaying,
  onPlaySong,
  onTogglePlayPause,
  currentTime,
  duration,
  onSeekTo,
  onNextTrack,
  onPrevTrack,
  tracks,
}: AndroidSimulatorViewProps) {
  const activeTracks = tracks && tracks.length > 0 ? tracks : DEFAULT_TRENDING_TRACKS;
  const activeTrack = currentTrack || activeTracks[0];

  const [currentScreen, setCurrentScreen] = useState<AndroidScreen>("home");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genreTracksCache, setGenreTracksCache] = useState<Record<string, Track[]>>(() => {
    return {
      "All": activeTracks,
      "Trending": activeTracks,
      ...GENRE_PRESET_TRACKS,
    };
  });
  const [isGenreLoading, setIsGenreLoading] = useState(false);

  // Sync activeTracks into "All" and "Trending" whenever activeTracks updates
  useEffect(() => {
    if (activeTracks && activeTracks.length > 0) {
      setGenreTracksCache((prev) => ({
        ...prev,
        "All": activeTracks,
        "Trending": activeTracks,
      }));
    }
  }, [activeTracks]);

  // Handler for clicking genre filter chips
  const handleGenreSelect = async (genre: string) => {
    setSelectedGenre(genre);
    triggerHaptic();

    if (genre === "All" || genre === "Trending") {
      return;
    }

    const queryMap: Record<string, string> = {
      "Synthwave": "Synthwave",
      "EDM": "EDM",
      "Lo-Fi": "Lo-Fi Hindi",
      "Bass Boost": "Bass Boosted Hindi",
      "Punjabi Pop": "Punjabi Pop",
    };

    // If cache already has fetched tracks (more than preset count), don't re-fetch
    if (genreTracksCache[genre] && genreTracksCache[genre].length >= 6) {
      return;
    }

    setIsGenreLoading(true);
    try {
      const q = queryMap[genre] || genre;
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=15`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setGenreTracksCache((prev) => ({
          ...prev,
          [genre]: json.data,
        }));
      }
    } catch (e) {
      console.debug("Genre tracks fetch error:", e);
    } finally {
      setIsGenreLoading(false);
    }
  };

  // Computes active tracks for the currently selected genre
  const currentGenreTracks = useMemo(() => {
    if (selectedGenre === "All" || selectedGenre === "Trending") {
      return activeTracks;
    }
    return genreTracksCache[selectedGenre] || GENRE_PRESET_TRACKS[selectedGenre] || activeTracks;
  }, [selectedGenre, activeTracks, genreTracksCache]);

  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSpatialAudio, setIsSpatialAudio] = useState(true);
  const [isPartyModeActive, setIsPartyModeActive] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);
  
  // Now Playing Sub-Views: "player" (vinyl disc), "lyrics" (karaoke synced lyrics), "queue" (Playback queue), "equalizer" (5-band graphic equalizer)
  const [playerSubView, setPlayerSubView] = useState<"player" | "lyrics" | "queue" | "equalizer">("player");

  // Playback Queue state in Android Now Playing
  const [queueTracks, setQueueTracks] = useState<Track[]>(() => {
    return activeTracks.slice(1, 10);
  });

  // Synced Lyrics state
  type LyricLineItem = {
    timeSec: number;
    text: string;
  };
  const [lyricsList, setLyricsList] = useState<LyricLineItem[]>([]);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [lyricsSynced, setLyricsSynced] = useState(true);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>(activeTracks);
  const [isSearching, setIsSearching] = useState(false);
  const [historyList, setHistoryList] = useState<Track[]>([]);

  // Search History state with localStorage persistence
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mj_pulse_search_history");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return ["Arijit Singh", "Diljit Dosanjh", "Kesariya", "Starboy", "Lo-Fi Beats"];
  });

  const addToSearchHistory = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 10);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("mj_pulse_search_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const removeFromSearchHistory = (termToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("mj_pulse_search_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const clearAllSearchHistory = () => {
    triggerHaptic();
    setSearchHistory([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("mj_pulse_search_history");
      } catch {}
    }
  };

  // Playlists State in Android simulator (My Playlist)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([
    {
      id: "pl_favorites",
      title: "My Favorites",
      description: "Hearted tracks & daily high rotation picks",
      songCount: 6,
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
    },
    {
      id: "pl_party",
      title: "Neon Party & DJ Drops",
      description: "High BPM club heaters, festival drops & heavy kicks",
      songCount: 12,
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
    },
    {
      id: "pl_desi",
      title: "Desi Hip-Hop & Punjabi",
      description: "Top charts: Arijit, Diljit, Badshah & Karan Aujla",
      songCount: 14,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
    },
    {
      id: "pl_lofi",
      title: "Midnight Chill & Lo-Fi",
      description: "Deep focus beats for late night relaxation & code",
      songCount: 8,
      coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500",
    },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistItem | null>(null);
  const [showMyPlaylistSheet, setShowMyPlaylistSheet] = useState(false);
  const [sheetSelectedPlaylist, setSheetSelectedPlaylist] = useState<"downloads" | PlaylistItem | null>(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");

  const handleCreatePlaylist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    triggerHaptic();
    const newPl: PlaylistItem = {
      id: `pl_${Date.now()}`,
      title: newPlaylistTitle.trim(),
      description: newPlaylistDesc.trim() || "User created custom playlist",
      songCount: 1,
      coverUrl: activeTrack?.thumbnail || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
    };
    setPlaylists((prev) => [newPl, ...prev]);
    setNewPlaylistTitle("");
    setNewPlaylistDesc("");
    setShowCreatePlaylistModal(false);
  };

  // Offline Downloaded Tracks in Android app (default populated for My Playlist Downloads)
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<Set<string>>(
    () => new Set(["track_1", "track_2", "track_3"])
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const isCurrentTrackDownloaded = activeTrack ? downloadedTrackIds.has(activeTrack.id) : false;

  const handleToggleDownload = () => {
    if (!activeTrack) return;
    triggerHaptic();
    if (downloadedTrackIds.has(activeTrack.id)) {
      setDownloadedTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(activeTrack.id);
        return next;
      });
      setDownloadToast(`Removed "${activeTrack.title}" from offline downloads`);
      setTimeout(() => setDownloadToast(null), 2500);
    } else {
      setIsDownloading(true);
      setTimeout(() => {
        setDownloadedTrackIds((prev) => new Set(prev).add(activeTrack.id));
        setIsDownloading(false);
        setDownloadToast(`Saved "${activeTrack.title}" offline (320kbps Lossless)`);
        setTimeout(() => setDownloadToast(null), 2500);
      }, 600);
    }
  };

  // DJ Mode state
  const [crossfader, setCrossfader] = useState(50);
  const [deckABpm, setDeckABpm] = useState(128);
  const [deckBBpm, setDeckBBpm] = useState(128);
  const [isDeckAPlaying, setIsDeckAPlaying] = useState(false);
  const [isDeckBPlaying, setIsDeckBPlaying] = useState(false);
  const [deckBTrack, setDeckBTrack] = useState<Track>(() => activeTracks[1] || DEFAULT_TRENDING_TRACKS[1]);
  const [selectingDeck, setSelectingDeck] = useState<"A" | "B" | null>(null);
  const [deckSearchQuery, setDeckSearchQuery] = useState("");
  const [deckSearchResults, setDeckSearchResults] = useState<Track[]>(activeTracks);
  const [isSearchingDeck, setIsSearchingDeck] = useState(false);
  const [deckGenreFilter, setDeckGenreFilter] = useState("All");
  const deckBAudioRef = useRef<HTMLAudioElement | null>(null);

  // Android Settings state
  const [audioBitrate, setAudioBitrate] = useState("320");
  const [equalizerPreset, setEqualizerPreset] = useState("bass");
  const [hapticSyncEnabled, setHapticSyncEnabled] = useState(true);
  const [gaplessPlayback, setGaplessPlayback] = useState(true);
  const [cacheSize, setCacheSize] = useState("248.5 MB");
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheClearedSuccess, setCacheClearedSuccess] = useState(false);

  // Master Studio Equalizer state (5-Band Hardware DSP Simulation)
  const [isEqEnabled, setIsEqEnabled] = useState(true);
  const [eqBands, setEqBands] = useState<number[]>([8, 6, 1, 3, 5]); // [60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz] in dB (-12 to +12)
  const [bassBoostAmount, setBassBoostAmount] = useState(80); // 0-100%
  const [virtualizerAmount, setVirtualizerAmount] = useState(65); // 0-100%
  const [dolbyAtmosEnabled, setDolbyAtmosEnabled] = useState(true);

  // Equalizer Preset Configurations
  const EQ_PRESETS_DATA: Record<
    string,
    { label: string; bands: number[]; bass: number; virtual: number }
  > = {
    bass: { label: "Bass Boost (MJ Special)", bands: [8, 6, 1, 3, 5], bass: 85, virtual: 60 },
    edm: { label: "Club & EDM Punch", bands: [6, 4, -1, 5, 7], bass: 80, virtual: 75 },
    vocal: { label: "Vocal Clarity", bands: [-2, 1, 6, 4, 2], bass: 30, virtual: 50 },
    rock: { label: "Rock Arena", bands: [5, 2, -2, 4, 6], bass: 65, virtual: 70 },
    treble: { label: "Treble & Air", bands: [-3, -1, 2, 7, 9], bass: 20, virtual: 55 },
    flat: { label: "Studio Flat", bands: [0, 0, 0, 0, 0], bass: 0, virtual: 0 },
    custom: { label: "Custom Tuning", bands: [4, 2, 0, 3, 4], bass: 50, virtual: 50 },
  };

  const applyEqualizerPreset = (presetId: string) => {
    setEqualizerPreset(presetId);
    if (EQ_PRESETS_DATA[presetId]) {
      setEqBands([...EQ_PRESETS_DATA[presetId].bands]);
      setBassBoostAmount(EQ_PRESETS_DATA[presetId].bass);
      setVirtualizerAmount(EQ_PRESETS_DATA[presetId].virtual);
    }
  };

  const handleBandChange = (index: number, value: number) => {
    setEqBands((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setEqualizerPreset("custom");
  };

  const handleClearAppCache = () => {
    setIsClearingCache(true);
    setTimeout(() => {
      setIsClearingCache(false);
      setCacheSize("0.0 KB");
      setCacheClearedSuccess(true);
      setTimeout(() => setCacheClearedSuccess(false), 2500);
    }, 800);
  };

  // Sync Deck A playing state with isPlaying
  useEffect(() => {
    setIsDeckAPlaying(isPlaying);
  }, [isPlaying]);

  // Initialize Deck B HTML5 Audio Engine
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    deckBAudioRef.current = audio;

    const onEnded = () => {
      setIsDeckBPlaying(false);
    };
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Update Deck B audio source when deckBTrack changes
  useEffect(() => {
    if (!deckBAudioRef.current || !deckBTrack) return;
    const audio = deckBAudioRef.current;
    if (deckBTrack.streamUrl) {
      audio.src = deckBTrack.streamUrl;
    } else {
      audio.src = `/api/stream?q=${encodeURIComponent(`${deckBTrack.title} ${deckBTrack.artist}`)}`;
    }
    audio.load();
    if (isDeckBPlaying) {
      audio.play().catch(() => {});
    }
  }, [deckBTrack, isDeckBPlaying]);

  // Handle Deck B play / pause state
  useEffect(() => {
    if (!deckBAudioRef.current) return;
    if (isDeckBPlaying) {
      deckBAudioRef.current.play().catch(() => {});
    } else {
      deckBAudioRef.current.pause();
    }
  }, [isDeckBPlaying]);

  // Dynamic crossfader audio volume balance for Deck B
  useEffect(() => {
    if (!deckBAudioRef.current) return;
    deckBAudioRef.current.volume = Math.max(0, Math.min(1, crossfader / 100));
  }, [crossfader]);

  // Search & filter tracks for DJ Deck selector (Deck A & Deck B)
  useEffect(() => {
    if (!deckSearchQuery.trim()) {
      setDeckSearchResults(activeTracks);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingDeck(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(deckSearchQuery)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDeckSearchResults(json.data);
        } else {
          const q = deckSearchQuery.toLowerCase();
          const filtered = activeTracks.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.artist.toLowerCase().includes(q) ||
              (t.album && t.album.toLowerCase().includes(q))
          );
          setDeckSearchResults(filtered);
        }
      } catch (e) {
        console.error("Deck search error:", e);
      } finally {
        setIsSearchingDeck(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [deckSearchQuery, activeTracks]);

  // Party Mode state
  const [strobeActive, setStrobeActive] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState(85);
  const [strobeColor, setStrobeColor] = useState<"cyan" | "pink" | "violet">("cyan");

  // FLASH SCREEN (Screen Strobe) State
  const [flashScreenActive, setFlashScreenActive] = useState(false);
  const [flashScreenColor, setFlashScreenColor] = useState<"white" | "cyan" | "pink" | "lime" | "rainbow">("white");
  const [flashScreenSpeed, setFlashScreenSpeed] = useState<"bpm" | "slow" | "fast" | "hyper">("bpm");
  const [isFullscreenStrobe, setIsFullscreenStrobe] = useState(false);
  const [screenFlashTrigger, setScreenFlashTrigger] = useState(false);
  const [rainbowColorIndex, setRainbowColorIndex] = useState(0);

  // FLASH LIGHT (Camera Torch) State
  const [flashLightActive, setFlashLightActive] = useState(false);
  const [flashLightMode, setFlashLightMode] = useState<"strobe" | "continuous">("strobe");
  const [torchLedTrigger, setTorchLedTrigger] = useState(false);
  const [torchHardwareState, setTorchHardwareState] = useState<"idle" | "active" | "unsupported">("idle");
  const torchTrackRef = useRef<MediaStreamTrack | null>(null);
  const torchStreamRef = useRef<MediaStream | null>(null);

  // Helper for Flash Screen strobe color
  const getStrobeHexColor = () => {
    const rainbowHues = ["#FFFFFF", "#00F2FE", "#FF007F", "#39FF14", "#FFB300", "#8B5CF6"];
    if (flashScreenColor === "white") return "#FFFFFF";
    if (flashScreenColor === "cyan") return "#00F2FE";
    if (flashScreenColor === "pink") return "#FF007F";
    if (flashScreenColor === "lime") return "#39FF14";
    if (flashScreenColor === "rainbow") return rainbowHues[rainbowColorIndex] || "#FFFFFF";
    return "#FFFFFF";
  };

  // Hardware Flashlight activation (Web MediaStreams Torch API)
  const toggleHardwareTorch = async (enable: boolean) => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setTorchHardwareState("unsupported");
      return;
    }

    try {
      if (enable) {
        if (!torchTrackRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          torchStreamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          torchTrackRef.current = track;
        }
        const capabilities = (torchTrackRef.current.getCapabilities?.() || {}) as Record<string, any>;
        if (capabilities.torch) {
          await (torchTrackRef.current as any).applyConstraints({
            advanced: [{ torch: true }],
          });
          setTorchHardwareState("active");
        } else {
          setTorchHardwareState("unsupported");
        }
      } else {
        if (torchTrackRef.current) {
          try {
            await (torchTrackRef.current as any).applyConstraints({
              advanced: [{ torch: false }],
            });
          } catch {}
          torchTrackRef.current.stop();
          torchTrackRef.current = null;
        }
        if (torchStreamRef.current) {
          torchStreamRef.current.getTracks().forEach((t) => t.stop());
          torchStreamRef.current = null;
        }
        setTorchHardwareState("idle");
      }
    } catch (err) {
      console.warn("Torch hardware access:", err);
      setTorchHardwareState("unsupported");
    }
  };

  useEffect(() => {
    if (flashLightActive) {
      toggleHardwareTorch(true);
    } else {
      toggleHardwareTorch(false);
    }
    return () => {
      if (torchTrackRef.current) {
        try {
          (torchTrackRef.current as any).applyConstraints({ advanced: [{ torch: false }] });
        } catch {}
        torchTrackRef.current.stop();
        torchTrackRef.current = null;
      }
    };
  }, [flashLightActive]);

  // Rhythm Strobe pulse interval for Flash Screen & Flash Light
  useEffect(() => {
    if (!flashScreenActive && !flashLightActive && !isFullscreenStrobe) {
      setScreenFlashTrigger(false);
      setTorchLedTrigger(false);
      return;
    }

    let intervalMs = 220;
    if (flashScreenSpeed === "bpm") {
      const bpm = deckABpm || 128;
      intervalMs = Math.max(80, Math.round((60000 / bpm) / 2));
    } else if (flashScreenSpeed === "slow") {
      intervalMs = 450;
    } else if (flashScreenSpeed === "fast") {
      intervalMs = 180;
    } else if (flashScreenSpeed === "hyper") {
      intervalMs = 85;
    }

    const rainbowHues = ["#FFFFFF", "#00F2FE", "#FF007F", "#39FF14", "#FFB300", "#8B5CF6"];

    const timer = setInterval(() => {
      setScreenFlashTrigger((prev) => !prev);
      setTorchLedTrigger((prev) => !prev);
      setRainbowColorIndex((prev) => (prev + 1) % rainbowHues.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [flashScreenActive, flashLightActive, isFullscreenStrobe, flashScreenSpeed, deckABpm]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  // Add played track to history
  useEffect(() => {
    if (currentTrack) {
      setHistoryList((prev) => {
        const filtered = prev.filter((t) => t.id !== currentTrack.id);
        return [currentTrack, ...filtered].slice(0, 15);
      });
    }
  }, [currentTrack]);

  // Sync search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(tracks);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSearchResults(json.data);
        }
      } catch (e) {
        console.error("Android search error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, tracks]);

  // Vibrate phone on party mode if supported
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(60);
    }
  };

  // Queue Handlers
  const handleAddToQueue = (track: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setQueueTracks((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const handleRemoveFromQueue = (indexToRemove: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setQueueTracks((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearQueue = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setQueueTracks([]);
  };

  const handlePlayQueueTrack = (track: Track, index: number) => {
    triggerHaptic();
    onPlaySong(track);
    setQueueTracks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRefillQueue = () => {
    triggerHaptic();
    const rest = activeTracks.filter((t) => t.id !== activeTrack.id);
    setQueueTracks(rest.slice(0, 8));
  };

  // Fallback Lyrics Generator
  const generateFallbackLyrics = (track: Track): LyricLineItem[] => {
    const t = track.title;
    const a = track.artist || "MJ PULSE";
    return [
      { timeSec: 0, text: `♪ ${t} ♪` },
      { timeSec: 6, text: `Vocals and Composition • ${a}` },
      { timeSec: 14, text: "High Fidelity Master Audio Stream • 320kbps" },
      { timeSec: 22, text: "Feel the sub-bass pulse and dynamic acoustic rhythm" },
      { timeSec: 32, text: `♪ ${t} - Resonating through spatial frequency ♪` },
      { timeSec: 46, text: "3D Spatial Audio & Dolby Stage Enabled" },
      { timeSec: 62, text: "Lost in the melody, floating in the neon groove" },
      { timeSec: 78, text: `Mastering sound design by ${a}` },
      { timeSec: 96, text: "Let the acoustic sound waves take control..." },
      { timeSec: 116, text: `♪ ${t} ♪` },
      { timeSec: 138, text: "MJ PULSE • Lossless Hi-Res Experience" },
      { timeSec: 160, text: "Neon pulse beats, sub-bass tactile vibration" },
      { timeSec: 184, text: `♪ Outro - ${t} ♪` },
    ];
  };

  // Fetch real lyrics from /api/lyrics
  useEffect(() => {
    if (!activeTrack) return;
    let isMounted = true;
    setIsLyricsLoading(true);

    const fetchLyrics = async () => {
      try {
        const queryParams = new URLSearchParams({
          title: activeTrack.title,
          artist: activeTrack.artist || "",
          duration: String(duration || activeTrack.duration || 0),
        });
        const res = await fetch(`/api/lyrics?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Lyrics fetch failed");
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.lyrics) && data.lyrics.length > 0) {
            setLyricsList(data.lyrics);
            setLyricsSynced(data.synced ?? false);
          } else {
            setLyricsList(generateFallbackLyrics(activeTrack));
            setLyricsSynced(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setLyricsList(generateFallbackLyrics(activeTrack));
          setLyricsSynced(false);
        }
      } finally {
        if (isMounted) setIsLyricsLoading(false);
      }
    };

    fetchLyrics();

    return () => {
      isMounted = false;
    };
  }, [activeTrack?.id, activeTrack?.title, duration]);

  // Active lyric index based on currentTime
  const activeLyricIndex = lyricsList.reduce((activeIdx, line, idx) => {
    if (currentTime >= line.timeSec) {
      return idx;
    }
    return activeIdx;
  }, -1);

  // Auto-scroll active lyric into view
  useEffect(() => {
    if (playerSubView !== "lyrics" || activeLyricIndex < 0) return;
    const activeEl = document.getElementById(`lyric-line-${activeLyricIndex}`);
    if (activeEl && lyricsContainerRef.current) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeLyricIndex, playerSubView]);

  return (
    <div className="space-y-8 pb-24">
      {/* Top Banner introducing Android App */}
      <div className="rounded-3xl bg-gradient-to-r from-[#111322] via-[#16192e] to-[#0d0e1a] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Native Android App • Jetpack Compose</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            MJ PULSE <span className="text-[#00F2FE]">Android App</span> Simulator
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Yeh native Android Kotlin + Jetpack Compose app ka interactive live simulator hai.
            Aap neeche phone mein directly screens explore kar sakte hain, DJ Deck chala sakte hain aur gaane play kar sakte hain!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/download"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#00F2FE]/25 hover:scale-105 active:scale-95 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Android APK</span>
          </a>
          <button
            onClick={() => setCurrentScreen("arch")}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2"
          >
            <Code2 className="w-4 h-4 text-[#8B5CF6]" />
            <span>Architecture Hub</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Android Device Simulator + Screen Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Quick Screen Switcher & Native Info */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          <div className="p-5 rounded-3xl bg-[#0f111e] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Android Screens
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>

            {/* Screen Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentScreen("home")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "home"
                    ? "bg-[#00F2FE]/15 border-[#00F2FE] text-white shadow-lg shadow-[#00F2FE]/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <Home className="w-4 h-4 text-[#00F2FE]" />
                <span className="text-xs font-semibold">Home</span>
              </button>

              <button
                onClick={() => setCurrentScreen("player")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "player"
                    ? "bg-[#FF007F]/15 border-[#FF007F] text-white shadow-lg shadow-[#FF007F]/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <Play className="w-4 h-4 text-[#FF007F]" />
                <span className="text-xs font-semibold">Now Playing</span>
              </button>

              <button
                onClick={() => setCurrentScreen("party")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "party"
                    ? "bg-gradient-to-r from-[#FFB300]/20 to-[#8B5CF6]/20 border-[#FFB300] text-white shadow-lg shadow-[#FFB300]/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <Flame className="w-4 h-4 text-[#FFB300]" />
                <div>
                  <span className="text-xs font-bold block">Party & DJ Mode</span>
                  <span className="text-[10px] text-white/40 block">Strobe, Decks & SFX</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentScreen("search")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "search"
                    ? "bg-[#00F2FE]/15 border-[#00F2FE] text-white shadow-lg shadow-[#00F2FE]/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <Search className="w-4 h-4 text-[#00F2FE]" />
                <span className="text-xs font-semibold">Search</span>
              </button>

              <button
                onClick={() => setCurrentScreen("history")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "history"
                    ? "bg-purple-500/15 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <History className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold">History</span>
              </button>

              <button
                onClick={() => setCurrentScreen("settings")}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  currentScreen === "settings"
                    ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20"
                    : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs font-semibold">Settings (MJ Logo)</span>
              </button>
            </div>
          </div>

          {/* Android Kotlin Source Code Info */}
          <div className="p-5 rounded-3xl bg-[#0f111e] border border-white/10 space-y-3.5 shadow-xl text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00F2FE]" />
              <span>Native Android Project Files</span>
            </h3>
            <p className="text-white/50 text-[11px]">
              Yeh saari screens native Kotlin aur Jetpack Compose mein <code>/app/src/main/java/com/example/</code> folder mein mojood hain:
            </p>

            <ul className="space-y-1.5 font-mono text-[11px] text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>HomeScreen.kt (Neon Glassmorphic Feed)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>PlayerScreen.kt (3D Vinyl, Visualizer)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>DjModeScreen.kt (Dual Decks & Fader)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>PartyModeScreen.kt (Strobe & Haptics)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>AudioPlayerManager.kt (ExoPlayer Core)</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-white/10 text-[11px] text-white/50 space-y-1 font-mono">
              <div>Package: <span className="text-white">com.aistudio.mjpulse.audiomx</span></div>
              <div>Min SDK: <span className="text-white">24 (Android 7.0+)</span></div>
              <div>Target SDK: <span className="text-white">36 (Android 15)</span></div>
              <div>Build System: <span className="text-white">Gradle Kotlin DSL</span></div>
            </div>
          </div>
        </div>

        {/* Center: The Phone Mockup */}
        <div className="lg:col-span-8 flex justify-center order-1 lg:order-2">
          {/* Smartphone Bezel */}
          <div className="relative w-[360px] sm:w-[390px] h-[780px] rounded-[48px] bg-[#0c0d16] border-[6px] border-[#22263d] shadow-[0_0_50px_rgba(0,242,254,0.15)] flex flex-col overflow-hidden select-none">
            {/* Top Phone Speaker Ear-piece */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/20 z-50 pointer-events-none" />

            {/* Android Status Bar */}
            <div className="h-10 bg-[#080911]/90 backdrop-blur-md px-4 flex items-center justify-between text-[11px] font-mono text-white/80 z-40 border-b border-white/5 relative">
              <span className="w-12">12:00</span>
              {/* Punch-hole Front Camera & Flashlight LED Module */}
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10" />
                {/* Camera Flashlight LED Torch Indicator */}
                <button
                  onClick={() => {
                    setFlashLightActive(!flashLightActive);
                    triggerHaptic();
                  }}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border transition cursor-pointer ${
                    flashLightActive
                      ? "bg-amber-400/20 border-amber-300/80 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                  }`}
                  title={flashLightActive ? "Turn Off Flash Light (Torch)" : "Turn On Flash Light (Camera Torch)"}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-75 ${
                      flashLightActive && (flashLightMode === "continuous" || torchLedTrigger)
                        ? "bg-white shadow-[0_0_12px_4px_rgba(255,255,220,1)] scale-125"
                        : "bg-amber-950 border border-amber-500/50"
                    }`}
                  />
                  <Flashlight className={`w-3 h-3 ${flashLightActive ? "text-amber-300" : "text-white/40"}`} />
                  <span className="text-[8px] font-bold tracking-tight uppercase">
                    {flashLightActive ? (flashLightMode === "continuous" ? "Torch" : "Strobe") : "Torch"}
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-[10px] w-14 justify-end">
                <span>5G</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Simulated High-Beam Flashlight Projector Glow (Radiates from phone top when torch active) */}
            {flashLightActive && (flashLightMode === "continuous" || torchLedTrigger) && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-amber-100/40 via-white/20 to-transparent blur-2xl pointer-events-none z-50 animate-pulse" />
            )}

            {/* Screen Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto bg-[#080911] text-white scrollbar-none flex flex-col relative">
              {/* Screen Strobe Flash Overlay */}
              {(flashScreenActive || isFullscreenStrobe) && screenFlashTrigger && (
                <div
                  className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-75 mix-blend-screen"
                  style={{
                    backgroundColor: getStrobeHexColor(),
                    opacity: isFullscreenStrobe ? 0.95 : 0.72,
                  }}
                />
              )}

              {/* Fullscreen Rave Strobe Screen Modal */}
              {isFullscreenStrobe && (
                <div
                  className="absolute inset-0 z-50 flex flex-col justify-between p-5 cursor-pointer select-none transition-colors duration-100"
                  style={{
                    backgroundColor: screenFlashTrigger ? getStrobeHexColor() : "#05060a",
                  }}
                  onClick={() => {
                    setRainbowColorIndex((i) => (i + 1) % 6);
                    triggerHaptic();
                  }}
                >
                  {/* Strobe Header */}
                  <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black tracking-wider text-white drop-shadow leading-none">RAVE FLASH SCREEN</h4>
                        <p className="text-[10px] text-white/80 font-mono drop-shadow mt-0.5">
                          {flashScreenSpeed.toUpperCase()} • {deckABpm} BPM
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFullscreenStrobe(false)}
                      className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
                      title="Exit Rave Strobe Screen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Center Pulse Visual */}
                  <div className="text-center space-y-2 pointer-events-none drop-shadow-md">
                    <div className={`w-24 h-24 mx-auto rounded-full border-4 border-white/80 bg-black/40 backdrop-blur-md flex items-center justify-center ${screenFlashTrigger ? "scale-110 border-white" : "scale-90"} transition-transform duration-75 shadow-2xl`}>
                      <Zap className={`w-12 h-12 ${screenFlashTrigger ? "text-amber-300" : "text-white"}`} />
                    </div>
                    <p className="text-xs font-black tracking-widest text-white drop-shadow">TAP SCREEN TO SWITCH COLOR</p>
                    <p className="text-[10px] text-white/80 font-mono drop-shadow">CONCERT & PARTY STROBE ACTIVE</p>
                  </div>

                  {/* Bottom Strobe Controls */}
                  <div className="space-y-2 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-white/70">COLOR</span>
                      <div className="flex items-center gap-1">
                        {(["white", "cyan", "pink", "lime", "rainbow"] as const).map((c) => (
                          <button
                            key={c}
                            onClick={() => setFlashScreenColor(c)}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition cursor-pointer ${
                              flashScreenColor === c
                                ? "bg-white text-black font-black scale-105"
                                : "bg-white/15 text-white hover:bg-white/30"
                            }`}
                          >
                            {c === "rainbow" ? "🌈 DISCO" : c.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-[9px] font-bold text-white/70">SPEED</span>
                      <div className="flex items-center gap-1">
                        {(["bpm", "slow", "fast", "hyper"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setFlashScreenSpeed(s)}
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                              flashScreenSpeed === s
                                ? "bg-[#FF007F] text-white shadow"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                          >
                            {s === "bpm" ? "BPM SYNC" : s.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* HOME SCREEN */}
              {currentScreen === "home" && (
                <div className="p-4 space-y-4">
                  {/* Top Bar inside Home */}
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => setCurrentScreen("settings")}
                      className="flex items-center space-x-2 cursor-pointer group"
                      title="Open Settings"
                    >
                      <div className="flex items-center space-x-0.5 group-hover:scale-105 transition">
                        <span className="w-1 h-3 bg-[#EC4899] rounded-full animate-pulse" />
                        <span className="w-1 h-5 bg-[#8B5CF6] rounded-full" />
                        <span className="w-1 h-6 bg-[#00F2FE] rounded-full" />
                      </div>
                      <span className="font-black text-sm tracking-wider text-white group-hover:text-[#00F2FE] transition flex items-center gap-1">
                        <span>MJ PULSE</span>
                        <Settings className="w-3 h-3 text-white/40 group-hover:text-[#00F2FE] group-hover:rotate-45 transition opacity-0 group-hover:opacity-100" />
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentScreen("search")}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition active:scale-95 cursor-pointer"
                        title="Search"
                      >
                        <Search className="w-4 h-4" />
                      </button>

                      {/* MJ LOGO BUTTON -> OPENS SETTINGS */}
                      <button
                        onClick={() => setCurrentScreen("settings")}
                        className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] p-0.5 hover:scale-110 active:scale-90 transition cursor-pointer shadow-md shadow-[#FF007F]/25 relative group"
                        title="Click MJ Logo to Open Settings"
                        aria-label="MJ Settings"
                      >
                        <div className="w-full h-full rounded-full bg-[#111322] group-hover:bg-[#1b1e38] flex items-center justify-center text-[10px] font-bold text-white group-hover:text-[#00F2FE] transition">
                          MJ
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border border-[#080911] flex items-center justify-center">
                          <Settings className="w-1.5 h-1.5 text-white animate-spin-slow" />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Card */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-[#1c1236] via-[#10132b] to-[#0b1b2b] border border-white/15 p-4 overflow-hidden shadow-lg">
                    <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#00F2FE]/20 rounded-full blur-xl pointer-events-none" />
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 inline-block mb-1.5">
                      FEEL THE MUSIC • LIVE THE BEAT
                    </span>
                    <h3 className="text-base font-black text-white leading-tight">
                      Your Music. Your <span className="text-[#00F2FE]">Vibe.</span>
                    </h3>
                    <p className="text-[11px] text-white/60 mt-1 max-w-[210px] line-clamp-2">
                      Lossless high-res streaming with dynamic 3D spatial soundstage.
                    </p>

                    <div className="mt-3 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const trackToPlay = currentGenreTracks[0] || activeTrack;
                          onPlaySong(trackToPlay);
                          setCurrentScreen("player");
                          triggerHaptic();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-[#00F2FE]/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>
                          {selectedGenre === "All" || selectedGenre === "Trending"
                            ? "Play Trending"
                            : `Play ${selectedGenre}`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Feature Chips */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <button
                      onClick={() => setCurrentScreen("party")}
                      className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFB300]/10 to-[#8B5CF6]/10 border border-[#FFB300]/30 hover:border-[#FFB300] transition flex flex-col items-center gap-1 group"
                    >
                      <Flame className="w-4 h-4 text-[#FFB300] group-hover:scale-110 transition" />
                      <span className="text-[10px] font-bold text-white">Party & DJ</span>
                    </button>
                    <button
                      onClick={() => setCurrentScreen("search")}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#00F2FE]/50 transition flex flex-col items-center gap-1 group"
                    >
                      <Search className="w-4 h-4 text-[#00F2FE] group-hover:scale-110 transition" />
                      <span className="text-[10px] font-bold text-white">Explore</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic();
                        setSheetSelectedPlaylist(null);
                        setShowMyPlaylistSheet(true);
                      }}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#FF007F]/50 transition flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <ListMusic className="w-4 h-4 text-[#FF007F] group-hover:scale-110 transition" />
                      <span className="text-[10px] font-bold text-white">My Playlist</span>
                    </button>
                  </div>

                  {/* Genre / Filter Chips */}
                  <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    {["All", "Trending", "Synthwave", "EDM", "Lo-Fi", "Bass Boost", "Punjabi Pop"].map((genre) => {
                      const isActive = selectedGenre === genre;
                      return (
                        <button
                          key={genre}
                          onClick={() => handleGenreSelect(genre)}
                          className={`px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 font-medium flex items-center gap-1.5 cursor-pointer border ${
                            isActive
                              ? "bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] text-white font-black shadow-md shadow-[#00F2FE]/25 border-transparent scale-[1.02]"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {isActive && isGenreLoading && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          )}
                          <span>{genre}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Song List (Glassmorphic Cards) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white/80">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">
                          {selectedGenre === "All"
                            ? "Trending Songs"
                            : selectedGenre === "Trending"
                            ? "Trending Chartbusters"
                            : `${selectedGenre} Hits`}
                        </span>
                        {isGenreLoading ? (
                          <span className="text-[9px] text-[#00F2FE] flex items-center gap-1 font-normal animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-ping" />
                            Loading...
                          </span>
                        ) : (
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40 font-mono">
                            {currentGenreTracks.length} tracks
                          </span>
                        )}
                      </div>
                      <span
                        className="text-[10px] text-[#00F2FE] hover:underline cursor-pointer"
                        onClick={() => {
                          triggerHaptic();
                          if (selectedGenre !== "All" && selectedGenre !== "Trending") {
                            setSearchQuery(selectedGenre);
                          }
                          setCurrentScreen("search");
                        }}
                      >
                        View All
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {currentGenreTracks.slice(0, 8).map((track) => {
                        const isThisPlaying = (currentTrack?.id === track.id || (!currentTrack && track.id === activeTrack.id)) && isPlaying;
                        return (
                          <div
                            key={track.id}
                            onClick={() => {
                              triggerHaptic();
                              onPlaySong(track);
                              setCurrentScreen("player");
                            }}
                            className={`p-2 rounded-xl flex items-center justify-between transition cursor-pointer border ${
                              (currentTrack?.id === track.id || (!currentTrack && track.id === activeTrack.id))
                                ? "bg-[#16192e] border-[#00F2FE]/40 shadow-sm shadow-[#00F2FE]/10"
                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 relative">
                                <img
                                  src={track.thumbnail}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                />
                                {isThisPlaying && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
                                  </div>
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-bold text-white truncate max-w-[170px]">
                                  {track.title}
                                </p>
                                <p className="text-[10px] text-white/40 truncate max-w-[170px]">
                                  {track.artist}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 flex-shrink-0">
                              <button
                                onClick={(e) => handleAddToQueue(track, e)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#00F2FE]/20 text-white/50 hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
                                title="Add to Queue"
                                aria-label="Add to Queue"
                              >
                                <ListPlus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (currentTrack?.id === track.id) {
                                    onTogglePlayPause();
                                  } else {
                                    onPlaySong(track);
                                  }
                                }}
                                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                              >
                                {isThisPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-current text-[#00F2FE]" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* NOW PLAYING FULL SCREEN */}
              {currentScreen === "player" && (
                <div className="flex-1 p-4 flex flex-col justify-between space-y-3 min-h-full">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs text-white/70 relative">
                    <button
                      onClick={() => {
                        if (playerSubView !== "player") {
                          setPlayerSubView("player");
                        } else {
                          setCurrentScreen("home");
                        }
                      }}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
                      title={playerSubView !== "player" ? "Back to Player" : "Back to Home"}
                      aria-label={playerSubView !== "player" ? "Back to Player" : "Back to Home"}
                    >
                      <ChevronDown className={`w-4 h-4 transition ${playerSubView !== "player" ? "rotate-90" : ""}`} />
                    </button>
                    <div className="text-center">
                      <span className="text-[9px] text-[#00F2FE] uppercase tracking-widest font-mono font-bold block">
                        {playerSubView === "lyrics"
                          ? "LYRICS"
                          : playerSubView === "queue"
                          ? "PLAYBACK QUEUE"
                          : playerSubView === "equalizer"
                          ? "PRO EQUALIZER"
                          : "NOW PLAYING"}
                      </span>
                      <span className="text-[11px] font-semibold text-white">
                        {playerSubView === "queue"
                          ? `${queueTracks.length} Songs in Queue`
                          : playerSubView === "equalizer"
                          ? `${equalizerPreset.toUpperCase()} • 5-Band Studio`
                          : currentTrack?.source || "MJ PULSE Cloud"}
                      </span>
                    </div>

                    {/* Action Group: Quick Lyrics, Quick Queue, Offline Download & Favorite */}
                    <div className="flex items-center space-x-1.5">
                      {/* Offline Download Button */}
                      <button
                        onClick={handleToggleDownload}
                        disabled={isDownloading}
                        className={`p-2 rounded-full transition flex items-center justify-center cursor-pointer ${
                          isCurrentTrackDownloaded
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                            : isDownloading
                            ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 animate-pulse"
                            : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                        }`}
                        title={
                          isCurrentTrackDownloaded
                            ? "Downloaded Offline (Tap to remove)"
                            : isDownloading
                            ? "Downloading Lossless Audio..."
                            : "Download Track for Offline Playback"
                        }
                        role="button"
                        aria-label="Offline Download"
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-[#00F2FE] border-t-transparent rounded-full animate-spin" />
                        ) : isCurrentTrackDownloaded ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>

                      {/* Favorite Button */}
                      <button
                        onClick={() => {
                          setIsFavorite(!isFavorite);
                          triggerHaptic();
                        }}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        aria-label="Favorite"
                      >
                        <Heart
                          className={`w-4 h-4 transition ${
                            isFavorite ? "fill-[#FF007F] text-[#FF007F] scale-110" : "text-white/60 hover:text-white"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Offline Download Toast Notification */}
                  {downloadToast && (
                    <div className="mx-auto px-3 py-1.5 rounded-full bg-[#111322]/95 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 z-30 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{downloadToast}</span>
                    </div>
                  )}

                  {/* SUBVIEW 1: CLASSIC VINYL PLAYER */}
                  {playerSubView === "player" && (
                    <div className="flex-1 flex flex-col justify-between space-y-3.5">
                      {/* 3D Spinning Vinyl Centerpiece */}
                      <div className="flex flex-col items-center justify-center py-1 relative">
                        {/* Glowing outer rings */}
                        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                          <div
                            className={`absolute inset-0 rounded-full border border-[#00F2FE]/40 transition-all duration-700 ${
                              isPlaying ? "animate-spin-slow shadow-[0_0_30px_rgba(0,242,254,0.3)]" : ""
                            }`}
                          />
                          <div className="absolute inset-2.5 rounded-full border border-[#FF007F]/40" />

                          {/* Vinyl Record */}
                          <div
                            className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-[#111320] border-4 border-[#22263d] shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-700 ${
                              isPlaying ? "rotate-[360deg] animate-spin-slow" : ""
                            }`}
                          >
                            {/* Grooves */}
                            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-white/10 flex items-center justify-center">
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                                <img
                                  src={
                                    currentTrack?.thumbnail ||
                                    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80"
                                  }
                                  alt={currentTrack?.title || "Album"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Song Title & Artist Info */}
                      <div className="text-center px-4 space-y-0.5">
                        <h2 className="text-base font-black text-white truncate">
                          {activeTrack.title}
                        </h2>
                        <p className="text-xs text-white/50 truncate">
                          {activeTrack.artist}
                        </p>
                      </div>

                      {/* Animated Lyrics Stage (Dynamic Karaoke & Kinetic Animated Text) */}
                      <div
                        onClick={() => {
                          setPlayerSubView("lyrics");
                          triggerHaptic();
                        }}
                        className="mx-2 p-2.5 rounded-2xl bg-gradient-to-r from-white/[0.03] via-[#8B5CF6]/[0.08] to-white/[0.03] hover:bg-white/[0.08] border border-[#00F2FE]/25 hover:border-[#00F2FE]/50 shadow-lg shadow-[#00F2FE]/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative overflow-hidden"
                        title="Tap to view full synchronized lyrics screen"
                      >
                        {/* Shimmering top line accent */}
                        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#00F2FE]/60 to-transparent" />

                        {/* Animated Live Lyric Text keying on activeLyricIndex */}
                        <div
                          key={activeLyricIndex}
                          className="w-full space-y-1 animate-lyric-slide"
                        >
                          <div className="flex items-center justify-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-ping" />
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#00F2FE] font-bold">
                              {lyricsSynced ? "Karaoke Sync" : "Studio Lyrics"}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-ping" />
                          </div>

                          <p className="text-sm font-black tracking-wide leading-snug bg-gradient-to-r from-[#00F2FE] via-[#F472B6] to-[#A78BFA] bg-clip-text text-transparent animate-lyric-gradient px-2 drop-shadow-sm">
                            {lyricsList[activeLyricIndex]?.text || `♪ ${activeTrack.title} ♪`}
                          </p>

                          {lyricsList[activeLyricIndex + 1]?.text && (
                            <p className="text-[10px] text-white/40 italic font-medium truncate max-w-[90%] mx-auto transition-opacity duration-500">
                              {lyricsList[activeLyricIndex + 1].text}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Audio Visualizer Spectrum Bars (Animated Dynamic Equalizer) */}
                      <div className="flex items-end justify-center space-x-1.5 h-6 px-4 py-0.5">
                        {[
                          { kf: "eq-bounce-5", dur: "0.55s", delay: "-0.2s", rest: "32%" },
                          { kf: "eq-bounce-1", dur: "0.62s", delay: "-0.45s", rest: "78%" },
                          { kf: "eq-bounce-3", dur: "0.48s", delay: "-0.1s", rest: "60%" },
                          { kf: "eq-bounce-2", dur: "0.70s", delay: "-0.5s", rest: "92%" },
                          { kf: "eq-bounce-4", dur: "0.58s", delay: "-0.3s", rest: "72%" },
                          { kf: "eq-bounce-5", dur: "0.42s", delay: "-0.15s", rest: "24%" },
                          { kf: "eq-bounce-6", dur: "0.65s", delay: "-0.4s", rest: "48%" },
                          { kf: "eq-bounce-5", dur: "0.50s", delay: "-0.25s", rest: "22%" },
                          { kf: "eq-bounce-1", dur: "0.68s", delay: "-0.35s", rest: "96%" },
                          { kf: "eq-bounce-2", dur: "0.46s", delay: "-0.1s", rest: "74%" },
                          { kf: "eq-bounce-4", dur: "0.72s", delay: "-0.55s", rest: "58%" },
                          { kf: "eq-bounce-5", dur: "0.52s", delay: "-0.2s", rest: "25%" },
                          { kf: "eq-bounce-3", dur: "0.60s", delay: "-0.4s", rest: "64%" },
                          { kf: "eq-bounce-6", dur: "0.56s", delay: "-0.3s", rest: "52%" },
                        ].map((bar, i) => (
                          <span
                            key={i}
                            style={{
                              animation: isPlaying
                                ? `${bar.kf} ${bar.dur} ease-in-out infinite alternate ${bar.delay}`
                                : "none",
                              height: isPlaying ? undefined : bar.rest,
                              filter: isPlaying
                                ? "drop-shadow(0 0 3px rgba(0, 242, 254, 0.45)) drop-shadow(0 0 6px rgba(255, 0, 127, 0.35))"
                                : "none",
                              transition: "height 0.3s ease, filter 0.3s ease",
                            }}
                            className="w-1 rounded-full bg-gradient-to-t from-[#FF007F] via-[#8B5CF6] to-[#00F2FE]"
                          />
                        ))}
                      </div>

                      {/* Quick Navigation: Lyrics, Queue & Equalizer */}
                      <div className="flex items-center justify-center gap-1.5 px-1">
                        <button
                          onClick={() => {
                            setPlayerSubView("lyrics");
                            triggerHaptic();
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] font-bold text-white/80 hover:text-white flex items-center justify-center gap-1 transition cursor-pointer"
                          title="View synchronized lyrics"
                        >
                          <Mic2 className="w-3.5 h-3.5 text-[#00F2FE]" />
                          <span>Lyrics</span>
                        </button>

                        <button
                          onClick={() => {
                            setPlayerSubView("queue");
                            triggerHaptic();
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] font-bold text-white/80 hover:text-white flex items-center justify-center gap-1 transition cursor-pointer"
                          title="View playback queue"
                        >
                          <ListMusic className="w-3.5 h-3.5 text-[#FF007F]" />
                          <span>Queue ({queueTracks.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setPlayerSubView("equalizer");
                            triggerHaptic();
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#8B5CF6]/40 hover:border-[#8B5CF6]/70 text-[10px] font-bold text-white/90 hover:text-white flex items-center justify-center gap-1 transition cursor-pointer shadow-sm shadow-[#8B5CF6]/15"
                          title="Open Master Audio Equalizer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>Equalizer</span>
                        </button>
                      </div>

                      {/* Progress Seekbar */}
                      <div className="space-y-1 px-4">
                        <div className="relative flex items-center">
                          <input
                            type="range"
                            min={0}
                            max={duration || activeTrack.duration || 100}
                            value={currentTime || 0}
                            onChange={(e) => onSeekTo(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-white/40 font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration || activeTrack.duration || 0)}</span>
                        </div>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-between px-6 pb-2">
                        <button className="text-white/40 hover:text-white transition cursor-pointer">
                          <Shuffle className="w-4 h-4" />
                        </button>
                        <button onClick={onPrevTrack} className="text-white/70 hover:text-white transition cursor-pointer">
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (!currentTrack) {
                              onPlaySong(activeTrack);
                            } else {
                              onTogglePlayPause();
                            }
                          }}
                          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] text-black flex items-center justify-center shadow-lg shadow-[#00F2FE]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 fill-current text-black" />
                          ) : (
                            <Play className="w-6 h-6 fill-current text-black ml-0.5" />
                          )}
                        </button>
                        <button onClick={onNextTrack} className="text-white/70 hover:text-white transition cursor-pointer">
                          <SkipForward className="w-5 h-5" />
                        </button>
                        <button className="text-white/40 hover:text-white transition cursor-pointer">
                          <Repeat className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBVIEW 2: SYNCHRONIZED LYRICS */}
                  {playerSubView === "lyrics" && (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      {/* Lyrics Header */}
                      <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] rounded-xl border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center">
                            <Mic2 className="w-3.5 h-3.5 text-[#00F2FE]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-white block">
                              Synced Lyrics
                            </span>
                            <span className="text-[9px] text-[#00F2FE] font-mono">
                              Tap line to jump playback
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                            {lyricsSynced ? "LRCLIB Synced" : "Studio Verses"}
                          </span>
                        </div>
                      </div>

                      {/* Scrollable Lyrics Container */}
                      <div
                        ref={lyricsContainerRef}
                        className="flex-1 overflow-y-auto max-h-[310px] pr-1 space-y-2 scrollbar-thin scrollbar-thumb-white/10"
                      >
                        {isLyricsLoading ? (
                          <div className="h-48 flex flex-col items-center justify-center space-y-2.5 text-center">
                            <div className="w-6 h-6 border-2 border-[#00F2FE] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-white/60 font-mono">Syncing studio lyrics...</p>
                          </div>
                        ) : lyricsList.length > 0 ? (
                          lyricsList.map((line, idx) => {
                            const isActive = idx === activeLyricIndex;
                            return (
                              <div
                                key={idx}
                                id={`lyric-line-${idx}`}
                                onClick={() => {
                                  onSeekTo(line.timeSec);
                                  triggerHaptic();
                                }}
                                className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-3 border ${
                                  isActive
                                    ? "bg-gradient-to-r from-[#00F2FE]/20 via-[#8B5CF6]/20 to-[#FF007F]/20 border-[#00F2FE]/60 shadow-lg shadow-[#00F2FE]/15 scale-[1.02]"
                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <p
                                    className={`text-xs leading-relaxed transition ${
                                      isActive
                                        ? "text-white font-black text-sm tracking-wide"
                                        : "text-white/50 font-medium"
                                    }`}
                                  >
                                    {line.text}
                                  </p>
                                  {isActive && (
                                    <span className="text-[9px] text-[#00F2FE] font-mono font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-ping" />
                                      Currently Singing
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10px] font-mono flex-shrink-0 ${
                                  isActive ? "text-[#00F2FE] font-bold" : "text-white/30"
                                }`}>
                                  {formatTime(line.timeSec)}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="h-40 flex flex-col items-center justify-center text-center space-y-2">
                            <Mic2 className="w-8 h-8 text-white/20" />
                            <p className="text-xs text-white/50">No lyrics found for this track.</p>
                          </div>
                        )}
                      </div>

                      {/* Mini Bottom Controls for Lyrics Screen */}
                      <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 space-y-2 shadow-xl">
                        {/* Compact Seekbar */}
                        <div className="space-y-0.5">
                          <input
                            type="range"
                            min={0}
                            max={duration || activeTrack.duration || 100}
                            value={currentTime || 0}
                            onChange={(e) => onSeekTo(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                          />
                          <div className="flex justify-between text-[9px] text-white/40 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration || activeTrack.duration || 0)}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPlayerSubView("player")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Disc3 className="w-3 h-3 text-[#00F2FE]" />
                              <span>Disc</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("queue")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <ListMusic className="w-3 h-3 text-[#FF007F]" />
                              <span>Queue ({queueTracks.length})</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("equalizer")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-[#8B5CF6]/30 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Sliders className="w-3 h-3 text-[#A78BFA]" />
                              <span>EQ</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button onClick={onPrevTrack} className="p-1.5 text-white/70 hover:text-white transition">
                              <SkipBack className="w-4 h-4" />
                            </button>
                            <button
                              onClick={onTogglePlayPause}
                              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center font-bold shadow-md shadow-[#00F2FE]/30 hover:scale-105 active:scale-95 transition"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4 fill-current text-black" />
                              ) : (
                                <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                              )}
                            </button>
                            <button onClick={onNextTrack} className="p-1.5 text-white/70 hover:text-white transition">
                              <SkipForward className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBVIEW 3: PLAYBACK QUEUE */}
                  {playerSubView === "queue" && (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      {/* Queue Header */}
                      <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] rounded-xl border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#FF007F]/20 border border-[#FF007F]/40 flex items-center justify-center">
                            <ListMusic className="w-3.5 h-3.5 text-[#FF007F]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-white block">
                              Playback Queue
                            </span>
                            <span className="text-[9px] text-white/50 font-mono">
                              {queueTracks.length} tracks waiting in queue
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {queueTracks.length > 0 && (
                            <button
                              onClick={handleClearQueue}
                              className="px-2 py-0.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Clear all tracks from queue"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Clear</span>
                            </button>
                          )}
                          <button
                            onClick={handleRefillQueue}
                            className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-[9px] font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Refill queue with trending hits"
                          >
                            <Plus className="w-2.5 h-2.5 text-[#00F2FE]" />
                            <span>Add 8</span>
                          </button>
                        </div>
                      </div>

                      {/* Queue Track List */}
                      <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                        <div className="flex items-center justify-between px-1 text-[10px] text-white/40 font-mono uppercase tracking-wider">
                          <span>Queue Songs</span>
                          <span>{queueTracks.length} Songs</span>
                        </div>

                        {queueTracks.length === 0 ? (
                          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                            <ListMusic className="w-8 h-8 text-white/20 mx-auto" />
                            <p className="text-xs text-white/60">Your playback queue is empty.</p>
                            <button
                              onClick={handleRefillQueue}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black text-xs font-bold shadow-md shadow-[#00F2FE]/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                            >
                              + Add Recommended Songs
                            </button>
                          </div>
                        ) : (
                          queueTracks.map((track, idx) => (
                            <div
                              key={`${track.id}-${idx}`}
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 flex items-center justify-between gap-2 transition group"
                            >
                              <div
                                onClick={() => handlePlayQueueTrack(track, idx)}
                                className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer"
                              >
                                <span className="text-[10px] font-mono text-white/40 w-4 text-center group-hover:text-[#00F2FE]">
                                  {idx + 1}
                                </span>
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                                  <img
                                    src={track.thumbnail}
                                    alt={track.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-[11px] font-bold text-white truncate max-w-[150px] group-hover:text-[#00F2FE] transition">
                                    {track.title}
                                  </p>
                                  <p className="text-[9px] text-white/40 truncate max-w-[150px]">
                                    {track.artist}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <button
                                  onClick={() => handlePlayQueueTrack(track, idx)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00F2FE]/20 text-white/70 hover:text-[#00F2FE] transition cursor-pointer"
                                  title="Play track right now"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                </button>
                                <button
                                  onClick={(e) => handleRemoveFromQueue(idx, e)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition cursor-pointer"
                                  title="Remove from queue"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Mini Bottom Controls for Queue Screen */}
                      <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 space-y-2 shadow-xl">
                        {/* Compact Seekbar */}
                        <div className="space-y-0.5">
                          <input
                            type="range"
                            min={0}
                            max={duration || activeTrack.duration || 100}
                            value={currentTime || 0}
                            onChange={(e) => onSeekTo(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                          />
                          <div className="flex justify-between text-[9px] text-white/40 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration || activeTrack.duration || 0)}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPlayerSubView("player")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Disc3 className="w-3 h-3 text-[#00F2FE]" />
                              <span>Disc</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("lyrics")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Mic2 className="w-3 h-3 text-[#8B5CF6]" />
                              <span>Lyrics</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("equalizer")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-[#8B5CF6]/30 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Sliders className="w-3 h-3 text-[#A78BFA]" />
                              <span>EQ</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button onClick={onPrevTrack} className="p-1.5 text-white/70 hover:text-white transition cursor-pointer">
                              <SkipBack className="w-4 h-4" />
                            </button>
                            <button
                              onClick={onTogglePlayPause}
                              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center font-bold shadow-md shadow-[#00F2FE]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4 fill-current text-black" />
                              ) : (
                                <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                              )}
                            </button>
                            <button onClick={onNextTrack} className="p-1.5 text-white/70 hover:text-white transition cursor-pointer">
                              <SkipForward className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBVIEW 4: MASTER 5-BAND EQUALIZER & AUDIO FX */}
                  {playerSubView === "equalizer" && (
                    <div className="flex-1 flex flex-col justify-between space-y-2.5">
                      {/* Equalizer Header & Master Power Toggle */}
                      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-white/[0.05] via-[#8B5CF6]/[0.08] to-white/[0.05] rounded-2xl border border-white/10 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                              isEqEnabled
                                ? "bg-gradient-to-tr from-[#00F2FE]/30 to-[#8B5CF6]/30 border border-[#00F2FE]/50 shadow-md shadow-[#00F2FE]/20"
                                : "bg-white/5 border border-white/10"
                            }`}
                          >
                            <Sliders className={`w-4 h-4 ${isEqEnabled ? "text-[#00F2FE]" : "text-white/40"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-white tracking-wide">
                                5-Band Studio EQ
                              </span>
                              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30">
                                32-bit DSP
                              </span>
                            </div>
                            <span className="text-[9px] text-white/50 font-mono block">
                              {isEqEnabled ? `${equalizerPreset.toUpperCase()} Profile • Active` : "Bypassed (Flat)"}
                            </span>
                          </div>
                        </div>

                        {/* Master Power Switch */}
                        <button
                          onClick={() => {
                            setIsEqEnabled(!isEqEnabled);
                            triggerHaptic();
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition flex items-center gap-1.5 cursor-pointer border ${
                            isEqEnabled
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/25"
                              : "bg-white/5 text-white/40 border-white/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isEqEnabled ? "bg-emerald-400 animate-pulse" : "bg-white/30"
                            }`}
                          />
                          <span>{isEqEnabled ? "ENABLED" : "BYPASS"}</span>
                        </button>
                      </div>

                      {/* Scrollable EQ Adjustments Area */}
                      <div className="flex-1 overflow-y-auto max-h-[305px] pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10">
                        {/* Dynamic Graphic Frequency Response Curve (SVG) */}
                        <div className="p-2 rounded-2xl bg-[#0b0d18] border border-white/10 space-y-1 relative overflow-hidden">
                          <div className="flex items-center justify-between text-[9px] font-mono text-white/40 px-1">
                            <span className="text-[#00F2FE] font-bold">+12 dB</span>
                            <span className="text-white/30">Frequency Response Curve</span>
                            <span className="text-[#FF007F] font-bold">-12 dB</span>
                          </div>

                          <div className="h-14 w-full relative">
                            {/* Horizontal 0 dB Baseline */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-white/15 pointer-events-none" />

                            {/* Responsive SVG Curve */}
                            <svg
                              viewBox="0 0 250 56"
                              className="w-full h-full overflow-visible"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="eqResponseGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.35" />
                                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#FF007F" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {(() => {
                                const pts = [0, 1, 2, 3, 4].map((i) => ({
                                  x: 25 + i * 50,
                                  y: isEqEnabled ? 28 - ((eqBands[i] ?? 0) / 12) * 22 : 28,
                                }));
                                const pathD = `M 5 ${pts[0].y} L ${pts[0].x} ${pts[0].y} ` +
                                  pts.slice(1).map((p, idx) => {
                                    const prev = pts[idx];
                                    const cx1 = prev.x + (p.x - prev.x) / 2;
                                    const cx2 = prev.x + (p.x - prev.x) / 2;
                                    return `C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y} `;
                                  }).join("") +
                                  `L 245 ${pts[4].y}`;
                                const areaD = `${pathD} L 245 56 L 5 56 Z`;

                                return (
                                  <>
                                    <path d={areaD} fill="url(#eqResponseGrad)" />
                                    <path
                                      d={pathD}
                                      fill="none"
                                      stroke="#00F2FE"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      filter="drop-shadow(0 0 4px rgba(0, 242, 254, 0.6))"
                                    />
                                    {pts.map((pt, i) => (
                                      <circle
                                        key={i}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="3"
                                        fill="#FFFFFF"
                                        stroke="#FF007F"
                                        strokeWidth="1.5"
                                        className="transition-all duration-150"
                                      />
                                    ))}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>
                        </div>

                        {/* 5-Band Vertical Faders Grid */}
                        <div className="p-2.5 rounded-2xl bg-[#0e1020] border border-white/10 space-y-1 shadow-md">
                          <div className="grid grid-cols-5 gap-1.5 text-center">
                            {[
                              { freq: "60 Hz", role: "Sub" },
                              { freq: "230 Hz", role: "Bass" },
                              { freq: "910 Hz", role: "Mids" },
                              { freq: "3.6 kHz", role: "High" },
                              { freq: "14 kHz", role: "Air" },
                            ].map((band, idx) => {
                              const val = isEqEnabled ? (eqBands[idx] ?? 0) : 0;
                              const isPositive = val > 0;
                              const isNegative = val < 0;

                              return (
                                <div key={idx} className="flex flex-col items-center space-y-1">
                                  {/* dB Readout */}
                                  <span
                                    className={`text-[9px] font-mono font-bold transition ${
                                      !isEqEnabled
                                        ? "text-white/30"
                                        : isPositive
                                        ? "text-[#00F2FE]"
                                        : isNegative
                                        ? "text-[#FF007F]"
                                        : "text-white/60"
                                    }`}
                                  >
                                    {val > 0 ? `+${val}` : val} dB
                                  </span>

                                  {/* Vertical Slider Track Container */}
                                  <div className="relative h-24 w-7 flex items-center justify-center">
                                    {/* Track line background */}
                                    <div className="absolute w-1.5 h-full rounded-full bg-white/10" />

                                    {/* Center 0 dB marker */}
                                    <div className="absolute w-3 h-0.5 bg-white/40 top-1/2 -translate-y-1/2 z-0" />

                                    {/* Active filled level bar from 0dB */}
                                    <div
                                      style={{
                                        bottom: isEqEnabled && val >= 0 ? "50%" : `${((val + 12) / 24) * 100}%`,
                                        height: isEqEnabled ? `${(Math.abs(val) / 24) * 50}%` : "0%",
                                      }}
                                      className="absolute w-1.5 rounded-full bg-gradient-to-t from-[#FF007F] via-[#8B5CF6] to-[#00F2FE] pointer-events-none transition-all duration-100"
                                    />

                                    {/* Native invisible Range Slider with -rotate-90 */}
                                    <input
                                      type="range"
                                      min={-12}
                                      max={12}
                                      step={1}
                                      value={isEqEnabled ? val : 0}
                                      disabled={!isEqEnabled}
                                      onChange={(e) => {
                                        handleBandChange(idx, Number(e.target.value));
                                        triggerHaptic();
                                      }}
                                      className="absolute w-24 h-7 -rotate-90 opacity-0 cursor-pointer z-20"
                                      style={{ touchAction: "none" }}
                                      title={`${band.freq}: ${val} dB`}
                                    />

                                    {/* Custom Glowing Thumb Pill */}
                                    <div
                                      style={{
                                        bottom: isEqEnabled ? `${((val + 12) / 24) * 100}%` : "50%",
                                        transform: "translateY(50%)",
                                      }}
                                      className={`absolute w-4 h-4 rounded-full bg-white border-2 transition-all duration-100 pointer-events-none z-10 flex items-center justify-center shadow-md ${
                                        isEqEnabled
                                          ? "border-[#00F2FE] shadow-[#00F2FE]/50"
                                          : "border-white/30 shadow-none opacity-40"
                                      }`}
                                    >
                                      <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                                    </div>
                                  </div>

                                  {/* Frequency Label */}
                                  <div className="pt-0.5">
                                    <span className="text-[9px] font-bold text-white block">
                                      {band.freq}
                                    </span>
                                    <span className="text-[8px] text-white/40 uppercase font-mono block">
                                      {band.role}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Presets Strip */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider font-mono">
                              Sound Presets
                            </span>
                            <button
                              onClick={() => {
                                applyEqualizerPreset("flat");
                                triggerHaptic();
                              }}
                              className="text-[9px] font-mono text-[#00F2FE] hover:underline cursor-pointer"
                            >
                              Reset Flat (0 dB)
                            </button>
                          </div>

                          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {Object.entries(EQ_PRESETS_DATA).map(([id, preset]) => (
                              <button
                                key={id}
                                onClick={() => {
                                  applyEqualizerPreset(id);
                                  triggerHaptic();
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition cursor-pointer border flex-shrink-0 ${
                                  equalizerPreset === id
                                    ? "bg-gradient-to-r from-[#00F2FE]/20 to-[#8B5CF6]/20 border-[#00F2FE] text-white shadow-sm shadow-[#00F2FE]/20"
                                    : "bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sound Enhancement Knobs (Bass Boost & 3D Spatial Virtualizer) */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {/* Bass Boost Card */}
                          <div className="p-2.5 rounded-2xl bg-[#0e1020] border border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-[#FF007F]" />
                                <span className="text-[10px] font-bold text-white">Bass Boost</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#FF007F]">
                                {bassBoostAmount}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={bassBoostAmount}
                              onChange={(e) => {
                                setBassBoostAmount(Number(e.target.value));
                                setEqualizerPreset("custom");
                              }}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF007F]"
                            />
                            <p className="text-[8px] text-white/40 font-mono">
                              Low-end subwoofer harmonics
                            </p>
                          </div>

                          {/* 3D Spatial Virtualizer Card */}
                          <div className="p-2.5 rounded-2xl bg-[#0e1020] border border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Waves className="w-3.5 h-3.5 text-[#00F2FE]" />
                                <span className="text-[10px] font-bold text-white">Virtualizer</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#00F2FE]">
                                {virtualizerAmount}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={virtualizerAmount}
                              onChange={(e) => {
                                setVirtualizerAmount(Number(e.target.value));
                                setEqualizerPreset("custom");
                              }}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                            />
                            <p className="text-[8px] text-white/40 font-mono">
                              3D Headphone surround stage
                            </p>
                          </div>
                        </div>

                        {/* Dolby Atmos & Engine Switch */}
                        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#00F2FE]" />
                            <div>
                              <p className="text-[10px] font-bold text-white">Dolby Atmos Mastering</p>
                              <p className="text-[8px] text-white/40">Dynamic range compression & clarity</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setDolbyAtmosEnabled(!dolbyAtmosEnabled);
                              triggerHaptic();
                            }}
                            className={`w-9 h-5 rounded-full p-0.5 transition cursor-pointer ${
                              dolbyAtmosEnabled ? "bg-[#00F2FE]" : "bg-white/20"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-black transition transform ${
                                dolbyAtmosEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Mini Bottom Controls for Equalizer Screen */}
                      <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 space-y-2 shadow-xl">
                        {/* Compact Seekbar */}
                        <div className="space-y-0.5">
                          <input
                            type="range"
                            min={0}
                            max={duration || activeTrack.duration || 100}
                            value={currentTime || 0}
                            onChange={(e) => onSeekTo(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                          />
                          <div className="flex justify-between text-[9px] text-white/40 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration || activeTrack.duration || 0)}</span>
                          </div>
                        </div>

                        {/* Navigation & Playback Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPlayerSubView("player")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Disc3 className="w-3 h-3 text-[#00F2FE]" />
                              <span>Disc</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("lyrics")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Mic2 className="w-3 h-3 text-[#8B5CF6]" />
                              <span>Lyrics</span>
                            </button>

                            <button
                              onClick={() => setPlayerSubView("queue")}
                              className="text-[9px] font-bold px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition cursor-pointer"
                            >
                              <ListMusic className="w-3 h-3 text-[#FF007F]" />
                              <span>Queue ({queueTracks.length})</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button onClick={onPrevTrack} className="p-1.5 text-white/70 hover:text-white transition cursor-pointer">
                              <SkipBack className="w-4 h-4" />
                            </button>
                            <button
                              onClick={onTogglePlayPause}
                              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center font-bold shadow-md shadow-[#00F2FE]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4 fill-current text-black" />
                              ) : (
                                <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                              )}
                            </button>
                            <button onClick={onNextTrack} className="p-1.5 text-white/70 hover:text-white transition cursor-pointer">
                              <SkipForward className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PARTY & DJ MODE SCREEN (Unified Soundstage) */}
              {currentScreen === "party" && (
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#FFB300]" />
                      <span>Party & DJ Soundstage</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40">
                        Haptic Pulse
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
                        Dual Decks
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Pulsing Beat Visualizer with Strobe Aura */}
                  <div
                    className={`relative rounded-2xl bg-black border border-white/10 p-5 flex flex-col items-center justify-center overflow-hidden min-h-[170px] transition-shadow duration-300 ${
                      strobeActive && isPlaying
                        ? strobeColor === "cyan"
                          ? "shadow-[0_0_35px_rgba(0,242,254,0.3)] border-[#00F2FE]/40"
                          : strobeColor === "pink"
                          ? "shadow-[0_0_35px_rgba(255,0,127,0.3)] border-[#FF007F]/40"
                          : "shadow-[0_0_35px_rgba(139,92,246,0.3)] border-[#8B5CF6]/40"
                        : ""
                    }`}
                  >
                    {/* Concentric expanding ripples */}
                    <div
                      className={`absolute w-36 h-36 rounded-full border-2 ${
                        strobeColor === "cyan"
                          ? "border-[#00F2FE]/50"
                          : strobeColor === "pink"
                          ? "border-[#FF007F]/50"
                          : "border-[#8B5CF6]/50"
                      } ${isPlaying ? "animate-ping" : ""}`}
                    />
                    <div className="absolute w-24 h-24 rounded-full border border-white/20" />

                    <div className="relative z-10 text-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF007F] via-[#8B5CF6] to-[#FFB300] flex items-center justify-center mx-auto shadow-lg shadow-[#FFB300]/30">
                        <Zap className="w-6 h-6 text-black" />
                      </div>
                      <span className="text-xs font-bold text-white block pt-1">
                        Sub-Bass & Visualizer Active
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">
                        Beat Intensity: {hapticIntensity}% • {isPlaying ? "Vibe Sync On" : "Idle"}
                      </span>
                    </div>
                  </div>

                  {/* PARTY LIGHTING ENGINE: FLASH SCREEN & FLASH LIGHT */}
                  <div className="space-y-3">
                    {/* SECTION 1: FLASH SCREEN (SCREEN STROBE) */}
                    <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#FF007F] p-0.5 flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-[#111322] flex items-center justify-center">
                              <SunMedium className="w-3.5 h-3.5 text-[#00F2FE]" />
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-white text-[11px] block leading-none">
                              Flash Screen (Screen Strobe)
                            </span>
                            <span className="text-[9px] text-white/50">
                              {flashScreenActive ? (
                                <span className="text-[#00F2FE] font-semibold animate-pulse">● Screen Strobe Active ({flashScreenSpeed.toUpperCase()})</span>
                              ) : (
                                "Pulsing disco screen strobe"
                              )}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const next = !flashScreenActive;
                            setFlashScreenActive(next);
                            setStrobeActive(next);
                            triggerHaptic();
                          }}
                          className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                            flashScreenActive ? "bg-[#00F2FE]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-black transition transform ${
                              flashScreenActive ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Flash Screen Color & Speed Controls */}
                      <div className="space-y-2 pt-1 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/60 font-medium">Flash Color:</span>
                          <div className="flex items-center gap-1.5">
                            {(["white", "cyan", "pink", "lime", "rainbow"] as const).map((c) => (
                              <button
                                key={c}
                                onClick={() => {
                                  setFlashScreenColor(c);
                                  if (!flashScreenActive) setFlashScreenActive(true);
                                  triggerHaptic();
                                }}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition cursor-pointer ${
                                  flashScreenColor === c
                                    ? "bg-white text-black border-white scale-105 shadow-sm"
                                    : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                                }`}
                              >
                                {c === "white" && "⚪ White"}
                                {c === "cyan" && "🔵 Cyan"}
                                {c === "pink" && "🟣 Pink"}
                                {c === "lime" && "🟢 Lime"}
                                {c === "rainbow" && "🌈 Disco"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/60 font-medium">Strobe Speed:</span>
                          <div className="flex items-center gap-1">
                            {(["bpm", "slow", "fast", "hyper"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setFlashScreenSpeed(s);
                                  triggerHaptic();
                                }}
                                className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition cursor-pointer ${
                                  flashScreenSpeed === s
                                    ? "bg-[#00F2FE] text-black border-[#00F2FE] shadow-sm"
                                    : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                                }`}
                              >
                                {s === "bpm" ? "BPM Sync" : s.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fullscreen Rave Strobe Trigger Button */}
                        <button
                          onClick={() => {
                            setIsFullscreenStrobe(true);
                            setFlashScreenActive(true);
                            triggerHaptic();
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#00F2FE]/20 via-[#8B5CF6]/20 to-[#FF007F]/20 hover:from-[#00F2FE]/30 hover:to-[#FF007F]/30 border border-[#00F2FE]/40 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#00F2FE]" />
                          <span>Launch Fullscreen Rave Flash Screen</span>
                        </button>
                      </div>
                    </div>

                    {/* SECTION 2: FLASH LIGHT (CAMERA TORCH) */}
                    <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-[#FFB300] p-0.5 flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-[#111322] flex items-center justify-center">
                              <Flashlight className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-white text-[11px] block leading-none">
                              Flash Light (Camera Torch)
                            </span>
                            <span className="text-[9px] text-white/50">
                              {flashLightActive ? (
                                <span className="text-amber-300 font-semibold animate-pulse">
                                  ● Flashlight On ({flashLightMode === "continuous" ? "Steady Beam" : "Strobe Pulse"})
                                </span>
                              ) : (
                                "Device torch & simulated high-beam"
                              )}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const next = !flashLightActive;
                            setFlashLightActive(next);
                            triggerHaptic();
                          }}
                          className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                            flashLightActive ? "bg-amber-400" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-black transition transform ${
                              flashLightActive ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Flash Light Modes & Hardware Torch Indicator */}
                      <div className="space-y-2 pt-1 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/60 font-medium">Torch Mode:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setFlashLightMode("strobe");
                                if (!flashLightActive) setFlashLightActive(true);
                                triggerHaptic();
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                flashLightMode === "strobe"
                                  ? "bg-amber-400 text-black border-amber-400 font-black shadow-sm"
                                  : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                              }`}
                            >
                              <Zap className="w-2.5 h-2.5" />
                              <span>Strobe Flash</span>
                            </button>
                            <button
                              onClick={() => {
                                setFlashLightMode("continuous");
                                if (!flashLightActive) setFlashLightActive(true);
                                triggerHaptic();
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                flashLightMode === "continuous"
                                  ? "bg-amber-400 text-black border-amber-400 font-black shadow-sm"
                                  : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                              }`}
                            >
                              <Flashlight className="w-2.5 h-2.5" />
                              <span>Steady Torch</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-white/50 bg-black/30 px-2.5 py-1.5 rounded-xl border border-white/5">
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${flashLightActive ? "bg-amber-400 animate-ping" : "bg-white/30"}`} />
                            <span>
                              {torchHardwareState === "active"
                                ? "Hardware Device Torch Connected"
                                : "Studio LED Projector Active"}
                            </span>
                          </span>
                          <span className="font-mono text-amber-300/80">
                            {flashLightActive ? "TORCH BEAM ON" : "STANDBY"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: HAPTIC BASS SYNC */}
                    <div className="p-3 rounded-2xl bg-[#111322] border border-white/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-[10px] text-white/70 font-medium">
                        <span className="flex items-center gap-1">
                          <Waves className="w-3 h-3 text-[#FFB300]" />
                          <span>Haptic Sub-Bass Vibration</span>
                        </span>
                        <span className="font-mono text-[#FFB300] font-bold">{hapticIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={hapticIntensity}
                        onChange={(e) => {
                          setHapticIntensity(Number(e.target.value));
                          triggerHaptic();
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFB300]"
                      />
                    </div>
                  </div>

                  {/* DJ DUAL TURNTABLES (Deck A & Deck B) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Deck A */}
                    <div className="p-3 rounded-2xl bg-[#111322] border border-[#00F2FE]/30 text-center space-y-2 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#00F2FE] flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isDeckAPlaying ? "bg-[#00F2FE] animate-ping" : "bg-white/30"}`} />
                          DECK A
                        </span>
                        <span className="font-mono text-white/60">{deckABpm} BPM</span>
                      </div>
                      <div
                        onClick={() => {
                          onTogglePlayPause();
                          playDjSfx("scratch");
                          triggerHaptic();
                        }}
                        className={`w-16 h-16 mx-auto rounded-full bg-black border-2 border-[#00F2FE] flex items-center justify-center cursor-pointer shadow-lg shadow-[#00F2FE]/25 group hover:scale-105 transition active:scale-95 ${
                          isDeckAPlaying ? "animate-spin-slow" : ""
                        }`}
                        title={isDeckAPlaying ? "Pause Deck A" : "Play Deck A"}
                      >
                        <Disc3 className="w-8 h-8 text-[#00F2FE] group-hover:rotate-45 transition" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-white font-bold truncate">
                          {activeTrack.title}
                        </p>
                        <p className="text-[9px] text-[#00F2FE]/80 truncate">
                          {activeTrack.artist}
                        </p>
                      </div>

                      {/* SELECT SONG FOR DECK A BUTTON */}
                      <button
                        onClick={() => {
                          setDeckSearchQuery("");
                          setDeckSearchResults(activeTracks);
                          setDeckGenreFilter("All");
                          setSelectingDeck("A");
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#3B82F6] hover:opacity-90 text-black font-bold text-[10px] flex items-center justify-center gap-1 shadow-md shadow-[#00F2FE]/25 active:scale-95 transition cursor-pointer"
                      >
                        <Music className="w-3 h-3" />
                        <span>Select Song</span>
                      </button>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
                        <button
                          onClick={() => setDeckABpm((b) => Math.max(60, b - 1))}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-white/70"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => {
                            onTogglePlayPause();
                            triggerHaptic();
                          }}
                          className={`px-2.5 py-0.5 rounded-full font-bold transition flex items-center gap-1 ${
                            isDeckAPlaying ? "bg-[#00F2FE] text-black" : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {isDeckAPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                          <span>{isDeckAPlaying ? "LIVE" : "CUE"}</span>
                        </button>
                        <button
                          onClick={() => setDeckABpm((b) => Math.min(180, b + 1))}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-white/70"
                        >
                          +1
                        </button>
                      </div>
                    </div>

                    {/* Deck B */}
                    <div className="p-3 rounded-2xl bg-[#111322] border border-[#FF007F]/40 text-center space-y-2 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-[#FF007F]/5">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#FF007F] flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isDeckBPlaying ? "bg-[#FF007F] animate-ping" : "bg-white/30"}`} />
                          DECK B
                        </span>
                        <span className="font-mono text-white/60">{deckBBpm} BPM</span>
                      </div>
                      <div
                        onClick={() => {
                          setIsDeckBPlaying(!isDeckBPlaying);
                          playDjSfx("scratch");
                          triggerHaptic();
                        }}
                        className={`w-16 h-16 mx-auto rounded-full bg-black border-2 border-[#FF007F] flex items-center justify-center cursor-pointer shadow-lg shadow-[#FF007F]/25 group hover:scale-105 transition active:scale-95 ${
                          isDeckBPlaying ? "animate-spin-slow" : ""
                        }`}
                        title={isDeckBPlaying ? "Pause Deck B" : "Play Deck B"}
                      >
                        <Disc3 className="w-8 h-8 text-[#FF007F] group-hover:rotate-45 transition" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-white font-bold truncate">
                          {deckBTrack?.title || "Select Song"}
                        </p>
                        <p className="text-[9px] text-[#FF007F]/80 truncate">
                          {deckBTrack?.artist || "Deck B"}
                        </p>
                      </div>

                      {/* SELECT SONG FOR DECK B BUTTON */}
                      <button
                        onClick={() => {
                          setDeckSearchQuery("");
                          setDeckSearchResults(activeTracks);
                          setDeckGenreFilter("All");
                          setSelectingDeck("B");
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#9333EA] hover:opacity-90 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-md shadow-[#FF007F]/25 active:scale-95 transition cursor-pointer"
                      >
                        <Music className="w-3 h-3" />
                        <span>Select Song</span>
                      </button>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
                        <button
                          onClick={() => setDeckBBpm((b) => Math.max(60, b - 1))}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-white/70"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => {
                            setIsDeckBPlaying(!isDeckBPlaying);
                            triggerHaptic();
                          }}
                          className={`px-2.5 py-0.5 rounded-full font-bold transition flex items-center gap-1 ${
                            isDeckBPlaying ? "bg-[#FF007F] text-black" : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {isDeckBPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                          <span>{isDeckBPlaying ? "LIVE" : "CUE"}</span>
                        </button>
                        <button
                          onClick={() => setDeckBBpm((b) => Math.min(180, b + 1))}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-white/70"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive DJ Crossfader */}
                  <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-[#00F2FE]">Deck A ({100 - crossfader}%)</span>
                      <span className="text-white/40 uppercase tracking-wider text-[9px]">
                        Crossfader
                      </span>
                      <span className="text-[#FF007F]">Deck B ({crossfader}%)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={crossfader}
                      onChange={(e) => setCrossfader(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* DJ Sound FX Sampler Pads (Synthesized Web Audio + Haptics) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white/80">DJ Sound FX Sampler</span>
                      <span className="text-[9px] text-[#8B5CF6] font-mono">Real-Time Audio</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Airhorn", type: "airhorn" as const, color: "text-[#FFB300]" },
                        { label: "Laser Drop", type: "laser" as const, color: "text-[#00F2FE]" },
                        { label: "Scratch", type: "scratch" as const, color: "text-[#FF007F]" },
                        { label: "808 Kick", type: "kick" as const, color: "text-[#8B5CF6]" },
                      ].map((sfx) => (
                        <button
                          key={sfx.label}
                          onClick={() => {
                            playDjSfx(sfx.type);
                            triggerHaptic();
                          }}
                          className="py-2.5 px-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 active:border-[#8B5CF6] active:scale-90 transition flex flex-col items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Zap className={`w-3.5 h-3.5 ${sfx.color}`} />
                          <span className="text-[9px] font-bold text-white truncate max-w-full">
                            {sfx.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SEARCH SCREEN */}
              {currentScreen === "search" && (
                <div className="p-4 space-y-3.5">
                  {/* Search Input Bar with Clear & Enter support */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          addToSearchHistory(searchQuery.trim());
                        }
                      }}
                      placeholder="Search songs, artists, albums..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#111322] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00F2FE]"
                    />
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-white/60 flex items-center justify-center transition cursor-pointer"
                        title="Clear query"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    ) : null}
                  </div>

                  {/* SEARCH HISTORY SECTION */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-[#00F2FE]" />
                        <span>Search History</span>
                        {searchHistory.length > 0 && (
                          <span className="text-[8.5px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40 font-mono">
                            {searchHistory.length}
                          </span>
                        )}
                      </span>
                      {searchHistory.length > 0 && (
                        <button
                          onClick={clearAllSearchHistory}
                          className="text-[9.5px] text-white/40 hover:text-red-400 font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Clear History</span>
                        </button>
                      )}
                    </div>

                    {searchHistory.length === 0 ? (
                      <div className="py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-white/30 text-[10px]">
                        No recent search history yet
                      </div>
                    ) : (
                      <div className="space-y-1 bg-white/[0.02] border border-white/5 rounded-2xl p-1.5">
                        {searchHistory.slice(0, 5).map((term) => (
                          <div
                            key={term}
                            onClick={() => {
                              triggerHaptic();
                              setSearchQuery(term);
                              addToSearchHistory(term);
                            }}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] group cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-2 overflow-hidden">
                              <History className="w-3 h-3 text-[#00F2FE]/60 group-hover:text-[#00F2FE] flex-shrink-0 transition" />
                              <span className="text-[11px] text-white/80 group-hover:text-white truncate">
                                {term}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => removeFromSearchHistory(term, e)}
                                className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-white/10 transition cursor-pointer"
                                title="Delete from search history"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trending Search Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      Popular Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Arijit Singh", "Punjabi Pop", "Synthwave", "Alan Walker", "Diljit"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            triggerHaptic();
                            setSearchQuery(tag);
                            addToSearchHistory(tag);
                          }}
                          className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/70 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          <Search className="w-2.5 h-2.5 text-white/30" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">
                        {isSearching
                          ? "Searching..."
                          : searchQuery.trim()
                          ? `Results for "${searchQuery}" (${searchResults.length})`
                          : `Suggested Tracks (${searchResults.length})`}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.slice(0, 8).map((track) => (
                        <div
                          key={track.id}
                          onClick={() => {
                            triggerHaptic();
                            if (searchQuery.trim()) {
                              addToSearchHistory(searchQuery.trim());
                            } else {
                              addToSearchHistory(track.title);
                            }
                            onPlaySong(track);
                            setCurrentScreen("player");
                          }}
                          className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer group transition"
                        >
                          <div className="flex items-center space-x-2.5 overflow-hidden">
                            <img
                              src={track.thumbnail}
                              alt={track.title}
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-white truncate max-w-[190px] group-hover:text-[#FF007F] transition">
                                {track.title}
                              </p>
                              <p className="text-[10px] text-white/40 truncate max-w-[190px]">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                            <button
                              onClick={(e) => handleAddToQueue(track, e)}
                              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#00F2FE]/20 text-white/50 hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
                              title="Add to Queue"
                              aria-label="Add to Queue"
                            >
                              <ListPlus className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#00F2FE]/20 flex items-center justify-center text-white/60 group-hover:text-[#00F2FE] transition">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LISTENING HISTORY SCREEN */}
              {currentScreen === "history" && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentScreen("home")}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                        title="Back to Home"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-400" />
                        <span>Listening History</span>
                      </h3>
                    </div>
                    {historyList.length > 0 && (
                      <button
                        onClick={() => setHistoryList([])}
                        className="text-[10px] text-white/40 hover:text-red-400 font-semibold cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {historyList.length === 0 ? (
                    <div className="text-center py-16 text-white/40 text-xs space-y-2">
                      <History className="w-8 h-8 mx-auto text-white/20" />
                      <p className="font-semibold text-white/70">No history yet</p>
                      <p className="text-[10px] text-white/40">
                        Play songs from Home, Explore, or Party to build your listening history!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {historyList.map((track, i) => (
                        <div
                          key={`${track.id}-${i}`}
                          onClick={() => {
                            onPlaySong(track);
                            setCurrentScreen("player");
                          }}
                          className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer group transition"
                        >
                          <div className="flex items-center space-x-2.5 overflow-hidden">
                            <img
                              src={track.thumbnail}
                              alt={track.title}
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-white truncate max-w-[180px] group-hover:text-purple-400 transition">
                                {track.title}
                              </p>
                              <p className="text-[10px] text-white/40 truncate max-w-[180px]">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] text-[#00F2FE] font-mono">Played</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ARCHITECTURE HUB SCREEN */}
              {currentScreen === "arch" && (
                <div className="p-4 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#8B5CF6]" />
                      <span>Clean Architecture Hub</span>
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-[#111322] border border-[#00F2FE]/30 space-y-1">
                      <span className="text-[10px] font-bold text-[#00F2FE] block font-mono">
                        1. PRESENTATION LAYER
                      </span>
                      <p className="text-[11px] text-white/70">
                        Jetpack Compose Material3, GlassCard with blur filters, state hoisting via ViewModel & Kotlin StateFlow.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#111322] border border-[#FF007F]/30 space-y-1">
                      <span className="text-[10px] font-bold text-[#FF007F] block font-mono">
                        2. AUDIO ENGINE LAYER
                      </span>
                      <p className="text-[11px] text-white/70">
                        ExoPlayer Media3 with audio session equalizers, beat detection, and SoundPool for low-latency DJ scratching.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#111322] border border-[#8B5CF6]/30 space-y-1">
                      <span className="text-[10px] font-bold text-[#8B5CF6] block font-mono">
                        3. DATA & LOCAL PERSISTENCE
                      </span>
                      <p className="text-[11px] text-white/70">
                        Room Database for offline listening history, Retrofit with OkHttp interceptors for stream routing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ANDROID SETTINGS SCREEN (Triggered by clicking MJ Logo) */}
              {currentScreen === "settings" && (
                <div className="p-4 space-y-4 text-xs">
                  {/* Top Bar with Back Arrow */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => setCurrentScreen("home")}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition active:scale-95 cursor-pointer"
                        title="Back to Home"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                          <span>Settings</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 font-bold">
                            MJ CORE
                          </span>
                        </h3>
                        <p className="text-[9px] text-white/50">MJ PULSE Android App Preferences</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] p-0.5">
                      <div className="w-full h-full rounded-full bg-[#111322] flex items-center justify-center text-[10px] font-bold text-[#00F2FE]">
                        MJ
                      </div>
                    </div>
                  </div>

                  {/* VIP Profile Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b1435] to-[#0d1226] border border-[#8B5CF6]/30 shadow-lg relative overflow-hidden">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#FF007F] p-0.5 flex-shrink-0">
                        <div className="w-full h-full rounded-[14px] bg-[#0c0d16] flex items-center justify-center text-sm font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#00F2FE] to-[#FF007F]">
                          MJ
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-white">Mahendra (Admin)</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 font-bold">
                            PRO
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 truncate">mahendrapratapsinghjatav595@gmail.com</p>
                        <p className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Lossless Master Streaming Active</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lossless Hi-Fi Audio & Streaming Bitrate */}
                  <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Radio className="w-4 h-4 text-[#00F2FE]" />
                        <span className="font-bold text-white text-[11px]">Audio Fidelity & Bitrate</span>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{audioBitrate === "320" ? "320 kbps Lossless Hi-Fi" : `${audioBitrate} kbps`}</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        {
                          val: "320",
                          title: "320 kbps Lossless Hi-Fi",
                          badge: "Studio Master",
                          desc: "Bit-perfect studio fidelity, 24-bit DAC passthrough & full dynamic range",
                        },
                        {
                          val: "256",
                          title: "256 kbps High Fidelity",
                          badge: "Crisp AAC",
                          desc: "Optimized clear sound with rich harmonic balance",
                        },
                        {
                          val: "128",
                          title: "128 kbps Data Saver",
                          badge: "Standard",
                          desc: "Bandwidth efficient streaming for low network areas",
                        },
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => {
                            setAudioBitrate(item.val);
                            triggerHaptic();
                          }}
                          className={`w-full p-2.5 rounded-xl text-left transition cursor-pointer border flex items-center justify-between ${
                            audioBitrate === item.val
                              ? "bg-gradient-to-r from-[#00F2FE]/15 to-[#8B5CF6]/15 border-[#00F2FE] shadow-md shadow-[#00F2FE]/10"
                              : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs font-bold ${
                                  audioBitrate === item.val ? "text-[#00F2FE]" : "text-white"
                                }`}
                              >
                                {item.title}
                              </span>
                              <span
                                className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                                  audioBitrate === item.val
                                    ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                                    : "bg-white/10 text-white/50"
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[9px] text-white/50">{item.desc}</p>
                          </div>
                          {audioBitrate === item.val && (
                            <Check className="w-4 h-4 text-[#00F2FE] flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Hi-Res Offline Engine Info */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/50 font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>320 kbps Offline Ready</span>
                      </span>
                      <span>Dolby Atmos Master</span>
                    </div>
                  </div>

                  {/* Equalizer & Audio Engine */}
                  <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-[#FF007F]" />
                        <span className="font-bold text-white text-[11px]">Equalizer Profile</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#FF007F] capitalize">{equalizerPreset}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "bass", label: "Bass Boost (MJ Special)" },
                        { id: "edm", label: "Club & EDM Punch" },
                        { id: "vocal", label: "Vocal Clarity" },
                        { id: "rock", label: "Rock Arena" },
                        { id: "treble", label: "Treble & Air" },
                        { id: "flat", label: "Studio Flat" },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            applyEqualizerPreset(preset.id);
                            triggerHaptic();
                          }}
                          className={`p-2 rounded-xl text-[10px] text-left transition cursor-pointer border ${
                            equalizerPreset === preset.id
                              ? "bg-[#FF007F]/20 border-[#FF007F] text-white font-bold shadow-sm shadow-[#FF007F]/20"
                              : "bg-white/5 border-transparent text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Open Now Playing Equalizer subview button */}
                    <button
                      onClick={() => {
                        setCurrentScreen("player");
                        setPlayerSubView("equalizer");
                        triggerHaptic();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#00F2FE]/15 via-[#8B5CF6]/15 to-[#FF007F]/15 border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>Open 5-Band Studio EQ in Now Playing</span>
                    </button>

                    {/* Toggles */}
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-white">Bass Haptic Sync</p>
                          <p className="text-[9px] text-white/40">Vibrate phone on beat drops</p>
                        </div>
                        <button
                          onClick={() => setHapticSyncEnabled(!hapticSyncEnabled)}
                          className={`w-9 h-5 rounded-full p-0.5 transition cursor-pointer ${
                            hapticSyncEnabled ? "bg-[#00F2FE]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-black transition transform ${
                              hapticSyncEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-white">Gapless Playback</p>
                          <p className="text-[9px] text-white/40">Zero delay between continuous songs</p>
                        </div>
                        <button
                          onClick={() => setGaplessPlayback(!gaplessPlayback)}
                          className={`w-9 h-5 rounded-full p-0.5 transition cursor-pointer ${
                            gaplessPlayback ? "bg-[#FF007F]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-black transition transform ${
                              gaplessPlayback ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cache & Local Storage */}
                  <div className="p-3.5 rounded-2xl bg-[#111322] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trash2 className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white text-[11px]">Offline Cache Storage</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/60">{cacheSize}</span>
                    </div>
                    <p className="text-[9px] text-white/40">
                      Temporary cached audio streams and artwork for faster local playback.
                    </p>
                    <button
                      onClick={handleClearAppCache}
                      disabled={isClearingCache}
                      className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 transition flex items-center justify-center gap-1.5 text-[10px] font-bold text-white border border-white/10 cursor-pointer disabled:opacity-50"
                    >
                      {isClearingCache ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Clearing Cache...</span>
                        </>
                      ) : cacheClearedSuccess ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Cache Cleared Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 text-white/60" />
                          <span>Clear App Cache</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* App Version & Architecture info */}
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-center">
                    <p className="text-[10px] font-bold text-white">MJ PULSE Android App</p>
                    <p className="text-[9px] text-white/40 font-mono">v2.4.2 • Kotlin Compose • Clean Arch</p>
                    <p className="text-[8px] text-[#00F2FE]/70">Engineered by Mahendra</p>
                  </div>
                </div>
              )}
            </div>

            {/* DOCKED BOTTOM MINI PLAYER (visible when not on full player screen) */}
            {currentScreen !== "player" && currentTrack && (
              <div
                onClick={() => setCurrentScreen("player")}
                className="h-14 bg-[#111322]/95 backdrop-blur-md border-t border-white/10 px-3 flex items-center justify-between cursor-pointer hover:bg-[#16192e] transition"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-white truncate max-w-[160px]">
                      {currentTrack.title}
                    </p>
                    <p className="text-[9px] text-white/40 truncate max-w-[160px]">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlayPause();
                    }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#FF007F] text-black flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNextTrack();
                    }}
                    className="p-1.5 text-white/60 hover:text-white"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ANDROID BOTTOM NAVIGATION BAR */}
            <div className="h-16 bg-[#080911] border-t border-white/5 px-3 flex items-center justify-around z-40">
              <button
                onClick={() => setCurrentScreen("home")}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                  currentScreen === "home" ? "text-[#00F2FE]" : "text-white/40 hover:text-white"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px] font-semibold">Home</span>
              </button>

              <button
                onClick={() => setCurrentScreen("search")}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                  currentScreen === "search" ? "text-[#00F2FE]" : "text-white/40 hover:text-white"
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="text-[9px] font-semibold">Search</span>
              </button>

              <button
                onClick={() => setCurrentScreen("party")}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                  currentScreen === "party" ? "text-[#FFB300] font-bold" : "text-white/40 hover:text-white"
                }`}
              >
                <Flame className="w-4 h-4" />
                <span className="text-[9px] font-semibold">Party & DJ</span>
              </button>

              <button
                onClick={() => setCurrentScreen("history")}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                  currentScreen === "history" ? "text-purple-400 font-bold" : "text-white/40 hover:text-white"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="text-[9px] font-semibold">History</span>
              </button>
            </div>

            {/* Android Bottom Gesture Bar */}
            <div className="h-4 bg-[#080911] flex items-center justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-white/30" />
            </div>

            {/* MY PLAYLIST QUICK ACTION BOTTOM SHEET (DOWNLOADS DEFAULT) */}
            {showMyPlaylistSheet && (
              <div
                className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
                onClick={() => setShowMyPlaylistSheet(false)}
              >
                <div
                  className="bg-[#111322] border-t border-[#FF007F]/40 rounded-t-[28px] p-4 flex flex-col max-h-[85%] shadow-2xl shadow-black/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Sheet Drag Pill */}
                  <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-2.5" />

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      {sheetSelectedPlaylist ? (
                        <button
                          onClick={() => setSheetSelectedPlaylist(null)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                          title="Back to Playlists"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF007F] to-[#00F2FE] flex items-center justify-center shadow-md shadow-[#FF007F]/20">
                          <ListMusic className="w-4 h-4 text-black" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>
                            {sheetSelectedPlaylist === "downloads"
                              ? "Downloads"
                              : sheetSelectedPlaylist
                              ? sheetSelectedPlaylist.title
                              : "My Playlists"}
                          </span>
                          {sheetSelectedPlaylist === "downloads" && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                              OFFLINE
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-white/50">
                          {sheetSelectedPlaylist === "downloads"
                            ? "Offline Lossless Tracks • 320kbps"
                            : sheetSelectedPlaylist
                            ? sheetSelectedPlaylist.description
                            : "Offline downloads & custom collections"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMyPlaylistSheet(false)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* COLUMN LIST VIEW (WHEN NO DETAIL SELECTED) */}
                  {!sheetSelectedPlaylist && (
                    <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-0.5 scrollbar-thin">
                      {/* 1. DOWNLOADS ITEM (STYLED EXACTLY LIKE MY FAVORITES, NEON PARTY...) */}
                      <div
                        onClick={() => {
                          triggerHaptic();
                          setSheetSelectedPlaylist("downloads");
                        }}
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#00F2FE]/40 flex items-center justify-between cursor-pointer group transition"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                            <img
                              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500"
                              alt="Downloads"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                              <Download className="w-4 h-4 text-[#00F2FE]" />
                            </div>
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-white truncate max-w-[180px] group-hover:text-[#00F2FE] transition flex items-center gap-1.5">
                              <span>Downloads</span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                                Offline
                              </span>
                            </p>
                            <p className="text-[9.5px] text-white/40 truncate">
                              {activeTracks.filter((t) => downloadedTrackIds.has(t.id)).length} songs • Offline saved tracks • 320kbps Lossless
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic();
                            const dlList = activeTracks.filter((t) => downloadedTrackIds.has(t.id));
                            if (dlList.length > 0) {
                              onPlaySong(dlList[0]);
                              setShowMyPlaylistSheet(false);
                              setCurrentScreen("player");
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#00F2FE]/20 flex items-center justify-center text-white/40 hover:text-[#00F2FE] transition cursor-pointer"
                          title="Play Downloads"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>
                      </div>

                      {/* 2. REGULAR PLAYLISTS (My Favorites, Neon Party, Desi Hip-Hop, Midnight Chill...) */}
                      {playlists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => {
                            triggerHaptic();
                            setSheetSelectedPlaylist(pl);
                          }}
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#FF007F]/40 flex items-center justify-between cursor-pointer group transition"
                        >
                          <div className="flex items-center space-x-2.5 overflow-hidden">
                            <img
                              src={pl.coverUrl}
                              alt={pl.title}
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-white truncate max-w-[180px] group-hover:text-[#FF007F] transition">
                                {pl.title}
                              </p>
                              <p className="text-[9.5px] text-white/40 truncate">
                                {pl.songCount} songs • {pl.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic();
                              if (activeTracks.length > 0) {
                                onPlaySong(activeTracks[0]);
                                setShowMyPlaylistSheet(false);
                                setCurrentScreen("player");
                              }
                            }}
                            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF007F]/20 flex items-center justify-center text-white/40 hover:text-[#FF007F] transition cursor-pointer"
                            title={`Play ${pl.title}`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                        </div>
                      ))}

                      {/* 3. AT THE VERY END: CREATE NEW PLAYLIST BUTTON */}
                      <button
                        onClick={() => setShowCreatePlaylistModal(true)}
                        className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-dashed border-white/20 hover:border-[#FF007F]/50 text-white/60 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-bold transition cursor-pointer mt-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#FF007F]" />
                        <span>Create New Playlist</span>
                      </button>
                    </div>
                  )}

                  {/* DETAIL VIEW: DOWNLOADS EXPANDED */}
                  {sheetSelectedPlaylist === "downloads" && (
                    <div className="flex-1 overflow-y-auto space-y-2.5 pt-2 pr-0.5 scrollbar-thin animate-in fade-in duration-150">
                      {/* Banner */}
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE]/10 via-[#FF007F]/10 to-transparent border border-[#00F2FE]/20 flex items-center justify-between">
                        <div>
                          <p className="text-[10.5px] font-bold text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Offline Lossless Library</span>
                          </p>
                          <p className="text-[9px] text-white/50">
                            Plays without internet connection • 320kbps
                          </p>
                        </div>
                        <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          READY
                        </span>
                      </div>

                      {/* Play All & Shuffle */}
                      {activeTracks.filter((t) => downloadedTrackIds.has(t.id)).length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const list = activeTracks.filter((t) => downloadedTrackIds.has(t.id));
                              if (list.length > 0) {
                                onPlaySong(list[0]);
                                setShowMyPlaylistSheet(false);
                                setCurrentScreen("player");
                              }
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#00F2FE] text-black font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-[#FF007F]/20 active:scale-98 transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play All Downloads</span>
                          </button>
                          <button
                            onClick={() => {
                              const list = activeTracks.filter((t) => downloadedTrackIds.has(t.id));
                              if (list.length > 0) {
                                const rand = list[Math.floor(Math.random() * list.length)];
                                onPlaySong(rand);
                                setShowMyPlaylistSheet(false);
                                setCurrentScreen("player");
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Shuffle className="w-3.5 h-3.5 text-[#00F2FE]" />
                            <span>Shuffle</span>
                          </button>
                        </div>
                      )}

                      {/* Downloaded Songs List */}
                      {activeTracks.filter((t) => downloadedTrackIds.has(t.id)).length === 0 ? (
                        <div className="text-center py-8 text-white/40 text-xs space-y-2">
                          <Download className="w-7 h-7 mx-auto text-white/20" />
                          <p className="font-semibold text-white/70">No offline downloads yet</p>
                          <p className="text-[10px] text-white/40">
                            Download songs to play them anywhere offline!
                          </p>
                          <button
                            onClick={() => {
                              setDownloadedTrackIds(new Set(activeTracks.slice(0, 3).map((t) => t.id)));
                            }}
                            className="px-3 py-1 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 text-[10px] font-bold cursor-pointer"
                          >
                            + Download 3 Sample Hits
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {activeTracks
                            .filter((t) => downloadedTrackIds.has(t.id))
                            .map((track, i) => {
                              const isThisPlaying =
                                (currentTrack?.id === track.id || (!currentTrack && track.id === activeTrack.id)) &&
                                isPlaying;
                              return (
                                <div
                                  key={`dl_${track.id}_${i}`}
                                  onClick={() => {
                                    onPlaySong(track);
                                    setShowMyPlaylistSheet(false);
                                    setCurrentScreen("player");
                                  }}
                                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between cursor-pointer group transition"
                                >
                                  <div className="flex items-center space-x-2.5 overflow-hidden">
                                    <div className="w-9 h-9 rounded-lg overflow-hidden relative flex-shrink-0">
                                      <img
                                        src={track.thumbnail}
                                        alt={track.title}
                                        className="w-full h-full object-cover"
                                      />
                                      {isThisPlaying && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                          <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="text-[11px] font-bold text-white truncate max-w-[155px] group-hover:text-[#FF007F] transition">
                                        {track.title}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-[9px] text-white/50">
                                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                          <Check className="w-2.5 h-2.5" /> Offline
                                        </span>
                                        <span>•</span>
                                        <span className="font-mono">320kbps Lossless</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerHaptic();
                                        setDownloadedTrackIds((prev) => {
                                          const next = new Set(prev);
                                          next.delete(track.id);
                                          return next;
                                        });
                                      }}
                                      title="Remove from downloads"
                                      className="p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/70 group-hover:text-[#00F2FE]">
                                      <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DETAIL VIEW: CUSTOM PLAYLIST EXPANDED */}
                  {sheetSelectedPlaylist && sheetSelectedPlaylist !== "downloads" && (
                    <div className="flex-1 overflow-y-auto space-y-2.5 pt-2 pr-0.5 scrollbar-thin animate-in fade-in duration-150">
                      {/* Play All & Shuffle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (activeTracks.length > 0) {
                              onPlaySong(activeTracks[0]);
                              setShowMyPlaylistSheet(false);
                              setCurrentScreen("player");
                            }
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#00F2FE] text-black font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-[#FF007F]/20 active:scale-98 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play All</span>
                        </button>
                        <button
                          onClick={() => {
                            if (activeTracks.length > 0) {
                              const rand = activeTracks[Math.floor(Math.random() * activeTracks.length)];
                              onPlaySong(rand);
                              setShowMyPlaylistSheet(false);
                              setCurrentScreen("player");
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Shuffle className="w-3.5 h-3.5 text-[#00F2FE]" />
                          <span>Shuffle</span>
                        </button>
                      </div>

                      {/* Songs in this playlist */}
                      <div className="space-y-1.5">
                        {activeTracks.slice(0, sheetSelectedPlaylist.songCount || 6).map((track, i) => (
                          <div
                            key={`pl_song_${track.id}_${i}`}
                            onClick={() => {
                              onPlaySong(track);
                              setShowMyPlaylistSheet(false);
                              setCurrentScreen("player");
                            }}
                            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between cursor-pointer group transition"
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <span className="w-4 text-center text-[10px] text-white/40 font-mono">
                                {i + 1}
                              </span>
                              <img
                                src={track.thumbnail}
                                alt={track.title}
                                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-bold text-white truncate max-w-[170px] group-hover:text-[#FF007F] transition">
                                  {track.title}
                                </p>
                                <p className="text-[9.5px] text-white/40 truncate max-w-[170px]">
                                  {track.artist}
                                </p>
                              </div>
                            </div>
                            <Play className="w-3.5 h-3.5 text-white/40 group-hover:text-[#00F2FE] flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create Playlist Modal (Inside Phone Frame) */}
            {showCreatePlaylistModal && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#111322] border border-[#FF007F]/40 rounded-3xl p-5 w-full max-w-[320px] space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ListMusic className="w-4 h-4 text-[#FF007F]" />
                      <span>New Playlist</span>
                    </h4>
                    <button
                      onClick={() => setShowCreatePlaylistModal(false)}
                      className="p-1 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-white/60 font-semibold block mb-1">
                        Playlist Name
                      </label>
                      <input
                        type="text"
                        value={newPlaylistTitle}
                        onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        placeholder="e.g. Gym Heavy Bass, Late Night..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF007F]"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-white/60 font-semibold block mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        placeholder="e.g. High tempo motivation songs"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF007F]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setShowCreatePlaylistModal(false)}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/60 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistTitle.trim()}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#00F2FE] text-black font-bold text-xs disabled:opacity-40 shadow-lg shadow-[#FF007F]/20"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DJ DECK SONG PICKER BOTTOM SHEET MODAL (DECK A & DECK B) */}
            {selectingDeck && (
              <div 
                className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
                onClick={() => setSelectingDeck(null)}
              >
                <div
                  className={`bg-[#111322] border-t ${
                    selectingDeck === "A" ? "border-[#00F2FE]/40" : "border-[#FF007F]/40"
                  } rounded-t-[28px] p-4 flex flex-col max-h-[88%] shadow-2xl shadow-black/80`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Sheet Drag Pill */}
                  <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-2.5" />

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selectingDeck === "A"
                            ? "bg-gradient-to-tr from-[#00F2FE] to-[#3B82F6]"
                            : "bg-gradient-to-tr from-[#FF007F] to-[#8B5CF6]"
                        }`}
                      >
                        <Disc3 className="w-4 h-4 text-white animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Select Track for Deck {selectingDeck}</span>
                          <span
                            className={`text-[8px] px-1.5 py-0.5 rounded-full border font-mono font-bold ${
                              selectingDeck === "A"
                                ? "bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/30"
                                : "bg-[#FF007F]/20 text-[#FF007F] border-[#FF007F]/30"
                            }`}
                          >
                            {selectingDeck === "A" ? "MASTER" : "CUE"}
                          </span>
                        </h4>
                        <p className="text-[10px] text-white/50">
                          {selectingDeck === "A"
                            ? "Load any song into Deck A master turntable"
                            : "Mix any song into Deck B turntable"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectingDeck(null)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search inside Deck Picker */}
                  <div className="mt-2.5 relative">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deckSearchQuery}
                      onChange={(e) => setDeckSearchQuery(e.target.value)}
                      placeholder={`Search songs or artists for Deck ${selectingDeck}...`}
                      className={`w-full pl-8 pr-8 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none ${
                        selectingDeck === "A" ? "focus:border-[#00F2FE]" : "focus:border-[#FF007F]"
                      }`}
                    />
                    {deckSearchQuery && (
                      <button
                        onClick={() => setDeckSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none">
                    {["All", "Trending", "Party EDM", "Bollywood", "Bass Boost"].map((cat) => {
                      const isCatActive = deckGenreFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setDeckGenreFilter(cat);
                            if (cat === "All") {
                              setDeckSearchResults(activeTracks);
                            } else if (cat === "Party EDM") {
                              const edmTracks = genreTracksCache["EDM"] || GENRE_PRESET_TRACKS["EDM"] || activeTracks;
                              setDeckSearchResults(edmTracks);
                            } else if (cat === "Bass Boost") {
                              const bassTracks = genreTracksCache["Bass Boost"] || GENRE_PRESET_TRACKS["Bass Boost"] || activeTracks;
                              setDeckSearchResults(bassTracks);
                            } else {
                              const filtered = activeTracks.filter(
                                (t) =>
                                  t.genre?.toLowerCase() === cat.toLowerCase() ||
                                  t.title.toLowerCase().includes(cat.toLowerCase()) ||
                                  t.artist.toLowerCase().includes(cat.toLowerCase()) ||
                                  (t.album && t.album.toLowerCase().includes(cat.toLowerCase()))
                              );
                              setDeckSearchResults(filtered.length > 0 ? filtered : activeTracks);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap transition font-medium ${
                            isCatActive
                              ? selectingDeck === "A"
                                ? "bg-[#00F2FE] text-black font-bold"
                                : "bg-[#FF007F] text-black font-bold"
                              : "bg-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Song List */}
                  <div className="overflow-y-auto space-y-1.5 flex-1 pr-0.5 max-h-[340px] scrollbar-thin mt-1">
                    {isSearchingDeck ? (
                      <div className="py-8 text-center text-xs text-white/40 flex flex-col items-center gap-2">
                        <div
                          className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                            selectingDeck === "A" ? "border-[#00F2FE]" : "border-[#FF007F]"
                          }`}
                        />
                        <span>Searching tracks...</span>
                      </div>
                    ) : deckSearchResults.length === 0 ? (
                      <div className="py-8 text-center text-xs text-white/40">
                        No songs found for &quot;{deckSearchQuery}&quot;
                      </div>
                    ) : (
                      deckSearchResults.map((t) => {
                        const isLoaded =
                          selectingDeck === "A"
                            ? activeTrack.id === t.id
                            : deckBTrack?.id === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              if (selectingDeck === "A") {
                                onPlaySong(t);
                              } else {
                                setDeckBTrack(t);
                                setIsDeckBPlaying(true);
                              }
                              setSelectingDeck(null);
                              playDjSfx("scratch");
                              triggerHaptic();
                            }}
                            className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition border ${
                              isLoaded
                                ? selectingDeck === "A"
                                  ? "bg-[#00F2FE]/20 border-[#00F2FE]"
                                  : "bg-[#FF007F]/20 border-[#FF007F]"
                                : "bg-white/5 hover:bg-white/10 border-transparent"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <img
                                src={t.thumbnail}
                                alt={t.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-bold text-white truncate max-w-[145px]">
                                  {t.title}
                                </p>
                                <p className="text-[9px] text-white/50 truncate max-w-[145px]">
                                  {t.artist}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                                isLoaded
                                  ? selectingDeck === "A"
                                    ? "bg-[#00F2FE] text-black shadow-md shadow-[#00F2FE]/30"
                                    : "bg-[#FF007F] text-black shadow-md shadow-[#FF007F]/30"
                                  : selectingDeck === "A"
                                  ? "bg-white/10 text-white hover:bg-[#00F2FE] hover:text-black"
                                  : "bg-white/10 text-white hover:bg-[#FF007F] hover:text-black"
                              }`}
                            >
                              {isLoaded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>LOADED</span>
                                </>
                              ) : (
                                <>
                                  <Disc3 className="w-3 h-3" />
                                  <span>LOAD</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
