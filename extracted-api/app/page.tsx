"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  Heart,
  Sparkles,
  Sliders,
  Smartphone,
  Zap,
  Music,
  Lock,
  LogIn,
  LogOut,
  CheckCircle2,
  Headphones,
  ListMusic,
  X,
  Radio,
  Share2,
  Layers,
  Activity,
  Home,
  LayoutDashboard,
  Disc,
  Flame,
  Volume1,
  User as UserIcon,
  Shield,
  Code,
  Palette,
  ExternalLink,
  ChevronRight,
  Download,
  FileText,
  ShieldCheck,
  RotateCcw,
  Sun,
  Moon,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Compass,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Square,
  Rewind,
  FastForward
} from "lucide-react";
import { BROWSE_CATEGORIES_DATA, CategoryGroup, GroupItem, SerialPartition } from "../lib/browseData";
import {
  getPartitionsForGroup,
  isTrackMatchingPartition,
  sortSerialTracks,
  categoryFilter,
  extractEpisodeNumber,
} from "../lib/PartitionCatalog";
import { getAestheticArtwork } from "../lib/ArtworkEngine";
import { auth, googleProvider, facebookProvider, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  FacebookAuthProvider,
} from "firebase/auth";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  streamUrl?: string;
  duration?: number;
  durationFormatted?: string;
  source?: string;
}

interface LyricLine {
  timeSec: number;
  text: string;
}

type TabType = "home" | "search" | "partymode" | "dashboard";

interface PlaylistMeta {
  id: string;
  title: string;
  subtitle: string;
  query: string;
  coverUrl: string;
  badge?: string;
}

const ALL_PLAYLISTS_POOL: PlaylistMeta[] = [
  // 1. Standup Comedy (Matching mobile app)
  {
    id: "pl-standup-zakir",
    title: "Zakir Khan Specials",
    subtitle: "Haq Se Single, Chacha Vidhayak & Kaksha Gyarvi",
    query: "Zakir Khan",
    coverUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500&auto=format&fit=crop&q=80",
    badge: "COMEDY",
  },
  {
    id: "pl-standup-bassi",
    title: "Anubhav Singh Bassi",
    subtitle: "Hostel, Cheating, Roommate & Flatmates",
    query: "Anubhav Singh Bassi",
    coverUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80",
    badge: "COMEDY",
  },
  {
    id: "pl-standup-upmanyu",
    title: "Abhishek Upmanyu",
    subtitle: "Friends, Crime, Delhi & Relatable Jokes",
    query: "Abhishek Upmanyu",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
    badge: "COMEDY",
  },
  {
    id: "pl-standup-munawar",
    title: "Munawar Faruqui",
    subtitle: "Dongri to Nowhere & Standup Specials",
    query: "Munawar Faruqui",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    badge: "COMEDY",
  },
  {
    id: "pl-standup-harsh",
    title: "Harsh Gujral Specials",
    subtitle: "Kanpuria Swag, Crowd Work & Relatable Comedy",
    query: "Harsh Gujral",
    coverUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&auto=format&fit=crop&q=80",
    badge: "COMEDY",
  },

  // 2. Horror Stories & Audio Thrillers (Matching mobile app)
  {
    id: "pl-horror-haveli",
    title: "Bhootiya Haveli (Series)",
    subtitle: "Haunted Mansion Chapters & Screams",
    query: "Bhootiya Haveli",
    coverUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&auto=format&fit=crop&q=80",
    badge: "HORROR",
  },
  {
    id: "pl-horror-midnight",
    title: "Midnight Horror Show",
    subtitle: "12 AM Chilling Tales of Darkness",
    query: "Horror Stories Hindi",
    coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80",
    badge: "HORROR",
  },
  {
    id: "pl-horror-khooni",
    title: "Khooni Raat & Kuan",
    subtitle: "Ancient Cursed Well & Bloodstained Nights",
    query: "Khooni Horror Hindi",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    badge: "HORROR",
  },
  {
    id: "pl-horror-paranormal",
    title: "Real Paranormal Cases",
    subtitle: "True Witness Encounters & Ghost Investigations",
    query: "Paranormal Stories Hindi",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    badge: "HORROR",
  },

  // 3. Podcasts & Talk Shows (Matching mobile app)
  {
    id: "pl-podcast-trs",
    title: "The Ranveer Show (TRS)",
    subtitle: "Spiritual, Aliens & Deep Conversations",
    query: "The Ranveer Show",
    coverUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80",
    badge: "PODCAST",
  },
  {
    id: "pl-podcast-shamani",
    title: "Raj Shamani Figuring Out",
    subtitle: "Business, Startups & Unfiltered Founder Talks",
    query: "Raj Shamani",
    coverUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format&fit=crop&q=80",
    badge: "PODCAST",
  },
  {
    id: "pl-podcast-crime",
    title: "Crime Investigation Hindi",
    subtitle: "Real Crime Files & Psychological Audio",
    query: "Crime Stories Hindi",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80",
    badge: "PODCAST",
  },

  // 4. Audio Stories & Hindi Literature (Matching mobile app)
  {
    id: "pl-story-premchand",
    title: "Munshi Premchand Stories",
    subtitle: "Godaan, Kafan, Idgah & Namak Ka Daroga",
    query: "Premchand Kahani",
    coverUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=80",
    badge: "STORY",
  },
  {
    id: "pl-story-panchatantra",
    title: "Panchatantra Kahaniyaan",
    subtitle: "Ancient Wisdom Fables & Moral Audio Tales",
    query: "Panchatantra Hindi",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    badge: "STORY",
  },
  {
    id: "pl-story-akbarbirbal",
    title: "Akbar Birbal Kisse",
    subtitle: "Witty Royal Court Tales & Clever Humor",
    query: "Akbar Birbal Hindi",
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80",
    badge: "STORY",
  },

  // 5. Devotional & Bhakti Sagar (Matching mobile app)
  {
    id: "pl-devotional-peace",
    title: "Bhakti Sagar & Peace",
    subtitle: "Morning bhajans & serene spiritual tunes",
    query: "Bhakti Sagar Bhajan",
    coverUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&auto=format&fit=crop&q=80",
    badge: "DEVOTIONAL",
  },
  {
    id: "pl-ram-katha",
    title: "Sundarkand & Ram Katha",
    subtitle: "Shri Ram Charitmanas & Chaupai",
    query: "Sundarkand Path",
    coverUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
    badge: "BHAKTI",
  },
  {
    id: "pl-shiv-bhajan",
    title: "Shiv Shankar Mahadev",
    subtitle: "Shiv Tandav Stotram & Mahamrityunjaya",
    query: "Shiv Bhajan Mahadev",
    coverUrl: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500&auto=format&fit=crop&q=80",
    badge: "BHAKTI",
  },
  {
    id: "pl-hanuman-chalisa",
    title: "Hanuman Chalisa 108x",
    subtitle: "Sankat Mochan & Powerful Chants",
    query: "Hanuman Chalisa Hariharan",
    coverUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&auto=format&fit=crop&q=80",
    badge: "BHAKTI",
  },

  // 6. Music Blockbusters & Trending Vaults
  {
    id: "pl-global",
    title: "Global Top 50 Hits",
    subtitle: "Chart-topping worldwide anthems",
    query: "Global Top 50 Hits",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    badge: "GLOBAL",
  },
  {
    id: "pl-bollywood-romance",
    title: "Bollywood Romantic",
    subtitle: "Arijit Singh, Atif Aslam & Pritam",
    query: "Top Bollywood Hindi Romantic Hits",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    badge: "TRENDING",
  },
  {
    id: "pl-desi-hiphop",
    title: "Desi Hip Hop Wave",
    subtitle: "Divine, Seedhe Maut, KR$NA & Stan",
    query: "Desi Hip Hop Underground Hits",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    badge: "VIRAL",
  },
  {
    id: "pl-punjabi-beats",
    title: "New Punjabi Beats",
    subtitle: "Diljit, Karan Aujla, Shubh & AP",
    query: "Latest Punjabi Chartbusters",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    badge: "PARTY",
  },
  {
    id: "pl-lofi-india",
    title: "Chill Lo-Fi India",
    subtitle: "Late night soulful acoustic melodies",
    query: "Chill Lo-Fi India Midnight",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
    badge: "LO-FI",
  },
  {
    id: "pl-90s-classics",
    title: "90s Hindi Classics",
    subtitle: "Kumar Sanu, Alka Yagnik & Udit",
    query: "90s Bollywood Evergreen Hits",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    badge: "RETRO",
  },
  {
    id: "pl-reels-viral",
    title: "Instagram Trending Reels",
    subtitle: "Viral sounds taking over feeds",
    query: "Instagram Trending Reels Songs India",
    coverUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80",
    badge: "HOT",
  },
  {
    id: "pl-cyberpunk-edm",
    title: "Cyber Rave & EDM",
    subtitle: "High-octane synthwave & drop anthems",
    query: "EDM Festival Club Anthems",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
    badge: "BASS",
  },
  {
    id: "pl-sufi-ghazals",
    title: "Soulful Sufi & Ghazals",
    subtitle: "Nusrat, Rahat Fateh Ali & Jagjit Singh",
    query: "Best Sufi Songs Hindi",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=80",
    badge: "SOUL",
  },
  {
    id: "pl-workout-beast",
    title: "Gym Beast Motivation",
    subtitle: "Adrenaline pumping high-BPM tracks",
    query: "Gym Workout Motivation Songs",
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80",
    badge: "ENERGY",
  },
  {
    id: "pl-south-gold",
    title: "South Cinema Hits",
    subtitle: "Anirudh, AR Rahman & Devi Sri Prasad",
    query: "Top South Indian Cinema Hits",
    coverUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80",
    badge: "CINEMA",
  },
  {
    id: "pl-coke-studio",
    title: "Coke Studio Anthems",
    subtitle: "Ali Sethi, Abida Parveen & Shae Gill",
    query: "Coke Studio Best Hits",
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80",
    badge: "FUSION",
  },
  {
    id: "pl-haryanvi-swag",
    title: "Haryanvi Power Hits",
    subtitle: "Masoom Sharma, Renuka Panwar & Gulzaar",
    query: "Top Trending Haryanvi Songs",
    coverUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&auto=format&fit=crop&q=80",
    badge: "DESI",
  },
  {
    id: "pl-bhojpuri-hits",
    title: "Bhojpuri Dhamaka",
    subtitle: "Pawan Singh & Khesari Lal Superhits",
    query: "Pawan Singh Bhojpuri Hits",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    badge: "DHAMAKA",
  },
  {
    id: "pl-rajasthani-folk",
    title: "Rajasthani Folk & Fusion",
    subtitle: "Mame Khan, Kesariya Balam & Marwadi Beats",
    query: "Rajasthani Folk Songs Mame Khan",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80",
    badge: "FOLK",
  },
];

const getRandomPlaylists = (count = 6): PlaylistMeta[] => {
  const shuffled = [...ALL_PLAYLISTS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CATEGORY_FILTERS = [
  { 
    label: "All", 
    filterKey: "trending",
    queries: [
      "Latest Bollywood Hindi Chartbusters",
      "Global Top 50 Hits",
      "New Trending Punjabi Hits",
      "Hot Trending India Spotify Hits",
      "Top Viral Instagram Hindi Songs",
      "Desi Hip Hop Chart Toppers",
      "Trending English Worldwide Hits",
      "Arijit Singh Pritam Latest Hits",
      "Top 50 Hindi Romantic Hits",
      "Superhit Bollywood Mashup 2024",
      "Karan Aujla Diljit Dosanjh Hits",
      "Top Worldwide Pop Hits"
    ] 
  },
  { 
    label: "Standup Comedy", 
    filterKey: "comedy",
    queries: [
      "Zakir Khan Standup Comedy",
      "Anubhav Singh Bassi Standup",
      "Abhishek Upmanyu Standup",
      "Munawar Faruqui Standup",
      "Harsh Gujral Standup",
      "Gaurav Kapoor Standup"
    ] 
  },
  { 
    label: "Horror Stories", 
    filterKey: "horror",
    queries: [
      "Bhootiya Haveli Horror Story",
      "Midnight Horror Stories Hindi",
      "Khooni Raat Horror Story",
      "Real Paranormal Horror Hindi",
      "Aahat Horror Audio Stories"
    ] 
  },
  { 
    label: "Podcasts & Shows", 
    filterKey: "podcasts",
    queries: [
      "The Ranveer Show TRS Hindi Podcast",
      "Crime Investigation Stories Hindi Podcast",
      "Raj Shamani Figuring Out Podcast",
      "Hindi Motivation Podcast Talks",
      "Dostcast Vinamre Podcast"
    ] 
  },
  { 
    label: "Audio Stories", 
    filterKey: "stories",
    queries: [
      "Premchand Kahani Hindi",
      "Panchatantra Hindi Story",
      "Akbar Birbal Kahani Hindi",
      "Vikram Betal Kahani",
      "Crime Thriller Audio Story"
    ] 
  },
  { 
    label: "Hindi Hits", 
    filterKey: "bollywood",
    queries: [
      "Top Bollywood Hindi Hits",
      "Latest Hindi Chartbusters 2024",
      "Arijit Singh Best Songs",
      "Bollywood Party Dance Hits",
      "New Hindi Release Hits"
    ] 
  },
  { 
    label: "Punjabi Hits", 
    filterKey: "punjabi",
    queries: [
      "New Punjabi Hits",
      "Diljit Dosanjh Karan Aujla Songs",
      "Shubh AP Dhillon Hits",
      "Punjabi Club Anthems",
      "Latest Punjabi Songs 2024"
    ] 
  },
  { 
    label: "Bhakti Sagar", 
    filterKey: "devotional",
    queries: [
      "Bhakti Sagar Bhajan",
      "Sundarkand Path Hindi",
      "Morning Aarti Bhakti Bhajan",
      "Shiv Ji Bhajan Songs",
      "Krishna Bhajan Devotional",
      "Hanuman Chalisa Bhakti Sagar"
    ] 
  },
  { 
    label: "Romantic", 
    filterKey: "moods",
    queries: [
      "Romantic Hindi Hits",
      "Arijit Singh Romantic Melodies",
      "Soulful Love Songs Bollywood",
      "Atif Aslam Best Love Songs",
      "Late Night Acoustic Romance"
    ] 
  },
  { 
    label: "Hip Hop", 
    filterKey: "hiphop",
    queries: [
      "Desi Hip Hop Hits",
      "Divine Seedhe Maut KR$NA",
      "MC Stan Emiway Bantai",
      "Indian Underground Rap Wave"
    ] 
  },
  { 
    label: "90s Evergreen", 
    filterKey: "decades",
    queries: [
      "90s Bollywood Evergreen Hits",
      "Kumar Sanu Alka Yagnik Hits",
      "Udit Narayan Kavita Krishnamurthy",
      "Golden 90s Romantic Bollywood"
    ] 
  },
  { 
    label: "Sufi & Qawwali", 
    filterKey: "sufi",
    queries: [
      "Sufi Qawwali Hits",
      "Nusrat Fateh Ali Khan Qawwali",
      "Rahat Fateh Ali Khan Sufi",
      "Kailash Kher Sufi Songs"
    ] 
  },
  { 
    label: "Haryanvi", 
    filterKey: "haryanvi",
    queries: [
      "Top Haryanvi Songs",
      "Renuka Panwar Masoom Sharma",
      "Haryanvi Ragni & Beat Hits",
      "Gulzaar Chhaniwala Hits"
    ] 
  },
  { 
    label: "Bhojpuri", 
    filterKey: "bhojpuri",
    queries: [
      "Pawan Singh Bhojpuri Hits",
      "Khesari Lal Yadav Songs",
      "Bhojpuri Dance Party Hits",
      "Dinesh Lal Nirahua Bhojpuri"
    ] 
  },
  { 
    label: "Workout & Gym", 
    filterKey: "workout",
    queries: [
      "Gym Workout Motivation Songs",
      "Bass Boosted Workout Music",
      "Running Beats 160 BPM",
      "EDM Workout Energy"
    ] 
  },
  { 
    label: "South Cinema", 
    filterKey: "south",
    queries: [
      "Top South Indian Cinema Hits",
      "Anirudh Ravichander Hits",
      "Pushpa Allu Arjun Songs",
      "AR Rahman Tamil Telugu Hits"
    ] 
  },
];

interface UIThemeConfig {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  fontFamily: string;
  letterSpacing: number;
  textTransform?: "none" | "uppercase";
  cardBorderRadius: number;
  cardBorderWidth: number;
  primary: string;
  secondary: string;
  accent: string;
  darkBg: string;
  lightBg: string;
  cardDark: string;
  cardLight: string;
  cardBorderDark: string;
  cardBorderLight: string;
  glow: string;
  wavePrimary: string;
  waveSecondary: string;
  waveAccent: string;
}

// 🌟 THE 12 TOTAL UI THEMES (Synchronized with MJ PULSE Mobile App ThemeEngine)
const UI_THEMES: UIThemeConfig[] = [
  {
    id: "01-midnight-pulse",
    name: "Midnight Pulse",
    emoji: "🌌",
    tagline: "Dark glassmorphism, floating controls, luminous cyan & magenta",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: 0.5,
    textTransform: "none",
    cardBorderRadius: 20,
    cardBorderWidth: 1.5,
    primary: "#00F0FF",
    secondary: "#FF00E5",
    accent: "#B47CFF",
    darkBg: "#08090F",
    lightBg: "#EEF3F8",
    cardDark: "rgba(21, 21, 33, 0.78)",
    cardLight: "rgba(255, 255, 255, 0.90)",
    cardBorderDark: "rgba(0, 240, 255, 0.35)",
    cardBorderLight: "rgba(0, 144, 176, 0.35)",
    glow: "rgba(0, 240, 255, 0.45)",
    wavePrimary: "rgba(0, 240, 255, 0.95)",
    waveSecondary: "rgba(255, 0, 229, 0.9)",
    waveAccent: "rgba(180, 124, 255, 0.85)",
  },
  {
    id: "02-neon-rave",
    name: "Neon Rave",
    emoji: "🪩",
    tagline: "Rave capsules, oversized play control, electric light strips",
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    cardBorderRadius: 26,
    cardBorderWidth: 2,
    primary: "#00F6FF",
    secondary: "#FF16D8",
    accent: "#7B61FF",
    darkBg: "#09040D",
    lightBg: "#FAF2FF",
    cardDark: "rgba(26, 12, 38, 0.82)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(255, 22, 216, 0.45)",
    cardBorderLight: "rgba(217, 0, 139, 0.4)",
    glow: "rgba(255, 22, 216, 0.55)",
    wavePrimary: "rgba(0, 246, 255, 0.95)",
    waveSecondary: "rgba(255, 22, 216, 0.9)",
    waveAccent: "rgba(123, 97, 255, 0.85)",
  },
  {
    id: "03-cyber-blue",
    name: "Cyber Blue",
    emoji: "💠",
    tagline: "Angular HUD panels, technical labels, telemetry controls",
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    cardBorderRadius: 8,
    cardBorderWidth: 2,
    primary: "#20D9FF",
    secondary: "#247BFF",
    accent: "#72A7FF",
    darkBg: "#040B13",
    lightBg: "#ECF5FC",
    cardDark: "rgba(8, 20, 36, 0.85)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(32, 217, 255, 0.4)",
    cardBorderLight: "rgba(36, 123, 255, 0.35)",
    glow: "rgba(32, 217, 255, 0.5)",
    wavePrimary: "rgba(32, 217, 255, 0.95)",
    waveSecondary: "rgba(36, 123, 255, 0.9)",
    waveAccent: "rgba(114, 167, 255, 0.85)",
  },
  {
    id: "04-toxic-green",
    name: "Toxic Green",
    emoji: "☣️",
    tagline: "Hex cutouts, angled status badges, high-contrast neon green",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1.0,
    textTransform: "uppercase",
    cardBorderRadius: 4,
    cardBorderWidth: 2,
    primary: "#B7FF00",
    secondary: "#00E887",
    accent: "#00FFB2",
    darkBg: "#060E08",
    lightBg: "#F0F9EE",
    cardDark: "rgba(10, 26, 14, 0.88)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(183, 255, 0, 0.45)",
    cardBorderLight: "rgba(0, 180, 100, 0.4)",
    glow: "rgba(183, 255, 0, 0.5)",
    wavePrimary: "rgba(183, 255, 0, 0.95)",
    waveSecondary: "rgba(0, 232, 135, 0.9)",
    waveAccent: "rgba(0, 255, 178, 0.85)",
  },
  {
    id: "05-sunset-beat",
    name: "Sunset Beat",
    emoji: "🌅",
    tagline: "Smooth pill contours, dynamic audio blobs, warm twilight gradients",
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: 0.4,
    textTransform: "none",
    cardBorderRadius: 24,
    cardBorderWidth: 1.5,
    primary: "#FF8A00",
    secondary: "#FF287A",
    accent: "#FF5B45",
    darkBg: "#12080D",
    lightBg: "#FFF4F0",
    cardDark: "rgba(34, 14, 22, 0.82)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(255, 138, 0, 0.4)",
    cardBorderLight: "rgba(255, 40, 122, 0.35)",
    glow: "rgba(255, 138, 0, 0.45)",
    wavePrimary: "rgba(255, 138, 0, 0.95)",
    waveSecondary: "rgba(255, 40, 122, 0.9)",
    waveAccent: "rgba(255, 91, 69, 0.85)",
  },
  {
    id: "06-laser-red",
    name: "Laser Red",
    emoji: "🏎️",
    tagline: "Skewed dynamic panels, speed stripes, aggressive red-line glow",
    fontFamily: "'Teko', sans-serif",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cardBorderRadius: 10,
    cardBorderWidth: 2,
    primary: "#FF244B",
    secondary: "#FF003C",
    accent: "#FF758F",
    darkBg: "#100406",
    lightBg: "#FFF1F3",
    cardDark: "rgba(32, 8, 12, 0.86)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(255, 36, 75, 0.45)",
    cardBorderLight: "rgba(230, 0, 50, 0.4)",
    glow: "rgba(255, 36, 75, 0.55)",
    wavePrimary: "rgba(255, 36, 75, 0.95)",
    waveSecondary: "rgba(255, 0, 60, 0.9)",
    waveAccent: "rgba(255, 117, 143, 0.85)",
  },
  {
    id: "07-ultraviolet",
    name: "Ultraviolet",
    emoji: "🔮",
    tagline: "Radial planetary controls, concentric rings, cosmic violet glow",
    fontFamily: "'Cinzel', serif",
    letterSpacing: 1.2,
    textTransform: "none",
    cardBorderRadius: 18,
    cardBorderWidth: 1.5,
    primary: "#A970FF",
    secondary: "#FF00D4",
    accent: "#7B2CBF",
    darkBg: "#0B0514",
    lightBg: "#F8F2FF",
    cardDark: "rgba(24, 10, 42, 0.84)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(169, 112, 255, 0.45)",
    cardBorderLight: "rgba(130, 40, 200, 0.35)",
    glow: "rgba(169, 112, 255, 0.5)",
    wavePrimary: "rgba(169, 112, 255, 0.95)",
    waveSecondary: "rgba(255, 0, 212, 0.9)",
    waveAccent: "rgba(123, 44, 191, 0.85)",
  },
  {
    id: "08-ice-wave",
    name: "Ice Wave",
    emoji: "❄️",
    tagline: "Crisp glacial borders, frosted glass translucency, cool cyan tints",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: 0.8,
    textTransform: "none",
    cardBorderRadius: 16,
    cardBorderWidth: 1.5,
    primary: "#61E9FF",
    secondary: "#159DFF",
    accent: "#A6CFFF",
    darkBg: "#071116",
    lightBg: "#F0F8FA",
    cardDark: "rgba(12, 28, 38, 0.84)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(97, 233, 255, 0.4)",
    cardBorderLight: "rgba(20, 140, 220, 0.35)",
    glow: "rgba(97, 233, 255, 0.45)",
    wavePrimary: "rgba(97, 233, 255, 0.95)",
    waveSecondary: "rgba(21, 157, 255, 0.9)",
    waveAccent: "rgba(166, 207, 255, 0.85)",
  },
  {
    id: "09-aurora",
    name: "Aurora",
    emoji: "🌌",
    tagline: "Layered atmospheric surfaces, northern lights teal & violet",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: 1.0,
    textTransform: "none",
    cardBorderRadius: 22,
    cardBorderWidth: 1.5,
    primary: "#00F5D4",
    secondary: "#7B61FF",
    accent: "#00D1FF",
    darkBg: "#050B0C",
    lightBg: "#EDFAF7",
    cardDark: "rgba(10, 24, 26, 0.84)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(0, 245, 212, 0.4)",
    cardBorderLight: "rgba(0, 180, 150, 0.35)",
    glow: "rgba(0, 245, 212, 0.5)",
    wavePrimary: "rgba(0, 245, 212, 0.95)",
    waveSecondary: "rgba(123, 97, 255, 0.9)",
    waveAccent: "rgba(0, 209, 255, 0.85)",
  },
  {
    id: "10-golden-club",
    name: "Golden Club",
    emoji: "👑",
    tagline: "VIP metal-trimmed cards, rich 24K gold accents, prestige design",
    fontFamily: "'Cinzel', serif",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cardBorderRadius: 14,
    cardBorderWidth: 2,
    primary: "#FFD34E",
    secondary: "#FF9F1C",
    accent: "#FFE58F",
    darkBg: "#0D0904",
    lightBg: "#FDF9F0",
    cardDark: "rgba(30, 20, 8, 0.86)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(255, 211, 78, 0.45)",
    cardBorderLight: "rgba(220, 160, 20, 0.4)",
    glow: "rgba(255, 211, 78, 0.5)",
    wavePrimary: "rgba(255, 211, 78, 0.95)",
    waveSecondary: "rgba(255, 159, 28, 0.9)",
    waveAccent: "rgba(255, 229, 143, 0.85)",
  },
  {
    id: "11-pure-obsidian",
    name: "Pure Obsidian",
    emoji: "🖤",
    tagline: "True AMOLED deep black, razor-thin borders, maximum battery saving",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: 0.3,
    textTransform: "none",
    cardBorderRadius: 6,
    cardBorderWidth: 1,
    primary: "#FFFFFF",
    secondary: "#8B5CFF",
    accent: "#00E5FF",
    darkBg: "#000000",
    lightBg: "#F5F5F7",
    cardDark: "rgba(14, 14, 18, 0.92)",
    cardLight: "rgba(255, 255, 255, 0.94)",
    cardBorderDark: "rgba(255, 255, 255, 0.25)",
    cardBorderLight: "rgba(180, 180, 190, 0.35)",
    glow: "rgba(255, 255, 255, 0.3)",
    wavePrimary: "rgba(255, 255, 255, 0.95)",
    waveSecondary: "rgba(139, 92, 255, 0.9)",
    waveAccent: "rgba(0, 229, 255, 0.85)",
  },
  {
    id: "12-retro-synthwave",
    name: "Retro Synthwave",
    emoji: "🕹️",
    tagline: "80s wireframe perspective, chunky arcade buttons, VHS nostalgia",
    fontFamily: "'VT323', monospace",
    letterSpacing: 2.0,
    textTransform: "uppercase",
    cardBorderRadius: 0,
    cardBorderWidth: 2,
    primary: "#FF16D8",
    secondary: "#00F0FF",
    accent: "#FFE600",
    darkBg: "#0D0517",
    lightBg: "#FAF0FC",
    cardDark: "rgba(28, 10, 48, 0.88)",
    cardLight: "rgba(255, 255, 255, 0.92)",
    cardBorderDark: "rgba(255, 22, 216, 0.55)",
    cardBorderLight: "rgba(200, 0, 160, 0.45)",
    glow: "rgba(255, 22, 216, 0.6)",
    wavePrimary: "rgba(255, 22, 216, 0.95)",
    waveSecondary: "rgba(0, 240, 255, 0.9)",
    waveAccent: "rgba(255, 230, 0, 0.85)",
  },
];

const INITIAL_SONGS: Track[] = [
  {
    id: "ft-1",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    thumbnail: "https://c.saavncdn.com/396/The-Highlights-English-2021-20240207045714-500x500.webp",
    streamUrl: "https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_320.mp4",
    duration: 230,
    durationFormatted: "3:50",
    source: "MJ Cyber Pulse",
  },
  {
    id: "ft-2",
    title: "Volume 1 (Lossless Underground)",
    artist: "Yo Yo Honey Singh & Badshah",
    album: "Mafia Mundeer",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
    streamUrl: "/audio/volume1.mp3",
    duration: 258,
    durationFormatted: "4:18",
    source: "MJ Pulse Lossless",
  },
  {
    id: "ft-3",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    streamUrl: "https://aac.saavncdn.com/435/fd6aec8c4809549aa1c98cbec4786217_320.mp4",
    duration: 243,
    durationFormatted: "4:03",
    source: "Synthwave VIP",
  },
  {
    id: "ft-4",
    title: "After Hours",
    artist: "The Weeknd",
    album: "After Hours",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
    streamUrl: "https://aac.saavncdn.com/077/6d9172a98f9f9310e613e633a7ce99ae_320.mp4",
    duration: 361,
    durationFormatted: "6:01",
    source: "MJ Studio Engine",
  },
];

const INITIAL_STARBOY_LYRICS: LyricLine[] = [
  { timeSec: 15.71, text: "I'm tryna put you in the worst mood, ah" },
  { timeSec: 18.36, text: "P1 cleaner than your church shoes, ah" },
  { timeSec: 20.98, text: "Milli' point two just to hurt you, ah" },
  { timeSec: 23.46, text: "All red Lamb' just to tease you, ah" },
  { timeSec: 26.05, text: "None of these toys on lease too, ah" },
  { timeSec: 28.63, text: "Made your whole year in a week too, yeah" },
  { timeSec: 31.24, text: "Main bitch outta your league too, ah" },
  { timeSec: 33.70, text: "Side bitch out of your league too, ah" },
  { timeSec: 36.68, text: "House so empty, need a centerpiece" },
  { timeSec: 38.94, text: "20 racks a table, cut from ebony" },
  { timeSec: 41.69, text: "Cut that ivory into skinny pieces" },
  { timeSec: 43.83, text: "Then she clean it with her face, man, I love my baby, ah" },
  { timeSec: 46.98, text: "You talking money, need a hearing aid" },
  { timeSec: 49.51, text: "You talking 'bout me, I don't see the shade" },
  { timeSec: 52.16, text: "Switch up my style, I take any lane" },
  { timeSec: 54.35, text: "I switch up my cup, I kill any pain" },
  { timeSec: 60.76, text: "Look what you've done" },
  { timeSec: 65.72, text: "I'm a motherfucking starboy" },
  { timeSec: 71.06, text: "Look what you've done" },
  { timeSec: 76.03, text: "I'm a motherfucking starboy" },
  { timeSec: 77.72, text: "Every day a nigga try to test me, ah" },
  { timeSec: 80.25, text: "Every day a nigga try to end me, ah" },
  { timeSec: 82.80, text: "Pull off in that Roadster SV, ah" },
  { timeSec: 85.40, text: "Pockets overweight, getting hefty, ah" },
  { timeSec: 88.01, text: "Coming for the king, that's a far cry, I" },
  { timeSec: 90.72, text: "I come alive in the fall time, I" },
  { timeSec: 93.33, text: "The competition, I don't really listen" },
  { timeSec: 95.49, text: "I'm in the blue Mulsanne bumping New Edition" },
  { timeSec: 98.58, text: "House so empty, need a centerpiece" },
  { timeSec: 101.07, text: "20 racks a table, cut from ebony" },
  { timeSec: 103.75, text: "Cut that ivory into skinny pieces" },
  { timeSec: 105.80, text: "Then she clean it with her face, man, I love my baby, ah" },
  { timeSec: 108.83, text: "You talking money, need a hearing aid" },
  { timeSec: 111.44, text: "You talking 'bout me, I don't see the shade" },
  { timeSec: 114.16, text: "Switch up my style, I take any lane" },
  { timeSec: 116.39, text: "I switch up my cup, I kill any pain" },
  { timeSec: 122.78, text: "Look what you've done" },
  { timeSec: 127.60, text: "I'm a motherfucking starboy" },
  { timeSec: 133.09, text: "Look what you've done" },
  { timeSec: 137.86, text: "I'm a motherfucking starboy" },
  { timeSec: 140.04, text: "Let a nigga brag Pitt" },
  { timeSec: 141.79, text: "Legend of the fall, took the year like a bandit" },
  { timeSec: 144.30, text: "Bought mama a crib and a brand-new wagon" },
  { timeSec: 146.63, text: "Now she hit the grocery shop looking lavish" },
  { timeSec: 149.40, text: "Star Trek roof in that Wraith of Khan" },
  { timeSec: 151.86, text: "Girls get loose when they hear this song" },
  { timeSec: 154.59, text: "A hundred on the dash, get me close to God" },
  { timeSec: 156.87, text: "We don't pray for love, we just pray for cars" },
  { timeSec: 160.49, text: "House so empty, need a centerpiece" },
  { timeSec: 162.85, text: "20 racks a table, cut from ebony" },
  { timeSec: 165.70, text: "Cut that ivory into skinny pieces" },
  { timeSec: 167.71, text: "Then she clean it with her face, man, I love my baby, ah" },
  { timeSec: 170.89, text: "You talking money, need a hearing aid" },
  { timeSec: 173.31, text: "You talking 'bout me, I don't see the shade" },
  { timeSec: 176.02, text: "Switch up my style, I take any lane" },
  { timeSec: 178.20, text: "I switch up my cup, I kill any pain" },
  { timeSec: 184.63, text: "Look what you've done" },
  { timeSec: 189.65, text: "I'm a motherfucking starboy" },
  { timeSec: 194.90, text: "Look what you've done" },
  { timeSec: 199.92, text: "I'm a motherfucking starboy" },
  { timeSec: 205.22, text: "Look what you've done" },
  { timeSec: 210.35, text: "I'm a motherfucking starboy" },
  { timeSec: 215.62, text: "Look what you've done" },
  { timeSec: 220.56, text: "I'm a motherfucking starboy" },
];

// 9-BAND STUDIO FREQUENCIES (Real Web Audio Biquad Filter DSP Engine)
interface EqBandConfig {
  freq: string;
  hz: number;
  label: string;
  color: string;
  type: BiquadFilterType;
}

const EQ_BANDS: EqBandConfig[] = [
  { freq: "32Hz", hz: 32, label: "Sub", color: "#06b6d4", type: "lowshelf" },
  { freq: "64Hz", hz: 64, label: "Bass", color: "#06b6d4", type: "peaking" },
  { freq: "125Hz", hz: 125, label: "Punch", color: "#06b6d4", type: "peaking" },
  { freq: "250Hz", hz: 250, label: "Body", color: "#f59e0b", type: "peaking" },
  { freq: "500Hz", hz: 500, label: "Inst", color: "#f59e0b", type: "peaking" },
  { freq: "1kHz", hz: 1000, label: "Vocal", color: "#a855f7", type: "peaking" },
  { freq: "2kHz", hz: 2000, label: "Pres", color: "#a855f7", type: "peaking" },
  { freq: "4kHz", hz: 4000, label: "Crisp", color: "#a855f7", type: "peaking" },
  { freq: "16kHz", hz: 16000, label: "Air", color: "#ec4899", type: "highshelf" },
];

const EQ_PRESETS: Record<string, number[]> = {
  "Flat": [0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Bass Boost": [9, 8, 6, 3, 1, 0, 0, -1, -2],
  "Rock": [5, 4, 3, -1, -2, 1, 3, 5, 6],
  "Pop": [2, 3, 4, 3, 5, 4, 3, 2, 3],
  "Vocal Boost": [-3, -2, 0, 1, 3, 6, 5, 4, 2],
  "Acoustic": [3, 3, 2, 4, 6, 5, 4, 4, 5],
  "Electronic": [8, 7, 5, 2, 1, 3, 5, 6, 7],
  "Classical": [4, 3, 2, 2, 3, 4, 3, 4, 5],
  "Hip Hop": [9, 8, 6, 3, 0, 2, 3, 4, 4],
};

type SongVibe = "SAD" | "PARTY" | "ROMANTIC" | "PUNJABI" | "HIPHOP" | "LOFI" | "DEVOTIONAL" | "RETRO" | "INTERNATIONAL" | "ALL";

// Normalize title for strict deduplication (prevent same song or remixes/slowed/reverb/female versions)
function normalizeTitleForDedup(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/ft\..*|feat\..*/gi, "")
    .replace(/slowed|reverb|remix|lofi|acoustic|version|female|male|unplugged|mashup|cover|official/gi, "")
    .replace(/[^a-z0-9\s]/gi, "")
    .trim()
    .replace(/\s+/g, " ");
}

function detectSongVibe(track: Track): SongVibe {
  const text = `${track.title} ${track.artist || ""} ${track.album || ""}`.toLowerCase();

  if (
    text.includes("sad") ||
    text.includes("dard") ||
    text.includes("bewafa") ||
    text.includes("juda") ||
    text.includes("roye") ||
    text.includes("tanha") ||
    text.includes("heartbreak") ||
    text.includes("channa mereya") ||
    text.includes("bekhayali") ||
    text.includes("pachtaoge") ||
    text.includes("filhall") ||
    text.includes("hamari adhuri") ||
    text.includes("ae dil hai mushkil") ||
    text.includes("b praak")
  ) {
    return "SAD";
  }

  if (
    text.includes("party") ||
    text.includes("nach") ||
    text.includes("dance") ||
    text.includes("club") ||
    text.includes("beat") ||
    text.includes("badshah") ||
    text.includes("honey singh") ||
    text.includes("daaru") ||
    text.includes("kala chashma") ||
    text.includes("garmi") ||
    text.includes("kar gayi chull") ||
    text.includes("saturday") ||
    text.includes("dj ")
  ) {
    return "PARTY";
  }

  if (
    text.includes("romantic") ||
    text.includes("love") ||
    text.includes("ishq") ||
    text.includes("pyaar") ||
    text.includes("dil") ||
    text.includes("humsafar") ||
    text.includes("tum hi ho") ||
    text.includes("kesariya") ||
    text.includes("raataan lambiyan") ||
    text.includes("shreya ghoshal") ||
    text.includes("jubin nautiyal") ||
    text.includes("darshan raval")
  ) {
    return "ROMANTIC";
  }

  if (
    text.includes("punjabi") ||
    text.includes("diljit") ||
    text.includes("karan aujla") ||
    text.includes("sidhu moose") ||
    text.includes("shubh") ||
    text.includes("ap dhillon") ||
    text.includes("jatt")
  ) {
    return "PUNJABI";
  }

  if (
    text.includes("rap") ||
    text.includes("hip hop") ||
    text.includes("hiphop") ||
    text.includes("divine") ||
    text.includes("krsna") ||
    text.includes("mc stan") ||
    text.includes("emiway") ||
    text.includes("raftaar") ||
    text.includes("seedhe maut") ||
    text.includes("gully")
  ) {
    return "HIPHOP";
  }

  if (
    text.includes("lofi") ||
    text.includes("lo-fi") ||
    text.includes("chill") ||
    text.includes("midnight") ||
    text.includes("acoustic") ||
    text.includes("ambient")
  ) {
    return "LOFI";
  }

  if (
    text.includes("bhajan") ||
    text.includes("aarti") ||
    text.includes("krishna") ||
    text.includes("shiv") ||
    text.includes("ram") ||
    text.includes("hanuman") ||
    text.includes("bhakti") ||
    text.includes("chalisa")
  ) {
    return "DEVOTIONAL";
  }

  if (
    text.includes("kumar sanu") ||
    text.includes("alka yagnik") ||
    text.includes("udit narayan") ||
    text.includes("kishore kumar") ||
    text.includes("lata mangeshkar") ||
    text.includes("90s") ||
    text.includes("evergreen")
  ) {
    return "RETRO";
  }

  if (
    text.includes("the weeknd") ||
    text.includes("ed sheeran") ||
    text.includes("taylor swift") ||
    text.includes("billie eilish") ||
    text.includes("dua lipa") ||
    text.includes("justin bieber")
  ) {
    return "INTERNATIONAL";
  }

  return "ALL";
}

const VIBE_SEARCH_QUERIES: Record<SongVibe, string[]> = {
  SAD: ["Top Sad Hindi Songs", "Heartbreak Bollywood Melodies", "Dard Bhare Geet Hindi", "Emotional Arijit Singh Hits"],
  PARTY: ["Bollywood Party Dance Hits", "Top Hindi Club Mix", "Badshah Honey Singh Party Anthems", "High Bass Dance Mashup"],
  ROMANTIC: ["Romantic Hindi Hits", "Top Bollywood Love Songs", "Soulful Love Melodies Hindi", "Acoustic Romantic Hindi"],
  PUNJABI: ["Top Punjabi Hits", "New Punjabi Party Songs", "Diljit Karan Aujla Shubh Hits", "Punjabi Chartbusters"],
  HIPHOP: ["Desi Hip Hop Hits", "Gully Gang Rap", "Seedhe Maut Divine KR$NA Hits", "Indian Underground Hip Hop"],
  LOFI: ["Chill Lo-Fi India", "Midnight Lo-Fi Hindi", "Acoustic Lo-Fi Bollywood", "Late Night Relaxing Hindi"],
  DEVOTIONAL: ["Bhakti Sagar Bhajan", "Morning Aarti Devotional", "Shiv Ji Bhajan", "Hanuman Chalisa Bhakti"],
  RETRO: ["90s Bollywood Evergreen Hits", "Kumar Sanu Alka Yagnik Romance", "Golden 90s Romantic Hits", "Kishore Kumar Classics"],
  INTERNATIONAL: ["Global Top 50 Pop Hits", "Billboard Hot 100", "Top Viral English Pop", "Worldwide Pop Anthems"],
  ALL: ["Global Top 50 Hits", "Latest Bollywood Hindi Hits", "Top Trending Indian Songs"]
};

export default function MJPulseWeb() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [activeFilter, setActiveFilter] = useState("All");

  // Auth State
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalReason, setLoginModalReason] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loginTab, setLoginTab] = useState<"google" | "facebook" | "phone">("google");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [otpProviderUsed, setOtpProviderUsed] = useState<string>("");
  const [webConfirmationResult, setWebConfirmationResult] = useState<any | null>(null);
  const [phoneAuthLoading, setPhoneAuthLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string>("");

  // Spotify-style Onboarding Profile Setup State
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingGender, setOnboardingGender] = useState<string>("Male");
  const [onboardingGenres, setOnboardingGenres] = useState<string[]>(["Bollywood Hits", "Punjabi Beats", "Lo-Fi & Chill"]);
  const [onboardingArtists, setOnboardingArtists] = useState<string[]>(["Arijit Singh", "Diljit Dosanjh"]);
  const [onboardingLanguages, setOnboardingLanguages] = useState<string[]>(["Hindi", "Punjabi"]);
  const [onboardingSaving, setOnboardingSaving] = useState(false);

  // Helper to reliably extract high-res profile photo from user or providerData
  const getUserAvatarUrl = (u: any): string | null => {
    if (!u) return null;
    let photo = u.photoURL;
    if (!photo && u.providerData && Array.isArray(u.providerData)) {
      for (const p of u.providerData) {
        if (p?.photoURL) {
          photo = p.photoURL;
          break;
        }
      }
    }
    if (photo && typeof photo === "string") {
      if (photo.includes("graph.facebook.com") && !photo.includes("type=")) {
        photo = `${photo}${photo.includes("?") ? "&" : "?"}type=large&width=500&height=500`;
      }
    }
    return photo || null;
  };

  // Web AI Voice Assistant State
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceCommandText, setVoiceCommandText] = useState("");
  const [voiceAssistantReply, setVoiceAssistantReply] = useState("Listening for voice commands...");
  const speechRecognitionRef = useRef<any>(null);

  // Legal Documents (Terms & Privacy) State: Permanently Open in Dashboard
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Playback & Audio State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewLimitHit, setPreviewLimitHit] = useState(false);

  // Vibe Queue & Autoplay Engine State (Strict Deduplication & Mood Continuation - Never Empty on Load)
  const [vibeQueue, setVibeQueue] = useState<Track[]>(() => INITIAL_SONGS.slice(1));
  const playedTrackTitlesRef = useRef<Set<string>>(new Set());

  // Pull to Refresh State
  const [pullY, setPullY] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const pullStartYRef = useRef(0);
  const isPullingRef = useRef(false);

  // Browse & Discover Modal State (Identical to Mobile App Browse Screen)
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [selectedBrowseItem, setSelectedBrowseItem] = useState<GroupItem | null>(null);
  const [browseItemTracks, setBrowseItemTracks] = useState<Track[]>([]);
  const [isLoadingBrowseTracks, setIsLoadingBrowseTracks] = useState(false);
  const [browseCategoryFilter, setBrowseCategoryFilter] = useState("All");
  const [activePartition, setActivePartition] = useState<SerialPartition | null>(null);
  const [subSearchQuery, setSubSearchQuery] = useState("");

  const partitionChips = useMemo(() => {
    if (!selectedBrowseItem) return [];
    const catGroup = BROWSE_CATEGORIES_DATA.find((c) => c.items.some((i) => i.id === selectedBrowseItem.id));
    return getPartitionsForGroup(selectedBrowseItem, catGroup?.category);
  }, [selectedBrowseItem]);

  const displayedBrowseTracks = useMemo(() => {
    if (!subSearchQuery.trim()) return browseItemTracks;
    const q = subSearchQuery.toLowerCase();
    return browseItemTracks.filter((t) => {
      if (!t) return false;
      const text = `${t.title || ""} ${t.artist || ""} ${t.album || ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [browseItemTracks, subSearchQuery]);

  // Catalog State (Deterministic initial render to prevent SSR hydration mismatch)
  const [featuredPlaylists, setFeaturedPlaylists] = useState<PlaylistMeta[]>(() => ALL_PLAYLISTS_POOL.slice(0, 6));
  const [appTracks, setAppTracks] = useState<Track[]>(INITIAL_SONGS);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const isPlayingRef = useRef(false);
  const categoryQueryIndexRef = useRef<Record<string, number>>({});

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [suggestedSongs, setSuggestedSongs] = useState<any[]>([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState<string[]>([
    "Arijit Singh", "Kesariya", "Diljit Dosanjh", "Tum Hi Ho", "Apna Bana Le", "Sidhu Moosewala", "Starboy", "Lo-Fi Hindi Hits"
  ]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNavSuggestions, setShowNavSuggestions] = useState(false);
  const navSearchRef = useRef<HTMLDivElement | null>(null);
  const mainSearchRef = useRef<HTMLFormElement | null>(null);

  // Helper to highlight matching words in search suggestions (like YouTube)
  const renderHighlightedSuggestion = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return <span className="text-white font-medium">{text}</span>;
    const lowerText = text.toLowerCase();
    const lowerHighlight = highlight.toLowerCase().trim();
    const index = lowerText.indexOf(lowerHighlight);
    if (index === -1) return <span className="text-white font-medium">{text}</span>;
    const before = text.slice(0, index);
    const match = text.slice(index, index + lowerHighlight.length);
    const after = text.slice(index + lowerHighlight.length);
    return (
      <span className="text-slate-200">
        {before}
        <span className="font-black text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-400/50">{match}</span>
        {after}
      </span>
    );
  };

  // Real-time Autocomplete / Search Suggestions from /api/suggest
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchSuggestions([]);
      setSuggestedSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data && data.success) {
          if (Array.isArray(data.suggestions)) {
            setSearchSuggestions(data.suggestions);
          }
          if (Array.isArray(data.songs)) {
            setSuggestedSongs(data.songs);
          }
        }
      } catch (err) {
        console.warn("Suggest error:", err);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click & Touch outside to dismiss search suggestions
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as Node;
      if (navSearchRef.current && !navSearchRef.current.contains(target)) {
        setShowNavSuggestions(false);
      }
      if (mainSearchRef.current && !mainSearchRef.current.contains(target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Party Mode DJ Dual Decks State (No preset songs - user chooses track)
  const [deckA, setDeckA] = useState<{
    track: Track | null;
    title: string;
    artist: string;
    bpm: number;
    pitch: number;
    isPlaying: boolean;
  }>({
    track: null,
    title: "No Track Selected",
    artist: "Choose a track to load",
    bpm: 128,
    pitch: 0,
    isPlaying: false,
  });

  const [deckB, setDeckB] = useState<{
    track: Track | null;
    title: string;
    artist: string;
    bpm: number;
    pitch: number;
    isPlaying: boolean;
  }>({
    track: null,
    title: "No Track Selected",
    artist: "Choose a track to load",
    bpm: 124,
    pitch: 0,
    isPlaying: false,
  });

  const [crossfader, setCrossfader] = useState(50);
  const [activeDeckSongModal, setActiveDeckSongModal] = useState<"A" | "B" | null>(null);
  const [deckSearchQuery, setDeckSearchQuery] = useState("");
  const [deckSearchResults, setDeckSearchResults] = useState<Track[]>([]);
  const [isDeckSearching, setIsDeckSearching] = useState(false);

  // Per-Deck Scrubbing Timeline & Volume States
  const [deckATime, setDeckATime] = useState(0);
  const [deckADuration, setDeckADuration] = useState(0);
  const [deckAVolume, setDeckAVolume] = useState(1);
  const [deckALoop, setDeckALoop] = useState(true);

  const [deckBTime, setDeckBTime] = useState(0);
  const [deckBDuration, setDeckBDuration] = useState(0);
  const [deckBVolume, setDeckBVolume] = useState(1);
  const [deckBLoop, setDeckBLoop] = useState(true);

  // Theme Support State: Light / Dark Mode & 12 Mobile App UI Themes
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("01-midnight-pulse");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isThemePanelExpanded, setIsThemePanelExpanded] = useState(true);
  const selectedThemeRef = useRef<UIThemeConfig>(UI_THEMES[0]);
  const currentTheme = UI_THEMES.find((t) => t.id === selectedThemeId) || UI_THEMES[0];

  // Repeat & Shuffle Playback States (Loop ALL / Loop ONE / Shuffle)
  const [repeatMode, setRepeatMode] = useState<"OFF" | "ALL" | "ONE">("OFF");
  const [isShuffle, setIsShuffle] = useState(false);

  // Apply dynamic ThemeEngine CSS variables & DOM styling across entire player
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isLight = themeMode === "light";
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", currentTheme.primary);
    root.style.setProperty("--theme-secondary", currentTheme.secondary);
    root.style.setProperty("--theme-accent", currentTheme.accent);
    root.style.setProperty("--theme-bg", isLight ? currentTheme.lightBg : currentTheme.darkBg);
    root.style.setProperty("--theme-card", isLight ? currentTheme.cardLight : currentTheme.cardDark);
    root.style.setProperty("--theme-border", isLight ? currentTheme.cardBorderLight : currentTheme.cardBorderDark);
    root.style.setProperty("--theme-radius", `${currentTheme.cardBorderRadius}px`);
    root.style.setProperty("--theme-font", currentTheme.fontFamily);
    root.style.setProperty("--theme-letter-spacing", `${currentTheme.letterSpacing}px`);
    root.style.setProperty("--theme-text-transform", currentTheme.textTransform || "none");
    root.style.setProperty("--theme-glow", currentTheme.glow);
  }, [currentTheme, themeMode]);

  // Party Mode Screen Flash & Strobe State
  const [strobeActive, setStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<"White" | "Cyan" | "Pink" | "Lime" | "Disco">("Disco");
  const [strobeSpeed, setStrobeSpeed] = useState<"Slow" | "Medium" | "Fast" | "BeatSync">("BeatSync");
  const [showFullscreenRave, setShowFullscreenRave] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);

  // 9-Band Equalizer State
  const [showEqModal, setShowEqModal] = useState(false);
  const [eqGains, setEqGains] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState<string>("Flat");

  // Playback Queue Modal State
  const [showQueueModal, setShowQueueModal] = useState(false);

  // Vertical Volume Popup State
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  // Synced Lyrics State
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>(INITIAL_STARBOY_LYRICS);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [isLyricsSynced, setIsLyricsSynced] = useState(true);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingLyricsRef = useRef(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Canvas & Audio Engine Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const deckAAudioRef = useRef<HTMLAudioElement | null>(null);
  const deckBAudioRef = useRef<HTMLAudioElement | null>(null);

  const heroWaveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const deckCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ambientWaveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const deckASourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const deckBSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const biquadFiltersRef = useRef<BiquadFilterNode[]>([]);

  // Firebase Auth Listener & Session Restorer
  useEffect(() => {
    // Check saved verified session first
    try {
      const savedUser = localStorage.getItem("mjpulse_custom_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setAuthLoading(false);
      }
    } catch {}

    // Listen to genuine Firebase Auth session changes
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!currentUser.photoURL && currentUser.providerData?.length) {
          const fbProvider = currentUser.providerData.find((p) => p.providerId === "facebook.com");
          if (fbProvider?.photoURL) {
            try {
              await updateProfile(currentUser, { photoURL: fbProvider.photoURL });
            } catch {}
          }
        }
        setUser(currentUser);
        setAuthLoading(false);
        setPreviewLimitHit(false);
      } else {
        const savedUser = localStorage.getItem("mjpulse_custom_user");
        if (!savedUser) {
          setUser(null);
          setAuthLoading(false);
        }
      }
    });

    // Check for redirect sign-in completion from Google/Facebook
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          setShowLoginModal(false);
        }
      })
      .catch((err) => {
        console.warn("[Firebase Auth] Redirect result notice:", err?.message);
      });

    try {
      const saved = localStorage.getItem("mjpulse_favs");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {}

    return () => unsub();
  }, []);

  // Rotate playlists on client mount after hydration is complete
  useEffect(() => {
    setFeaturedPlaylists(getRandomPlaylists(6));
  }, []);

  // Theme Persistence & DOM sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mjpulse_theme");
      if (saved === "light" || saved === "dark") {
        setThemeMode(saved);
        if (saved === "light") {
          document.body.classList.add("light-theme");
        } else {
          document.body.classList.remove("light-theme");
        }
      }
      const savedThemeId = localStorage.getItem("mjpulse_selected_theme");
      if (savedThemeId) {
        const found = UI_THEMES.find((t) => t.id === savedThemeId);
        if (found) {
          setSelectedThemeId(savedThemeId);
          selectedThemeRef.current = found;
        }
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    if (next === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    try {
      localStorage.setItem("mjpulse_theme", next);
    } catch (e) {}
  };

  const handleSelectTheme = (themeId: string) => {
    const found = UI_THEMES.find((t) => t.id === themeId);
    if (found) {
      setSelectedThemeId(themeId);
      selectedThemeRef.current = found;
      try {
        localStorage.setItem("mjpulse_selected_theme", themeId);
      } catch (e) {}
    }
  };

  // Web Audio Context & 9-Band DSP Equalizer Filter Graph
  const initWebAudioAndFilters = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // 1. Build the 9-band DSP equalizer filters if not already initialized
      if (biquadFiltersRef.current.length !== 9) {
        const filters: BiquadFilterNode[] = [];
        EQ_BANDS.forEach((band, idx) => {
          const filter = ctx.createBiquadFilter();
          filter.type = band.type;
          filter.frequency.value = band.hz;
          if (band.type === "peaking") {
            filter.Q.value = 1.4;
          }
          filter.gain.value = eqGains[idx] || 0;
          filters.push(filter);
        });
        biquadFiltersRef.current = filters;

        // Build Analyser for real-time live frequency reactiveness
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        // Chain filters in series: filter[0] -> filter[1] -> ... -> filter[8] -> analyser -> ctx.destination
        let prevNode: AudioNode = filters[0];
        for (let i = 1; i < filters.length; i++) {
          prevNode.connect(filters[i]);
          prevNode = filters[i];
        }
        prevNode.connect(analyser);
        analyser.connect(ctx.destination);
      }

      const firstFilter = biquadFiltersRef.current[0];
      if (!firstFilter) return;

      // 2. Connect HTML5 Main audio element to the 9-Band Equalizer
      if (audioRef.current && !audioSourceRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          audioSourceRef.current = source;
          source.connect(firstFilter);
        } catch (mediaErr) {
          console.warn("Main audio MediaElementAudioSource init:", mediaErr);
        }
      }

      // 3. Connect DECK A audio element to the 9-Band Equalizer
      if (deckAAudioRef.current && !deckASourceRef.current) {
        try {
          const dASource = ctx.createMediaElementSource(deckAAudioRef.current);
          deckASourceRef.current = dASource;
          dASource.connect(firstFilter);
        } catch (e) {
          console.warn("deckASource init:", e);
        }
      }

      // 4. Connect DECK B audio element to the 9-Band Equalizer
      if (deckBAudioRef.current && !deckBSourceRef.current) {
        try {
          const dBSource = ctx.createMediaElementSource(deckBAudioRef.current);
          deckBSourceRef.current = dBSource;
          dBSource.connect(firstFilter);
        } catch (e) {
          console.warn("deckBSource init:", e);
        }
      }
    } catch (err) {
      console.warn("AudioContext init error:", err);
    }
  };

  // Sync eqGains changes to live Web Audio filters in real time
  useEffect(() => {
    if (biquadFiltersRef.current.length === 9 && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      eqGains.forEach((gainVal, idx) => {
        const filter = biquadFiltersRef.current[idx];
        if (filter) {
          try {
            filter.gain.setTargetAtTime(gainVal, ctx.currentTime, 0.05);
          } catch (e) {}
        }
      });
    }
  }, [eqGains]);

  // High-Precision Millisecond Time Tracker (Unlimited lossless playback for all users)
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTimeMs = 0;
    const trackPreciseTime = (timestamp: number) => {
      if (audioRef.current) {
        const t = audioRef.current.currentTime;
        if (timestamp - lastTimeMs >= 35) {
          lastTimeMs = timestamp;
          setCurrentTime(t);
        }
      }
      animId = requestAnimationFrame(trackPreciseTime);
    };
    animId = requestAnimationFrame(trackPreciseTime);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Zero-latency karaoke active lyric index (Sub-millisecond audio tracking)
  const activeLyricIndex = useMemo(() => {
    if (!lyrics || lyrics.length === 0 || !isLyricsSynced) return -1;
    // Perceptual speech onset lookahead (~220ms) eliminates lag & highlights exactly as words are sung
    const syncTime = currentTime + 0.22;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (lyrics[i].timeSec >= 0 && syncTime >= lyrics[i].timeSec) {
        return i;
      }
    }
    return -1;
  }, [lyrics, currentTime, isLyricsSynced]);

  const handleLyricsScroll = () => {
    isUserScrollingLyricsRef.current = true;
    if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingLyricsRef.current = false;
    }, 2500);
  };

  // Smooth auto-scroll active karaoke lyric to center view
  useEffect(() => {
    if (!showLyricsModal || isUserScrollingLyricsRef.current) return;
    if (activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const element = activeLyricRef.current;
      const targetScroll = element.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [activeLyricIndex, showLyricsModal]);

  // Instant center on modal open
  useEffect(() => {
    if (showLyricsModal && activeLyricRef.current && lyricsContainerRef.current) {
      isUserScrollingLyricsRef.current = false;
      const container = lyricsContainerRef.current;
      const element = activeLyricRef.current;
      const targetScroll = element.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "auto",
      });
    }
  }, [showLyricsModal]);

  // Screen Strobe & Flash Loop for Party Mode
  useEffect(() => {
    if (!strobeActive && !showFullscreenRave) {
      setFlashIntensity(0);
      return;
    }

    let intervalMs = 250;
    if (strobeSpeed === "Slow") intervalMs = 600;
    else if (strobeSpeed === "Medium") intervalMs = 300;
    else if (strobeSpeed === "Fast") intervalMs = 110;
    else if (strobeSpeed === "BeatSync") intervalMs = isPlaying ? 140 : 250;

    const timer = setInterval(() => {
      setFlashIntensity((prev) => (prev > 0 ? 0 : 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [strobeActive, strobeSpeed, showFullscreenRave, isPlaying]);

  const getFlashColorHex = () => {
    if (strobeColor === "White") return "rgba(255, 255, 255, 0.95)";
    if (strobeColor === "Cyan") return "rgba(0, 240, 255, 0.95)";
    if (strobeColor === "Pink") return "rgba(255, 0, 127, 0.95)";
    if (strobeColor === "Lime") return "rgba(57, 255, 20, 0.95)";
    // Disco Cycling
    const disco = [
      "rgba(0, 240, 255, 0.95)",
      "rgba(255, 0, 127, 0.95)",
      "rgba(255, 230, 0, 0.95)",
      "rgba(57, 255, 20, 0.95)",
      "rgba(157, 0, 255, 0.95)",
    ];
    return disco[Math.floor(Math.random() * disco.length)];
  };

  // Keep isPlayingRef updated so background refresh never interrupts active audio
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Fetch initial category tracks & dynamic random playlists on page load / refresh
  useEffect(() => {
    // 1. Fresh random 6 playlists on load
    setFeaturedPlaylists(getRandomPlaylists(6));
    // 2. Fresh trending tracks on load
    loadCategoryTracks("All");
  }, []);

  const refreshPlaylists = () => {
    setFeaturedPlaylists(getRandomPlaylists(6));
  };

  // 🌟 5-Minute Auto Refresh Timer for Playlists & Trending Tracks
  useEffect(() => {
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    const intervalTimer = setInterval(() => {
      // 1. Rotate to 6 new playlists
      setFeaturedPlaylists(getRandomPlaylists(6));
      // 2. Rotate trending tracks in background without stopping active audio
      loadCategoryTracks(activeFilter, true);
    }, FIVE_MINUTES_MS);

    return () => clearInterval(intervalTimer);
  }, [activeFilter]);

  const loadCategoryTracks = async (filterName: string, isAutoRefresh = false) => {
    setActiveFilter(filterName);
    const filterItem = CATEGORY_FILTERS.find((f) => f.label === filterName) || CATEGORY_FILTERS[0];
    const queries = filterItem.queries && filterItem.queries.length > 0 ? filterItem.queries : [filterName];
    const filterKey = filterItem.filterKey || "trending";
    
    // Rotate to the next query in the list so every load / refresh gives DIFFERENT songs
    const prevIdx = categoryQueryIndexRef.current[filterName] ?? Math.floor(Math.random() * queries.length);
    const nextIdx = (prevIdx + 1) % queries.length;
    categoryQueryIndexRef.current[filterName] = nextIdx;
    const query = queries[nextIdx];

    try {
      if (!isAutoRefresh) setIsLoadingTracks(true);
      // Guaranteed page=1 fetch so results always load reliably
      let res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=song&limit=30&page=1`);
      let data = await res.json();

      let validTracks: Track[] = (data.success && Array.isArray(data.data))
        ? (data.data as Track[]).filter((t) => Boolean(t && t.id && t.title))
        : [];

      // Apply strict category filter to eliminate cross-genre contamination
      if (filterKey && filterKey !== "trending") {
        const filtered = categoryFilter(validTracks, filterKey);
        if (filtered.length > 0) {
          validTracks = filtered;
        } else if (queries.length > 1) {
          // If rotating query returned non-matching tracks, fetch primary query
          const fallbackRes = await fetch(`/api/search?q=${encodeURIComponent(queries[0])}&type=song&limit=30&page=1`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && Array.isArray(fallbackData.data)) {
            const rawFb = (fallbackData.data as Track[]).filter((t) => Boolean(t && t.id && t.title));
            const filteredFb = categoryFilter(rawFb, filterKey);
            validTracks = filteredFb.length > 0 ? filteredFb : rawFb;
          }
        }
      }

      if (validTracks.length > 0) {
        setAppTracks(validTracks);
        // On initial page load if no track is playing, set first fresh track
        if (!isPlayingRef.current) {
          setCurrentTrack((prev) => {
            if (!prev || prev.id.startsWith("ft-")) {
              const firstSong = validTracks[0];
              fetchLyrics(firstSong);
              return firstSong;
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn("Failed to load category tracks:", err);
    } finally {
      if (!isAutoRefresh) setIsLoadingTracks(false);
    }
  };

  const ONBOARDING_GENRES = [
    "Bollywood Hits",
    "Punjabi Beats",
    "Desi Hip-Hop",
    "Lo-Fi & Chill",
    "EDM & Rave",
    "Romantic Melodies",
    "90s Evergreen",
    "Ghazal & Sufi",
    "Haryanvi Swag",
    "Bhojpuri Dhamaka",
    "South Cinema",
    "English Pop",
  ];

  const ONBOARDING_ARTISTS = [
    "Arijit Singh",
    "Diljit Dosanjh",
    "Sidhu Moose Wala",
    "Karan Aujla",
    "Shreya Ghoshal",
    "Yo Yo Honey Singh",
    "Divine",
    "Badshah",
    "Pritam",
    "Atif Aslam",
    "Anirudh",
    "The Weeknd",
  ];

  const ONBOARDING_LANGUAGES = [
    "Hindi",
    "Punjabi",
    "English",
    "Haryanvi",
    "Bhojpuri",
    "Tamil",
    "Telugu",
  ];

  // Spotify-style profile check and prompt
  const checkAndPromptOnboarding = async (loggedInUser: any) => {
    if (!loggedInUser) return;
    const uid = loggedInUser.uid || loggedInUser.phoneNumber;
    if (!uid) return;

    try {
      const cached = localStorage.getItem(`mjpulse_profile_${uid}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.profileCompleted) return;
      }
    } catch {}

    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists() && snap.data()?.profileCompleted) {
        localStorage.setItem(`mjpulse_profile_${uid}`, JSON.stringify(snap.data()));
        return;
      }
    } catch (e) {
      console.warn("[Onboarding check]:", e);
    }

    setOnboardingName(loggedInUser.displayName || "");
    setShowOnboardingModal(true);
  };

  const handleSaveOnboardingProfile = async () => {
    if (!user) return;
    const uid = user.uid || user.phoneNumber;
    if (!uid) return;

    setOnboardingSaving(true);
    const finalName = onboardingName.trim() || user.displayName || "MJ Pulse Listener";

    const profilePayload = {
      uid,
      displayName: finalName,
      gender: onboardingGender,
      genres: onboardingGenres,
      favoriteArtists: onboardingArtists,
      languages: onboardingLanguages,
      profileCompleted: true,
      updatedAt: Date.now(),
    };

    try {
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: finalName });
        } catch {}
      }

      try {
        await setDoc(doc(db, "users", uid), profilePayload, { merge: true });
      } catch (err) {
        console.warn("[Firestore profile save warn]:", err);
      }

      localStorage.setItem(`mjpulse_profile_${uid}`, JSON.stringify(profilePayload));

      const updatedUser = {
        ...user,
        displayName: finalName,
        profileCompleted: true,
      };
      setUser(updatedUser);
      localStorage.setItem("mjpulse_custom_user", JSON.stringify(updatedUser));
      setShowOnboardingModal(false);
    } catch (err: any) {
      console.error("[Profile save error]:", err);
    } finally {
      setOnboardingSaving(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthErrorMessage(null);
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user) {
          setUser(result.user);
          setShowLoginModal(false);
          checkAndPromptOnboarding(result.user);
        }
      } catch (popupErr: any) {
        if (
          popupErr.code === "auth/popup-blocked" ||
          popupErr.code === "auth/popup-closed-by-user" ||
          popupErr.code === "auth/cancelled-popup-request"
        ) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      console.error("[Google Auth Error]:", err);
      if (err?.code === "auth/account-exists-with-different-credential") {
        const email = err?.customData?.email || "iss email";
        setAuthErrorMessage(
          `Account Exists: ${email} se pehle se doosra account bana hua hai. Firebase Console (Authentication -> Settings -> User account linking) me "Allow multiple accounts with the same email" karein.`
        );
      } else if (err?.code === "auth/unauthorized-domain" || err?.message?.includes("unauthorized-domain")) {
        setAuthErrorMessage("Domain Authorization Error: Firebase Console (Authentication -> Settings -> Authorized Domains) me jaakar 'extracted-api.vercel.app' add karein.");
      } else {
        setAuthErrorMessage(err?.message || "Google Sign-In failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthErrorMessage(null);
      try {
        const result = await signInWithPopup(auth, facebookProvider);
        if (result?.user) {
          let photoURL = result.user.photoURL;

          // Fetch direct high-res Facebook CDN picture using Access Token
          try {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential?.accessToken;
            if (accessToken) {
              const fbRes = await fetch(
                `https://graph.facebook.com/v19.0/me?fields=picture.width(500).height(500)&access_token=${accessToken}`
              );
              const fbData = await fbRes.json();
              if (fbData?.picture?.data?.url) {
                photoURL = fbData.picture.data.url;
                try {
                  await updateProfile(result.user, { photoURL });
                } catch (pErr) {
                  console.warn("[Facebook updateProfile warn]:", pErr);
                }
              }
            }
          } catch (fbPhotoErr) {
            console.warn("[Facebook Photo Fetch warn]:", fbPhotoErr);
          }

          if (!photoURL && result.user.providerData) {
            const fbProvider = result.user.providerData.find((p) => p.providerId === "facebook.com");
            if (fbProvider?.photoURL) {
              photoURL = fbProvider.photoURL;
            }
          }

          const resolvedUser = {
            ...result.user,
            photoURL: photoURL || result.user.photoURL,
          };

          setUser(resolvedUser);
          try {
            localStorage.setItem("mjpulse_custom_user", JSON.stringify(resolvedUser));
          } catch {}
          setShowLoginModal(false);
          checkAndPromptOnboarding(resolvedUser);
        }
      } catch (popupErr: any) {
        if (
          popupErr.code === "auth/popup-blocked" ||
          popupErr.code === "auth/popup-closed-by-user" ||
          popupErr.code === "auth/cancelled-popup-request"
        ) {
          await signInWithRedirect(auth, facebookProvider);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      console.error("[Facebook Auth Error]:", err);
      if (err?.code === "auth/account-exists-with-different-credential") {
        const email = err?.customData?.email || "iss email";
        setAuthErrorMessage(
          `Account Exists: ${email} se pehle se Google account bana hua hai. Firebase Console (Authentication -> Settings -> User account linking) me "Allow multiple accounts with the same email" karein, ya upar Google se login karein.`
        );
      } else if (err?.code === "auth/unauthorized-domain" || err?.message?.includes("unauthorized-domain")) {
        setAuthErrorMessage("Domain Authorization Error: Firebase Console (Authentication -> Settings -> Authorized Domains) me jaakar 'extracted-api.vercel.app' add karein.");
      } else if (err?.message?.includes("Invalid Scopes") || err?.message?.includes("email")) {
        setAuthErrorMessage("Facebook Scope Error: Meta Developers Dashboard (developers.facebook.com) me jaakar 'Use Cases' / 'Permissions' me 'email' ko 'Add' karein.");
      } else {
        setAuthErrorMessage(err?.message || "Facebook Sign-In failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    const clean = phoneInput.replace(/[^0-9+]/g, "").trim();
    if (!clean || clean.length < 10) {
      setAuthErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    const formatted = clean.startsWith("+") ? clean : `+91${clean}`;
    setPhoneAuthLoading(true);
    setAuthErrorMessage(null);

    // Direct multi-gateway dispatch (SMS / WhatsApp) without reCAPTCHA!
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          phone: formatted,
          channel: "auto",
          provider: "auto",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to dispatch verification OTP.");
      }

      setPhoneOtpSent(true);
      setOtpProviderUsed(data.providerUsed || "SMS / WhatsApp");
      setOtpSuccessMessage(data.message || "");
    } catch (err: any) {
      console.error("[OTP Send Error]:", err);
      setAuthErrorMessage(err?.message || "Failed to send verification code. Please check your phone number and try again.");
    } finally {
      setPhoneAuthLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const input = phoneOtpInput.trim();
    if (!input || input.length < 6) {
      setAuthErrorMessage("Please enter the 6-digit OTP code received on your phone.");
      return;
    }

    setPhoneAuthLoading(true);
    setAuthErrorMessage(null);

    // Verify via Multi-Gateway Backend
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          phone: phoneInput,
          otp: input,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired OTP code.");
      }

      setUser(data.user);
      try {
        localStorage.setItem("mjpulse_custom_user", JSON.stringify(data.user));
      } catch {}
      setShowLoginModal(false);
      setPhoneOtpSent(false);
      setPhoneOtpInput("");
      setWebConfirmationResult(null);
      checkAndPromptOnboarding(data.user);
    } catch (verifyErr: any) {
      console.error("[OTP Verify Error]:", verifyErr);
      setAuthErrorMessage(verifyErr?.message || "Failed to verify OTP code.");
    } finally {
      setPhoneAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("mjpulse_custom_user");
      await signOut(auth);
    } catch {}
    setUser(null);
    setShowProfileModal(false);
  };

  // Web Speech Synthesis
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  };

  // Web AI Voice Assistant Command Processor
  const processVoiceCommand = async (command: string) => {
    const lower = command.toLowerCase().trim();
    setVoiceCommandText(command);

    if (lower.includes("pause") || lower.includes("stop") || lower.includes("roko") || lower.includes("band karo")) {
      setIsPlaying(false);
      setVoiceAssistantReply("Paused playback.");
      speakText("Paused");
      return;
    }

    if (lower === "play" || lower.includes("resume") || lower.includes("chalu karo") || lower.includes("shuru karo")) {
      setIsPlaying(true);
      setVoiceAssistantReply("Resuming playback.");
      speakText("Resuming");
      return;
    }

    if (lower.includes("next") || lower.includes("agla") || lower.includes("skip")) {
      handleNext();
      setVoiceAssistantReply("Skipped to next track.");
      speakText("Next track");
      return;
    }

    if (lower.includes("previous") || lower.includes("pichhla") || lower.includes("pichla") || lower.includes("back")) {
      handlePrev();
      setVoiceAssistantReply("Playing previous track.");
      speakText("Previous track");
      return;
    }

    // Try assistant API
    try {
      setVoiceAssistantReply("Searching and playing...");
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();

      if (data?.track) {
        playTrack(data.track);
        const reply = data.chatResponse || `Playing ${data.track.title}`;
        setVoiceAssistantReply(reply);
        speakText(reply);
        return;
      }

      if (data?.action === "pause") {
        setIsPlaying(false);
        setVoiceAssistantReply("Paused playback.");
        speakText("Paused");
        return;
      }

      if (data?.action === "next") {
        handleNext();
        setVoiceAssistantReply("Next track.");
        speakText("Next track");
        return;
      }

      if (data?.chatResponse) {
        setVoiceAssistantReply(data.chatResponse);
        speakText(data.chatResponse);
        return;
      }
    } catch (e) {
      console.warn("Assistant API notice:", e);
    }

    // Fallback search & play
    const cleanedQuery = lower
      .replace(/^(can you |please )/i, "")
      .replace(/^(play |baja do |sunao |search |find )/i, "")
      .replace(/( gana| song| track)$/i, "")
      .trim();

    if (cleanedQuery) {
      setSearchQuery(cleanedQuery);
      handleSearch(undefined, cleanedQuery);
      setVoiceAssistantReply(`Searching for "${cleanedQuery}"...`);
      speakText(`Searching for ${cleanedQuery}`);
    }
  };

  const handleToggleVoiceAssistant = () => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Brave.");
      return;
    }

    if (isVoiceListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
      setIsVoiceListening(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      speechRecognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsVoiceListening(true);
        setIsVoiceAssistantOpen(true);
        setVoiceAssistantReply("Listening... Speak a song name or command.");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          processVoiceCommand(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.warn("Speech recognition error:", event?.error);
        setIsVoiceListening(false);
        setVoiceAssistantReply("Could not hear clearly. Please tap the mic and try again.");
      };

      rec.onend = () => {
        setIsVoiceListening(false);
      };

      rec.start();
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      setIsVoiceListening(false);
    }
  };

  // Replenish Vibe & Related Songs Queue (strict deduplication, always maintains >= 20 songs)
  const replenishVibeQueue = async (seedTrack: Track, targetVibe?: SongVibe, replaceQueue: boolean = false) => {
    if (!seedTrack || !seedTrack.title) return;
    const vibe = targetVibe || detectSongVibe(seedTrack);
    const queries = VIBE_SEARCH_QUERIES[vibe] || VIBE_SEARCH_QUERIES.ALL;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    try {
      let candidateTracks: Track[] = [];

      // 1. First fetch related tracks by lead artist, genre, and currentId from /api/related (limit 35)
      try {
        const relatedRes = await fetch(
          `/api/related?artist=${encodeURIComponent(seedTrack.artist || "")}&title=${encodeURIComponent(
            seedTrack.title || ""
          )}&currentId=${encodeURIComponent(seedTrack.id)}&limit=35`
        );
        const relatedData = await relatedRes.json();
        const incoming = Array.isArray(relatedData?.data)
          ? relatedData.data
          : Array.isArray(relatedData?.tracks)
          ? relatedData.tracks
          : [];
        if (incoming.length > 0) {
          candidateTracks = incoming;
        }
      } catch (err) {
        console.warn("Related tracks fetch notice:", err);
      }

      // 2. If candidates are fewer than 25, supplement with artist or vibe search
      if (candidateTracks.length < 25) {
        const fallbackSearchQuery = seedTrack.artist ? `${seedTrack.artist} hits` : randomQuery;
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(fallbackSearchQuery)}&type=song&limit=30`);
          const data = await res.json();
          if (data?.success && Array.isArray(data.data)) {
            candidateTracks = [...candidateTracks, ...data.data];
          }
        } catch (_) {}
      }

      // 3. Second supplement if still under 25 to guarantee queue >= 20 songs always
      if (candidateTracks.length < 25) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(randomQuery)}&type=song&limit=25`);
          const data = await res.json();
          if (data?.success && Array.isArray(data.data)) {
            candidateTracks = [...candidateTracks, ...data.data];
          }
        } catch (_) {}
      }

      if (candidateTracks.length > 0) {
        const seedNorm = normalizeTitleForDedup(seedTrack.title);
        
        // Filter out same song, alternate versions (remix/lofi/reverb/female), and already-played tracks
        const newVibeTracks = candidateTracks.filter((item) => {
          if (!item || !item.title) return false;
          if (seedTrack.id && item.id && item.id === seedTrack.id) return false;
          const itemNorm = normalizeTitleForDedup(item.title);
          if (!itemNorm) return false;
          // Reject if same base title as seed song
          if (itemNorm === seedNorm) return false;
          // Reject if title contains seed title or vice versa
          if (seedNorm.length > 4 && (itemNorm.includes(seedNorm) || seedNorm.includes(itemNorm))) return false;
          // Reject if already in played history (unless replaceQueue is requested to give immediate fresh recommendations)
          if (!replaceQueue && playedTrackTitlesRef.current.has(itemNorm)) return false;
          return true;
        });

        // Deduplicate within the fetched list itself
        const seenInBatch = new Set<string>();
        const uniqueVibeBatch: Track[] = [];
        for (const t of newVibeTracks) {
          const norm = normalizeTitleForDedup(t.title);
          if (!seenInBatch.has(norm)) {
            seenInBatch.add(norm);
            uniqueVibeBatch.push(t);
          }
        }

        if (replaceQueue) {
          // Immediately populate upcoming queue with fresh recommendations for this seed song! (At least 25-35 songs)
          setVibeQueue(uniqueVibeBatch.slice(0, 35));
        } else {
          // On every song transition, append fresh recommendations matching the new song,
          // ensuring the upcoming queue NEVER drops below 20 tracks!
          setVibeQueue((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const additions = uniqueVibeBatch.filter((t) => !existingIds.has(t.id));
            const merged = [...prev, ...additions];
            // Keep up to 40 upcoming songs (always >= 20)
            return merged.slice(0, 40);
          });
        }
      }
    } catch (e) {
      console.warn("Failed to replenish vibe queue:", e);
    }
  };

  // Auto-replenish queue immediately on initial site load / refresh so queue is NEVER empty!
  useEffect(() => {
    if (currentTrack) {
      replenishVibeQueue(currentTrack, undefined, true);
    }
  }, []);

  // When Queue modal opens, ensure queue is populated immediately
  useEffect(() => {
    if (showQueueModal && vibeQueue.length <= 1 && currentTrack) {
      replenishVibeQueue(currentTrack, undefined, true);
    }
  }, [showQueueModal]);

  const playTrack = async (track: Track, forceVibe?: SongVibe, customQueue?: Track[]) => {
    if (!track || !track.id) return;

    if (!user) {
      setLoginModalReason("Sign in with the same MJ Pulse Google account as your mobile app to access full lossless streaming, synced favorites, and multi-device library.");
      setShowLoginModal(true);
      return;
    }

    let targetTrack: Track = { ...track };

    // Dynamic stream resolution if streamUrl is missing or incomplete
    if (!targetTrack.streamUrl || targetTrack.streamUrl.length < 5) {
      try {
        let resolved = false;
        // 1. First attempt: resolve by verified song ID
        if (targetTrack.id && !targetTrack.id.startsWith("special-") && !targetTrack.id.startsWith("yt-")) {
          const idRes = await fetch(`/api/song?id=${encodeURIComponent(targetTrack.id)}`);
          if (idRes.ok) {
            const idJson = await idRes.json();
            if (idJson.success && idJson.data?.streamUrl) {
              targetTrack = {
                ...targetTrack,
                ...idJson.data,
              };
              resolved = true;
            }
          }
        }

        // 2. Second attempt: search by title and artist with strict matching
        if (!resolved) {
          const queryTitle = targetTrack.title || "";
          const queryArtist = targetTrack.artist || "";
          const res = await fetch(`/api/song?title=${encodeURIComponent(queryTitle)}&artist=${encodeURIComponent(queryArtist)}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data?.streamUrl) {
              targetTrack.streamUrl = json.data.streamUrl;
              if (json.data.title) {
                targetTrack.title = json.data.title;
              }
              if (json.data.artist) {
                targetTrack.artist = json.data.artist;
              }
              if (json.data.thumbnail && (!targetTrack.thumbnail || targetTrack.thumbnail.includes("unsplash"))) {
                targetTrack.thumbnail = json.data.thumbnail;
              }
            }
          }
        }
      } catch (err) {
        console.warn("[playTrack] Stream resolution error:", err);
      }
    }

    setCurrentTrack(targetTrack);
    setCurrentTime(0);
    setPreviewLimitHit(false);
    initWebAudioAndFilters();

    // Record normalized title in played history to prevent repeats
    const norm = normalizeTitleForDedup(targetTrack.title || "");
    if (norm) playedTrackTitlesRef.current.add(norm);

    if (customQueue && customQueue.length > 0) {
      const rest = customQueue.filter((t) => t && t.id !== targetTrack.id);
      setVibeQueue(rest);
      // Guarantee queue is replenished with recommendations for this new song,
      // and ensure the upcoming queue ALWAYS maintains at least 20 tracks!
      if (rest.length < 20) {
        replenishVibeQueue(targetTrack, forceVibe, false);
      }
    } else {
      // Standalone song selected -> IMMEDIATELY replace upcoming queue with recommendations for THIS song!
      replenishVibeQueue(targetTrack, forceVibe, true);
    }

    // Stop any active DJ Decks when main track plays
    if (deckAAudioRef.current && deckA.isPlaying) {
      deckAAudioRef.current.pause();
      setDeckA((p) => ({ ...p, isPlaying: false }));
    }
    if (deckBAudioRef.current && deckB.isPlaying) {
      deckBAudioRef.current.pause();
      setDeckB((p) => ({ ...p, isPlaying: false }));
    }

    // Direct, reliable audio playback triggering
    if (!targetTrack.streamUrl) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      console.warn("Track audio stream could not be resolved for:", targetTrack.title);
      return;
    }

    if (audioRef.current && targetTrack.streamUrl) {
      try {
        audioRef.current.src = targetTrack.streamUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.muted = isMuted;
        audioRef.current.load();
        const p = audioRef.current.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true)).catch((e) => {
            console.warn("Direct play notice:", e);
          });
        }
      } catch (err) {
        console.warn("Audio load error:", err);
      }
    }

    setTimeout(() => {
      if (audioRef.current) {
        if (!targetTrack.streamUrl) {
          console.warn("[playTrack] No streamUrl available for:", targetTrack.title);
          setIsPlaying(false);
          return;
        }
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }, 120);
    fetchLyrics(targetTrack);
  };

  const fetchBrowseTracks = async (query: string, partitionId?: string, filterKey?: string, isSerial?: boolean) => {
    setIsLoadingBrowseTracks(true);
    setBrowseItemTracks([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=song&limit=35`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        let tracks: Track[] = (data.data as Track[]).filter((t) => t && t.id && t.title);

        // 1. Strict partition keyword filtering (Standup, Podcasts, Horror, Stories, Ram Katha)
        if (partitionId || isSerial) {
          const filtered = tracks.filter((t) => isTrackMatchingPartition(t, partitionId, query));
          tracks = filtered.length > 0 ? filtered : tracks;
        }

        // 2. Strict client-side category filter (eliminates cross-genre mixing)
        if (filterKey && filterKey !== 'trending') {
          const catFiltered = categoryFilter(tracks, filterKey);
          if (catFiltered.length > 0) {
            tracks = catFiltered;
          }
        }

        // 3. Chronological sorting for episodes
        if (isSerial) {
          tracks = sortSerialTracks(tracks);
        }

        setBrowseItemTracks(tracks);
      } else {
        setBrowseItemTracks([]);
      }
    } catch (e) {
      console.warn("Error loading browse item tracks:", e);
      setBrowseItemTracks([]);
    } finally {
      setIsLoadingBrowseTracks(false);
    }
  };

  const inferCategoryFilterKey = (title: string, query: string): string => {
    const text = `${title || ""} ${query || ""}`.toLowerCase();
    if (/(standup|comedy|zakir|bassi|upmanyu|munawar|gujral|hasya)/i.test(text)) return "comedy";
    if (/(horror|bhoot|haveli|khoon|midnight|paranormal|aatma|chudail)/i.test(text)) return "horror";
    if (/(podcast|ranveer|trs|beerbiceps|shamani|dostcast|interview)/i.test(text)) return "podcasts";
    if (/(story|kahani|premchand|panchatantra|birbal|vikram|katha)/i.test(text)) return "stories";
    if (/(bhajan|aarti|chalisa|bhakti|devotional|sundarkand|ram|krishna|shiv|hanuman|ganesh|durga)/i.test(text)) return "devotional";
    if (/(punjabi|diljit|sidhu|aujla)/i.test(text)) return "punjabi";
    if (/(hip hop|rap|divine|krsna|seedhe maut|stan)/i.test(text)) return "hiphop";
    if (/(sufi|qawwali|nusrat|rahat)/i.test(text)) return "sufi";
    if (/(haryanvi|renuka|masoom|gulzaar)/i.test(text)) return "haryanvi";
    if (/(bhojpuri|pawan|khesari|nirahua)/i.test(text)) return "bhojpuri";
    if (/(folk|rajasthani|marwadi|mame khan)/i.test(text)) return "folk";
    if (/(90s|retro|kumar sanu|alka yagnik|udit)/i.test(text)) return "decades";
    if (/(lo-fi|lofi|chill|sleep|study)/i.test(text)) return "moods";
    if (/(workout|gym|running|beast)/i.test(text)) return "workout";
    if (/(coke studio|unplugged)/i.test(text)) return "cokestudio";
    if (/(bollywood|romantic|arijit|atif)/i.test(text)) return "bollywood";
    return "trending";
  };

  // Browse & Discover item selection handler (Loads tracks for that category card)
  const handleSelectBrowseItem = async (item: GroupItem) => {
    if (!item) return;
    setSelectedBrowseItem(item);
    setSubSearchQuery("");
    const catGroup = BROWSE_CATEGORIES_DATA.find((c) => c.items.some((i) => i.id === item.id));
    const parts = getPartitionsForGroup(item, catGroup?.category);
    const initialPart = parts && parts.length > 0 ? parts[0] : null;
    setActivePartition(initialPart);

    const filterKey = catGroup?.filterKey || inferCategoryFilterKey(item.title, item.query);
    const queryToFetch = initialPart ? initialPart.query : item.query;
    await fetchBrowseTracks(queryToFetch, initialPart?.id, filterKey, !!item.isSerial);
  };

  const handleSelectPartition = async (partition: SerialPartition) => {
    if (!selectedBrowseItem || !partition) return;
    setActivePartition(partition);
    setSubSearchQuery("");
    const catGroup = BROWSE_CATEGORIES_DATA.find((c) => c.items.some((i) => i.id === selectedBrowseItem.id));
    const filterKey = catGroup?.filterKey || inferCategoryFilterKey(selectedBrowseItem.title, partition.query);
    await fetchBrowseTracks(partition.query, partition.id, filterKey, !!selectedBrowseItem.isSerial);
  };

  // Open any Playlist / Category directly into the Browse Sub-Screen Collection Modal
  const handleOpenPlaylistSubScreen = (pl: PlaylistMeta) => {
    let matchedGroup: GroupItem | undefined;
    for (const cat of BROWSE_CATEGORIES_DATA) {
      const found = cat.items.find(
        (i) => i.id === pl.id || i.query === pl.query || i.title.toLowerCase() === pl.title.toLowerCase()
      );
      if (found) {
        matchedGroup = found;
        break;
      }
    }

    const groupItem: GroupItem = matchedGroup || {
      id: pl.id,
      title: pl.title,
      subtitle: pl.subtitle,
      query: pl.query,
      image: pl.coverUrl,
      isSerial: /(standup|bassi|zakir|upmanyu|munawar|gujral|horror|bhoot|haveli|khoon|paranormal|podcast|trs|ranveer|shamani|story|premchand|panchatantra|birbal|ram|katha|chalisa|bhajan)/i.test(
        pl.title + " " + pl.query + " " + (pl.badge || "")
      ),
    };

    setShowBrowseModal(true);
    handleSelectBrowseItem(groupItem);
  };

  // Quick-play top track of any playlist/collection directly from the Home card
  const handleQuickPlayPlaylist = async (pl: PlaylistMeta, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(pl.query)}&type=song&limit=15`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const playable = data.data.filter((t: Track) => t && t.id && t.title);
        if (playable.length > 0) {
          playTrack(playable[0], undefined, playable);
        }
      }
    } catch (err) {
      console.warn("Quick play playlist error:", err);
    }
  };

  // Pull to Refresh Touch & Mouse Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== "undefined" && window.scrollY <= 5 && !isPullRefreshing) {
      pullStartYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || isPullRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - pullStartYRef.current;
    if (diff > 0) {
      const pullDistance = Math.min(diff * 0.45, 90);
      setPullY(pullDistance);
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    if (pullY >= 60 && !isPullRefreshing) {
      triggerPullRefresh();
    } else {
      setPullY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.scrollY <= 5 && !isPullRefreshing && e.button === 0) {
      pullStartYRef.current = e.clientY;
      isPullingRef.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPullingRef.current || isPullRefreshing) return;
    const diff = e.clientY - pullStartYRef.current;
    if (diff > 0) {
      const pullDistance = Math.min(diff * 0.4, 90);
      setPullY(pullDistance);
    }
  };

  const handleMouseUp = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    if (pullY >= 60 && !isPullRefreshing) {
      triggerPullRefresh();
    } else {
      setPullY(0);
    }
  };

  const triggerPullRefresh = () => {
    setIsPullRefreshing(true);
    setPullY(65);
    setFeaturedPlaylists(getRandomPlaylists(6));
    loadCategoryTracks(activeFilter, true);
    setTimeout(() => {
      setIsPullRefreshing(false);
      setPullY(0);
    }, 900);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    initWebAudioAndFilters();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any DJ decks so audio doesn't clash
      if (deckAAudioRef.current && deckA.isPlaying) {
        deckAAudioRef.current.pause();
        setDeckA((p) => ({ ...p, isPlaying: false }));
      }
      if (deckBAudioRef.current && deckB.isPlaying) {
        deckBAudioRef.current.pause();
        setDeckB((p) => ({ ...p, isPlaying: false }));
      }

      if (lyrics.length === 0 && currentTrack) {
        fetchLyrics(currentTrack);
      }
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.warn("Audio play error:", e);
      });
    }
  };

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime)) {
      setIsSeeking(true);
      setCurrentTime(newTime);
    }
  };

  const handleSeekCommit = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    if (audioRef.current && !isNaN(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    setIsSeeking(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    setIsSeeking(false);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return;
    const curr = audioRef.current.currentTime;
    setCurrentTime(curr);
  };

  // High-precision 60fps hardware audio clock tracking (Smooth seeking without jitter)
  useEffect(() => {
    let animId: number;
    const pollAudioTime = () => {
      if (audioRef.current && !audioRef.current.paused && !isSeeking) {
        const curr = audioRef.current.currentTime;
        setCurrentTime(curr);
      }
      if (isPlaying) {
        animId = requestAnimationFrame(pollAudioTime);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(pollAudioTime);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, isSeeking]);

  // Web Audio Queue Preloader: Automatically pre-buffers upcoming songs in browser HTTP cache for uninterrupted travel playback
  useEffect(() => {
    if (!vibeQueue || vibeQueue.length === 0) return;
    const preloadAhead = vibeQueue.slice(0, 3);
    preloadAhead.forEach((track) => {
      if (track?.streamUrl && typeof window !== "undefined") {
        try {
          const preloader = new Audio();
          preloader.preload = "auto";
          preloader.src = track.streamUrl;
          preloader.load();
        } catch (_) {}
      }
    });
  }, [vibeQueue]);

  const toggleFavorite = (trackId: string) => {
    if (!user) {
      setLoginModalReason("Sign in with Google to bookmark songs and sync favorites across devices.");
      setShowLoginModal(true);
      return;
    }
    setFavorites((prev) => {
      const updated = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      localStorage.setItem("mjpulse_favs", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || searchQuery;
    if (!q.trim()) return;

    try {
      setIsSearching(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=song&limit=60`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // FETCH LYRICS WITH ACCURATE API PARSER FIX & FAIL-SAFE SYNC
  const fetchLyrics = async (track: Track) => {
    try {
      setLoadingLyrics(true);
      const dur = track.duration || 210;
      const res = await fetch(`/api/lyrics?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist || "")}&duration=${dur}`);
      const json = await res.json();
      setIsLyricsSynced(json.synced !== false);
      if (json.success && Array.isArray(json.lyrics) && json.lyrics.length > 0) {
        setLyrics(json.lyrics);
      } else if (json.lyrics?.lines && Array.isArray(json.lyrics.lines) && json.lyrics.lines.length > 0) {
        setLyrics(json.lyrics.lines);
      } else {
        // Dynamic karaoke lines so song lyrics are NEVER empty
        setLyrics([
          { timeSec: 2, text: `♪ ${track.title} • ${track.artist || "MJ Pulse"} ♪` },
          { timeSec: 10, text: "♪ [Studio Lossless Audio Intro] ♪" },
          { timeSec: 22, text: `♪ Singing along to ${track.title} ♪` },
          { timeSec: 38, text: "★ Main Chorus • Feel the lossless vibe! ★" },
          { timeSec: 62, text: "♪ Pure 32-bit acoustic beat drop ♪" },
          { timeSec: 90, text: `★ ${track.title} • MJ Pulse Studio Lossless ★` },
        ]);
      }
    } catch (e) {
      setIsLyricsSynced(false);
      setLyrics([
        { timeSec: 2, text: `♪ ${track.title} • ${track.artist || "MJ Pulse"} ♪` },
        { timeSec: 10, text: "♪ [Studio Lossless Audio Intro] ♪" },
        { timeSec: 22, text: `♪ Singing along to ${track.title} ♪` },
        { timeSec: 38, text: "★ Main Chorus • Feel the lossless vibe! ★" },
        { timeSec: 62, text: "♪ Pure 32-bit acoustic beat drop ♪" },
        { timeSec: 90, text: `★ ${track.title} • MJ Pulse Studio Lossless ★` },
      ]);
    } finally {
      setLoadingLyrics(false);
    }
  };

  // Synchronize audio element volume with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  // Real-time Song Search for Party Mode Deck A / Deck B
  const handleDeckSearch = async (query: string) => {
    setDeckSearchQuery(query);
    if (!query.trim()) {
      setDeckSearchResults([]);
      return;
    }
    try {
      setIsDeckSearching(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=song&limit=15`);
      const data = await res.json();
      if (data.success && data.data) {
        setDeckSearchResults(data.data);
      } else {
        setDeckSearchResults([]);
      }
    } catch (err) {
      console.error("Deck search error:", err);
    } finally {
      setIsDeckSearching(false);
    }
  };

  const toggleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "OFF") return "ALL";
      if (prev === "ALL") return "ONE";
      return "OFF";
    });
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const handleNext = (isAutoEnd = false) => {
    if (isAutoEnd && repeatMode === "ONE") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // 1. Vibe-Aware Queue: Play next track matching the same mood/genre
    if (vibeQueue && vibeQueue.length > 0) {
      let nextTrack: Track;
      let remainingQueue: Track[];
      if (isShuffle && vibeQueue.length > 1) {
        const randIdx = Math.floor(Math.random() * vibeQueue.length);
        nextTrack = vibeQueue[randIdx];
        remainingQueue = vibeQueue.filter((_, idx) => idx !== randIdx);
      } else {
        nextTrack = vibeQueue[0];
        remainingQueue = vibeQueue.slice(1);
      }

      setVibeQueue(remainingQueue);

      // ALWAYS update queue with fresh recommendations matching this new song on EVERY advance,
      // and ensure upcoming queue size NEVER drops below 20 tracks!
      replenishVibeQueue(nextTrack, undefined, false);

      // Play next track while preserving the remaining upcoming queue!
      playTrack(nextTrack, undefined, remainingQueue);
      return;
    }

    // 2. Fallback to active playlist / search list
    const list = activeTab === "search" && searchResults.length > 0 ? searchResults : appTracks;
    if (list && list.length > 0) {
      const idx = list.findIndex((t) => t.id === currentTrack?.id);

      let nextTrack: Track | undefined;
      if (isShuffle && list.length > 1) {
        let randIdx = Math.floor(Math.random() * list.length);
        while (randIdx === idx && list.length > 1) {
          randIdx = Math.floor(Math.random() * list.length);
        }
        nextTrack = list[randIdx];
      } else if (idx >= 0 && idx < list.length - 1) {
        nextTrack = list[idx + 1];
      } else if (repeatMode === "ALL") {
        nextTrack = list[0];
      } else if (currentTrack) {
        // At the end of playlist / album: Autoplay next related song (Spotify / YouTube Radio style)
        replenishVibeQueue(currentTrack, undefined, true);
      }

      if (nextTrack) {
        playTrack(nextTrack);
        return;
      }
    }

    // 3. Ultimate Fallback: Autoplay from catalog so music never stops
    if (appTracks && appTracks.length > 0) {
      const randIdx = Math.floor(Math.random() * appTracks.length);
      const randTrack = appTracks[randIdx];
      if (randTrack) playTrack(randTrack);
    }
  };

  const handlePrev = () => {
    const list = activeTab === "search" && searchResults.length > 0 ? searchResults : appTracks;
    if (!list || list.length === 0) return;
    const idx = list.findIndex((t) => t.id === currentTrack?.id);
    let prevTrack: Track | undefined;
    if (isShuffle && list.length > 1) {
      let randIdx = Math.floor(Math.random() * list.length);
      while (randIdx === idx && list.length > 1) {
        randIdx = Math.floor(Math.random() * list.length);
      }
      prevTrack = list[randIdx];
    } else {
      prevTrack = list[(idx - 1 + list.length) % list.length];
    }
    if (prevTrack) playTrack(prevTrack);
  };

  // Crossfader Volume Curve
  const getCrossfadeVolumes = (pct: number) => {
    const volA = pct <= 50 ? 1.0 : Math.max(0, (100 - pct) / 50);
    const volB = pct >= 50 ? 1.0 : Math.max(0, pct / 50);
    return { volA, volB };
  };

  const updateCrossfader = (val: number) => {
    setCrossfader(val);
    const { volA, volB } = getCrossfadeVolumes(val);
    if (deckAAudioRef.current) deckAAudioRef.current.volume = volA * deckAVolume;
    if (deckBAudioRef.current) deckBAudioRef.current.volume = volB * deckBVolume;
  };

  const toggleDeckPlay = (deck: "A" | "B") => {
    initWebAudioAndFilters();

    if (deck === "A") {
      if (!deckA.track) {
        setActiveDeckSongModal("A");
        return;
      }

      // Auto-off main song unconditionally when a deck starts playing!
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      if (deckA.isPlaying) {
        deckAAudioRef.current?.pause();
        setDeckA((p) => ({ ...p, isPlaying: false }));
      } else {
        const { volA } = getCrossfadeVolumes(crossfader);
        if (deckAAudioRef.current) {
          deckAAudioRef.current.volume = volA * deckAVolume;
          deckAAudioRef.current.play().then(() => setDeckA((p) => ({ ...p, isPlaying: true }))).catch(() => {});
        }
      }
    } else {
      if (!deckB.track) {
        setActiveDeckSongModal("B");
        return;
      }

      // Auto-off main song unconditionally when a deck starts playing!
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      if (deckB.isPlaying) {
        deckBAudioRef.current?.pause();
        setDeckB((p) => ({ ...p, isPlaying: false }));
      } else {
        const { volB } = getCrossfadeVolumes(crossfader);
        if (deckBAudioRef.current) {
          deckBAudioRef.current.volume = volB * deckBVolume;
          deckBAudioRef.current.play().then(() => setDeckB((p) => ({ ...p, isPlaying: true }))).catch(() => {});
        }
      }
    }
  };

  const stopDeck = (deck: "A" | "B") => {
    if (deck === "A") {
      if (deckAAudioRef.current) {
        deckAAudioRef.current.pause();
        deckAAudioRef.current.currentTime = 0;
      }
      setDeckATime(0);
      setDeckA((p) => ({ ...p, isPlaying: false }));
    } else {
      if (deckBAudioRef.current) {
        deckBAudioRef.current.pause();
        deckBAudioRef.current.currentTime = 0;
      }
      setDeckBTime(0);
      setDeckB((p) => ({ ...p, isPlaying: false }));
    }
  };

  const seekDeck = (deck: "A" | "B", time: number) => {
    const currentDeck = deck === "A" ? deckA : deckB;
    if (!currentDeck.track) return;
    if (deck === "A") {
      if (deckAAudioRef.current) {
        deckAAudioRef.current.currentTime = time;
        setDeckATime(time);
      }
    } else {
      if (deckBAudioRef.current) {
        deckBAudioRef.current.currentTime = time;
        setDeckBTime(time);
      }
    }
  };

  const skipDeck = (deck: "A" | "B", delta: number) => {
    const currentDeck = deck === "A" ? deckA : deckB;
    if (!currentDeck.track) return;
    if (deck === "A") {
      if (deckAAudioRef.current) {
        const nextTime = Math.max(0, Math.min(deckADuration || 999, deckAAudioRef.current.currentTime + delta));
        deckAAudioRef.current.currentTime = nextTime;
        setDeckATime(nextTime);
      }
    } else {
      if (deckBAudioRef.current) {
        const nextTime = Math.max(0, Math.min(deckBDuration || 999, deckBAudioRef.current.currentTime + delta));
        deckBAudioRef.current.currentTime = nextTime;
        setDeckBTime(nextTime);
      }
    }
  };

  const cueDeck = (deck: "A" | "B") => {
    const currentDeck = deck === "A" ? deckA : deckB;
    if (!currentDeck.track) return;
    if (deck === "A") {
      if (deckAAudioRef.current) {
        deckAAudioRef.current.currentTime = 0;
        setDeckATime(0);
      }
    } else {
      if (deckBAudioRef.current) {
        deckBAudioRef.current.currentTime = 0;
        setDeckBTime(0);
      }
    }
  };

  const changeDeckTrack = (deck: "A" | "B", direction: "next" | "prev") => {
    const currentDeck = deck === "A" ? deckA : deckB;
    if (!currentDeck.track) {
      setActiveDeckSongModal(deck);
      return;
    }
    const pool = appTracks.length > 0 ? appTracks : (vibeQueue.length > 0 ? vibeQueue : INITIAL_SONGS);
    if (!pool || pool.length === 0) return;

    const currentIdx = pool.findIndex((t) => t.id === currentDeck.track?.id);
    let targetIdx: number;
    if (currentIdx === -1) {
      setActiveDeckSongModal(deck);
      return;
    } else {
      targetIdx = direction === "next"
        ? (currentIdx + 1) % pool.length
        : (currentIdx - 1 + pool.length) % pool.length;
    }

    const nextTrack = pool[targetIdx];
    if (!nextTrack) return;

    if (deck === "A") {
      setDeckA((prev) => ({
        ...prev,
        track: nextTrack,
        title: nextTrack.title,
        artist: nextTrack.artist,
      }));
      setDeckATime(0);
      if (deckAAudioRef.current) {
        deckAAudioRef.current.currentTime = 0;
        if (currentDeck.isPlaying) {
          setTimeout(() => {
            deckAAudioRef.current?.play().catch(() => {});
          }, 100);
        }
      }
    } else {
      setDeckB((prev) => ({
        ...prev,
        track: nextTrack,
        title: nextTrack.title,
        artist: nextTrack.artist,
      }));
      setDeckBTime(0);
      if (deckBAudioRef.current) {
        deckBAudioRef.current.currentTime = 0;
        if (currentDeck.isPlaying) {
          setTimeout(() => {
            deckBAudioRef.current?.play().catch(() => {});
          }, 100);
        }
      }
    }
  };

  const setDeckVol = (deck: "A" | "B", val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    if (deck === "A") {
      setDeckAVolume(clamped);
      if (deckAAudioRef.current) {
        const { volA } = getCrossfadeVolumes(crossfader);
        deckAAudioRef.current.volume = volA * clamped;
      }
    } else {
      setDeckBVolume(clamped);
      if (deckBAudioRef.current) {
        const { volB } = getCrossfadeVolumes(crossfader);
        deckBAudioRef.current.volume = volB * clamped;
      }
    }
  };

  const toggleDeckLoop = (deck: "A" | "B") => {
    if (deck === "A") {
      setDeckALoop((prev) => {
        const next = !prev;
        if (deckAAudioRef.current) deckAAudioRef.current.loop = next;
        return next;
      });
    } else {
      setDeckBLoop((prev) => {
        const next = !prev;
        if (deckBAudioRef.current) deckBAudioRef.current.loop = next;
        return next;
      });
    }
  };

  const resetDeckPitch = (deck: "A" | "B") => {
    if (deck === "A") {
      setDeckA((p) => {
        if (deckAAudioRef.current) deckAAudioRef.current.playbackRate = 1.0;
        return { ...p, pitch: 0 };
      });
    } else {
      setDeckB((p) => {
        if (deckBAudioRef.current) deckBAudioRef.current.playbackRate = 1.0;
        return { ...p, pitch: 0 };
      });
    }
  };

  const adjustPitch = (deck: "A" | "B", delta: number) => {
    if (deck === "A") {
      setDeckA((p) => {
        const newPitch = Math.max(-10, Math.min(10, p.pitch + delta));
        if (deckAAudioRef.current) {
          deckAAudioRef.current.playbackRate = Math.max(0.5, Math.min(2.0, 1.0 + newPitch * 0.04));
        }
        return { ...p, pitch: newPitch };
      });
    } else {
      setDeckB((p) => {
        const newPitch = Math.max(-10, Math.min(10, p.pitch + delta));
        if (deckBAudioRef.current) {
          deckBAudioRef.current.playbackRate = Math.max(0.5, Math.min(2.0, 1.0 + newPitch * 0.04));
        }
        return { ...p, pitch: newPitch };
      });
    }
  };

  // Apply Equalizer Preset (Tunes live DSP Biquad Filters)
  const applyPreset = (name: string) => {
    setActivePreset(name);
    if (EQ_PRESETS[name]) {
      const newGains = [...EQ_PRESETS[name]];
      setEqGains(newGains);
      initWebAudioAndFilters();
      if (biquadFiltersRef.current.length === 9 && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        newGains.forEach((g, idx) => {
          const filter = biquadFiltersRef.current[idx];
          if (filter) {
            try {
              filter.gain.setTargetAtTime(g, ctx.currentTime, 0.05);
            } catch (e) {}
          }
        });
      }
    }
  };

  // Synthesized DJ FX
  const playDjSound = (type: "airhorn" | "siren" | "laser" | "bassdrop" | "scratch") => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "airhorn") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(587.33, now + 0.1);
        osc.frequency.setValueAtTime(440, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "siren") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
        osc.frequency.linearRampToValueAtTime(500, now + 0.6);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === "laser") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "bassdrop") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
        osc.start(now);
        osc.stop(now + 0.85);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {}
  };

  // ========================================================
  // 3D FULL-CARD EXPANDED PARTICLE WAVE (CYBERNETIC STARDUST)
  // Continuous RAF loop: Survives tab switches & AnimatePresence transitions without disappearing
  // ========================================================
  useEffect(() => {
    let animId: number;
    let wavePhase = 0;
    const numRows = 20;
    const ptsPerRow = 64;

    // Ambient floating stardust micro-particles spanning full card bounds
    const stardust = Array.from({ length: 65 }, () => ({
      x: (Math.random() - 0.5) * 36,
      y: (Math.random() - 0.5) * 16,
      z: -5 + Math.random() * 10,
      speed: 0.003 + Math.random() * 0.007,
      radius: 0.7 + Math.random() * 0.5,
      alpha: 0.25 + Math.random() * 0.5,
    }));

    // 3D Projection math calibrated to cover 100% of the hero banner card
    const project3D = (x: number, y: number, z: number, w: number, h: number) => {
      const fov = 11;
      const dist = 12 - z;
      const scale = fov / Math.max(dist, 1);
      const x2d = w / 2 + x * scale * (w / 34);
      const y2d = h * 0.50 - y * scale * (h / 6.8);
      return { x2d, y2d, scale };
    };

    const renderLoop = () => {
      // Dynamic beat metrics
      let bassEnergy = 0.35;
      let trebleEnergy = 0.35;

      if (isPlaying && audioRef.current) {
        const t = audioRef.current.currentTime;
        const kick = Math.sin(t * (128 / 60) * Math.PI * 2);
        bassEnergy = Math.max(0.3, kick * 0.5 + 0.5);
        trebleEnergy = Math.max(0.3, Math.cos(t * (128 / 60) * Math.PI * 4) * 0.5 + 0.5);
      } else {
        bassEnergy = 0.2;
        trebleEnergy = 0.2;
      }

      wavePhase += isPlaying ? (0.024 + bassEnergy * 0.045) : 0.012;
      const amp = isPlaying ? (0.85 + bassEnergy * 2.2) : 0.45;

      // 1. RENDER HERO BANNER WAVE (When Home tab is mounted)
      const heroCanvas = heroWaveCanvasRef.current;
      const activeTheme = selectedThemeRef.current || UI_THEMES[0];
      if (heroCanvas) {
        const ctx = heroCanvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
          const w = heroCanvas.width;
          const h = heroCanvas.height;

          // Detect light theme for high-contrast visibility
          const isLight = typeof document !== "undefined" && document.body.classList.contains("light-theme");

          // Render floating stardust micro-dots
          stardust.forEach((p) => {
            p.y += Math.sin(wavePhase + p.x) * p.speed;
            const { x2d, y2d, scale } = project3D(p.x, p.y, p.z, w, h);
            if (x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {
              ctx.beginPath();
              ctx.arc(x2d, y2d, p.radius * scale * (0.6 + trebleEnergy * 0.4), 0, Math.PI * 2);
              if (isLight) {
                ctx.fillStyle = `rgba(109, 40, 217, ${Math.min(0.85, (p.alpha + 0.35) * (0.7 + trebleEnergy * 0.4))})`;
              } else {
                const accent = activeTheme?.waveAccent || "rgba(236, 72, 153, 0.85)";
                ctx.fillStyle = accent.replace("0.85", `${Math.min(0.9, p.alpha * (0.5 + trebleEnergy * 0.5))}`);
              }
              ctx.fill();
            }
          });

          // Render 1,280 dense particles
          for (let r = 0; r < numRows; r++) {
            const z = -5.0 + (r / (numRows - 1)) * 10.0;
            for (let c = 0; c < ptsPerRow; c++) {
              const x = -16.0 + (c / (ptsPerRow - 1)) * 32.0;
              const y = Math.sin(x * 0.72 + wavePhase * 1.5) * Math.cos(z * 0.78 + wavePhase * 1.2) * amp;
              const { x2d, y2d, scale } = project3D(x, y, z, w, h);

              const colorType = (r + c) % 4;
              const baseSize = colorType === 0 ? (isLight ? 1.7 : 1.4) : (isLight ? 1.3 : 1.0);
              const size = Math.max(0.75, baseSize * scale * (0.65 + trebleEnergy * 0.25));
              const opacity = Math.min(0.98, (0.4 + 0.5 * scale) * (0.8 + bassEnergy * 0.3));

              ctx.beginPath();
              ctx.arc(x2d, y2d, size, 0, Math.PI * 2);

              if (isLight) {
                if (colorType === 0) {
                  ctx.fillStyle = `rgba(109, 40, 217, ${opacity})`;
                  ctx.shadowColor = "rgba(109, 40, 217, 0.4)";
                  ctx.shadowBlur = 2.5 + bassEnergy * 2;
                } else if (colorType === 2) {
                  ctx.fillStyle = `rgba(2, 132, 199, ${opacity * 0.95})`;
                  ctx.shadowColor = "rgba(2, 132, 199, 0.4)";
                  ctx.shadowBlur = 2 + bassEnergy * 2;
                } else {
                  ctx.fillStyle = `rgba(219, 39, 119, ${opacity * 0.9})`;
                  ctx.shadowColor = "rgba(219, 39, 119, 0.35)";
                  ctx.shadowBlur = 1.5;
                }
              } else {
                if (colorType === 0) {
                  ctx.fillStyle = activeTheme.wavePrimary.replace("0.95", `${opacity}`);
                  ctx.shadowColor = activeTheme.wavePrimary.replace("0.95", "0.6");
                  ctx.shadowBlur = 2.5 + bassEnergy * 2.5;
                } else if (colorType === 2) {
                  ctx.fillStyle = activeTheme.waveSecondary.replace("0.9", `${opacity * 0.9}`);
                  ctx.shadowColor = activeTheme.waveSecondary.replace("0.9", "0.5");
                  ctx.shadowBlur = 2 + bassEnergy * 2;
                } else {
                  ctx.fillStyle = activeTheme.waveAccent.replace("0.85", `${opacity * 0.85}`);
                  ctx.shadowColor = activeTheme.waveAccent.replace("0.85", "0.4");
                  ctx.shadowBlur = 1.5;
                }
              }
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 2. RENDER PERSISTENT AMBIENT BACKGROUND WAVE (Visible on ALL screens)
      const bgCanvas = ambientWaveCanvasRef.current;
      if (bgCanvas) {
        const bgCtx = bgCanvas.getContext("2d");
        if (bgCtx) {
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          const bw = bgCanvas.width;
          const bh = bgCanvas.height;
          const waveAmp = isPlaying ? (16 + bassEnergy * 24) : 10;
          const isLight = typeof document !== "undefined" && document.body.classList.contains("light-theme");

          // Multi-layer ambient sinusoidal glow curves using active theme or high-contrast light colors
          const curTheme = selectedThemeRef.current || UI_THEMES[0];
          const curves = isLight ? [
            { color: "rgba(109, 40, 217, 0.45)", freq: 0.004, speed: 1.0, yOffset: 0.68 },
            { color: "rgba(2, 132, 199, 0.45)", freq: 0.006, speed: 1.3, yOffset: 0.70 },
            { color: "rgba(219, 39, 119, 0.40)", freq: 0.005, speed: 0.8, yOffset: 0.72 },
          ] : [
            { color: (curTheme?.wavePrimary || "rgba(168, 85, 247, 0.95)").replace("0.95", "0.18"), freq: 0.004, speed: 1.0, yOffset: 0.68 },
            { color: (curTheme?.waveSecondary || "rgba(6, 182, 212, 0.9)").replace("0.9", "0.18"), freq: 0.006, speed: 1.3, yOffset: 0.70 },
            { color: (curTheme?.waveAccent || "rgba(236, 72, 153, 0.85)").replace("0.85", "0.15"), freq: 0.005, speed: 0.8, yOffset: 0.72 },
          ];

          curves.forEach((c) => {
            bgCtx.beginPath();
            bgCtx.moveTo(0, bh * c.yOffset);
            for (let bx = 0; bx <= bw; bx += 16) {
              const by = bh * c.yOffset + Math.sin(bx * c.freq + wavePhase * c.speed) * waveAmp;
              bgCtx.lineTo(bx, by);
            }
            bgCtx.strokeStyle = c.color;
            bgCtx.lineWidth = 2.5;
            bgCtx.stroke();
          });
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Right Deck Live Wave with Audio Energy Sync (Continuous RAF Loop)
  useEffect(() => {
    let animId: number;
    let deckPhase = 0;
    const deckFreqData = new Uint8Array(32);

    const renderDeck = () => {
      const canvas = deckCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          deckPhase += 0.05;

          let energy = 0.5;
          if (analyserRef.current && isPlaying) {
            try {
              analyserRef.current.getByteFrequencyData(deckFreqData);
              let sum = 0;
              for (let i = 1; i <= 5; i++) sum += deckFreqData[i];
              energy = Math.min(1.0, sum / (5 * 255));
            } catch (e) {}
          }
          if (energy < 0.05 && isPlaying && audioRef.current) {
            const t = audioRef.current.currentTime;
            energy = Math.sin(t * (128 / 60) * Math.PI * 2) * 0.4 + 0.6;
          }

          const waves = [
            { color: "#00F0FF", speed: 1.2, amp: isPlaying ? (12 + energy * 22) : 5, freq: 0.03 },
            { color: "#A855F7", speed: 0.9, amp: isPlaying ? (10 + energy * 18) : 4, freq: 0.02 },
            { color: "#FF007F", speed: 1.5, amp: isPlaying ? (14 + energy * 24) : 6, freq: 0.04 },
          ];

          waves.forEach((w) => {
            ctx.beginPath();
            ctx.strokeStyle = w.color;
            ctx.lineWidth = 2.2;
            ctx.shadowColor = w.color;
            ctx.shadowBlur = isPlaying ? 10 : 3;

            for (let x = 0; x < canvas.width; x += 4) {
              const envelope = Math.sin((x / canvas.width) * Math.PI);
              const y = canvas.height / 2 + Math.sin(deckPhase * w.speed + x * w.freq) * w.amp * envelope;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
          });
        }
      }

      animId = requestAnimationFrame(renderDeck);
    };

    animId = requestAnimationFrame(renderDeck);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen flex flex-col justify-between relative selection:bg-purple-600 selection:text-white transition-colors duration-300 ${
        themeMode === "light"
          ? "bg-[#f8fafc] text-slate-900"
          : strobeActive && (deckA.isPlaying || deckB.isPlaying || isPlaying)
          ? "bg-[#180924] text-slate-100"
          : "text-slate-100"
      }`}
      style={{
        backgroundColor:
          strobeActive && flashIntensity > 0
            ? getFlashColorHex()
            : themeMode === "light"
            ? currentTheme.lightBg
            : currentTheme.darkBg,
      }}
    >
      {/* Hidden Audio Elements */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="auto"
        src={currentTrack?.streamUrl || ""}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => handleNext(true)}
        onError={() => {
          console.warn("Audio element error on:", currentTrack?.title);
          handleNext(true);
        }}
      />
      <audio
        ref={deckAAudioRef}
        crossOrigin="anonymous"
        preload="auto"
        src={deckA.track?.streamUrl || ""}
        loop={deckALoop}
        onTimeUpdate={() => {
          if (deckAAudioRef.current) setDeckATime(deckAAudioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (deckAAudioRef.current) setDeckADuration(deckAAudioRef.current.duration || 0);
        }}
        onEnded={() => {
          if (!deckALoop) setDeckA((p) => ({ ...p, isPlaying: false }));
        }}
      />
      <audio
        ref={deckBAudioRef}
        crossOrigin="anonymous"
        preload="auto"
        src={deckB.track?.streamUrl || ""}
        loop={deckBLoop}
        onTimeUpdate={() => {
          if (deckBAudioRef.current) setDeckBTime(deckBAudioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (deckBAudioRef.current) setDeckBDuration(deckBAudioRef.current.duration || 0);
        }}
        onEnded={() => {
          if (!deckBLoop) setDeckB((p) => ({ ...p, isPlaying: false }));
        }}
      />

      {/* Ambient Neon Blobs & Persistent Background Audio Wave */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <canvas ref={ambientWaveCanvasRef} width={1400} height={700} className="w-full h-full object-cover opacity-35" />
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[130px] animate-pulse-glow"
          style={{ backgroundColor: `${currentTheme.primary}25` }}
        />
        <div
          className="absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: `${currentTheme.secondary}25` }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full blur-[150px]"
          style={{ backgroundColor: `${currentTheme.accent}20` }}
        />
      </div>

      {/* MULTI-DEVICE CLOUD SYNC BANNER (WHEN NOT LOGGED IN) */}
      {!user && !authLoading && (
        <div className="w-full bg-gradient-to-r from-purple-900/90 via-pink-900/80 to-cyan-900/90 border-b border-purple-500/30 px-4 py-2 text-center text-xs sm:text-sm text-slate-100 flex flex-wrap items-center justify-center gap-3 shadow-lg z-50">
          <span>⚡ <strong>Multi-Device Sync:</strong> Sign in with the same Google ID as your mobile app to access full music streaming, synced favorites, and 120Hz cloud audio.</span>
          <button
            onClick={() => {
              setLoginModalReason("Sign in with the same Google ID as your mobile app to access full music streaming, synced favorites, and multi-device library.");
              setShowLoginModal(true);
            }}
            className="px-3.5 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon transition-all"
          >
            Sign In
          </button>
        </div>
      )}

      {/* ========================================================
          TOP HEADER:
          - Top Left: Exact Animated App Login Screen Logo
          - Top Right: Profile Section (Google Login / User Avatar)
         ======================================================== */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-10 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* TOP LEFT: EXACT ANIMATED LOGIN SCREEN LOGO */}
          <div
            onClick={() => setActiveTab("home")}
            className="cursor-pointer group flex items-center gap-3 select-none"
          >
            {/* Visualizer Row: 4 Cyan Bars + Cursive MJ Logo + 4 Pink Bars */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all ${
              themeMode === "light"
                ? "bg-white/95 border-purple-200/90 shadow-[0_4px_16px_rgba(147,51,234,0.12)] group-hover:border-purple-400"
                : "bg-gradient-to-r from-purple-950/40 via-black/60 to-pink-950/40 border border-white/10 shadow-neon group-hover:border-purple-500/50"
            }`}>
              
              {/* Left 4 Cyan Waves */}
              <div className="flex items-center gap-[3px] h-9">
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#0284c7] shadow-[0_0_6px_#0284c7]" : "bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"}`} style={{ animation: "waveBar1 0.43s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#0284c7] shadow-[0_0_6px_#0284c7]" : "bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"}`} style={{ animation: "waveBar2 0.37s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#0284c7] shadow-[0_0_6px_#0284c7]" : "bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"}`} style={{ animation: "waveBar3 0.46s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#0284c7] shadow-[0_0_6px_#0284c7]" : "bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"}`} style={{ animation: "waveBar4 0.33s ease-in-out infinite" }} />
              </div>

              {/* Center Cursive MJ Logo */}
              <div className="relative w-12 h-9 flex items-center justify-center mx-1">
                <img
                  src="/mj-cursive-logo.png"
                  alt="MJ Pulse Logo"
                  className={`w-full h-full object-contain group-hover:scale-105 transition-transform ${
                    themeMode === "light"
                      ? "filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.55)] contrast-125"
                      : "filter drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                  }`}
                />
              </div>

              {/* Right 4 Pink Waves */}
              <div className="flex items-center gap-[3px] h-9">
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#db2777] shadow-[0_0_6px_#db2777]" : "bg-[#ec4899] shadow-[0_0_8px_#ec4899]"}`} style={{ animation: "waveBar5 0.35s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#db2777] shadow-[0_0_6px_#db2777]" : "bg-[#ec4899] shadow-[0_0_8px_#ec4899]"}`} style={{ animation: "waveBar6 0.47s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#db2777] shadow-[0_0_6px_#db2777]" : "bg-[#ec4899] shadow-[0_0_8px_#ec4899]"}`} style={{ animation: "waveBar7 0.39s ease-in-out infinite" }} />
                <div className={`w-[3.5px] rounded-full ${themeMode === "light" ? "bg-[#db2777] shadow-[0_0_6px_#db2777]" : "bg-[#ec4899] shadow-[0_0_8px_#ec4899]"}`} style={{ animation: "waveBar8 0.44s ease-in-out infinite" }} />
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="hidden sm:block text-left">
              <span className={`font-display font-black text-lg tracking-wider ${
                themeMode === "light"
                  ? "bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-700 bg-clip-text text-transparent font-black"
                  : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent"
              }`}>
                MJ PULSE
              </span>
              <span className={`block text-[9px] uppercase tracking-widest font-extrabold -mt-1 font-sans ${
                themeMode === "light" ? "text-purple-700 font-extrabold" : "text-slate-400 font-bold"
              }`}>
                YOUR MUSIC YOUR VIBE
              </span>
            </div>
          </div>

          {/* Quick Header Search Input with instant Clear (X) button & YouTube-style Autocomplete Dropdown */}
          <div className="flex flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-6 relative" ref={navSearchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onFocus={() => setShowNavSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowNavSuggestions(false);
                    setShowSearchSuggestions(false);
                    setActiveTab("search");
                    handleSearch();
                  } else if (e.key === "Escape") {
                    setShowNavSuggestions(false);
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowNavSuggestions(true);
                }}
                className="w-full bg-[#11111c] border border-white/10 focus:border-purple-500 rounded-full pl-8 sm:pl-10 pr-8 sm:pr-9 py-1 sm:py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowNavSuggestions(false);
                  }}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Header Autocomplete Suggestions Dropdown (YouTube & Song Match) */}
            {showNavSuggestions && (
              <div
                style={{
                  backgroundColor: "#0c0d18",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                }}
                className="absolute top-full left-0 right-0 mt-2 border border-purple-500/60 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] z-[9999] overflow-hidden py-2 max-h-80 overflow-y-auto custom-scrollbar"
              >
                {/* 1. When Empty: Show Trending Searches */}
                {!searchQuery.trim() ? (
                  <div className="p-3.5 space-y-2.5">
                    <div className="text-[10px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-pink-500" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {trendingSuggestions.map((trend, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(trend);
                            setShowNavSuggestions(false);
                            setShowSearchSuggestions(false);
                            setActiveTab("search");
                            handleSearch(undefined, trend);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 hover:bg-purple-600 text-white border border-white/20 transition-all shadow-sm"
                        >
                          {trend}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 2. Direct Song Matches (Song Match) */}
                    {suggestedSongs.length > 0 && (
                      <div className="border-b border-white/10 pb-2 mb-1">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-cyan-400 uppercase flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Song Matches</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Tap to Play</span>
                        </div>
                        {suggestedSongs.slice(0, 3).map((song) => (
                          <button
                            key={song.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setShowNavSuggestions(false);
                              setShowSearchSuggestions(false);
                              playTrack({
                                id: song.id,
                                title: song.title,
                                artist: song.artist,
                                album: song.album,
                                thumbnail: song.thumbnail,
                                streamUrl: song.streamUrl || "",
                                source: "MJ PULSE Lossless",
                              });
                            }}
                            className="w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors group"
                          >
                            <img
                              src={song.thumbnail || "/default-artwork.png"}
                              alt={song.title}
                              className="w-9 h-9 rounded-lg object-cover border border-white/20 shrink-0 shadow-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                                {renderHighlightedSuggestion(song.title, searchQuery)}
                              </p>
                              <p className="text-[11px] text-slate-300 truncate">{song.artist}</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-cyan-400 text-slate-950 shrink-0 flex items-center gap-1 shadow-md group-hover:scale-105 transition-transform">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              Play
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 3. YouTube Word Match Query Suggestions */}
                    {searchSuggestions.length > 0 && (
                      <div className="py-1">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
                          <span>Search Suggestions</span>
                          <span className="text-[9px] text-purple-400 font-mono">YouTube Match</span>
                        </div>
                        {searchSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchQuery(item);
                              setShowNavSuggestions(false);
                              setShowSearchSuggestions(false);
                              setActiveTab("search");
                              handleSearch(undefined, item);
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-purple-600/30 flex items-center gap-3 transition-colors group"
                          >
                            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                            <span className="truncate flex-1 font-semibold">
                              {renderHighlightedSuggestion(item, searchQuery)}
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-white font-mono">↵</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* TOP RIGHT: THEME TOGGLE & PROFILE SECTION */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download Android APK Button */}
            <a
              href="/api/download"
              download="mjpulse.apk"
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 hover:border-emerald-400 text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md group"
              title="Download MJ Pulse Android App (Latest APK)"
            >
              <Download className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
              <span className="hidden sm:inline text-xs font-bold">Download App</span>
            </a>

            {/* AI Voice Assistant Button */}
            <button
              onClick={handleToggleVoiceAssistant}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-md ${
                isVoiceListening
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                  : "glass-card border-purple-500/30 text-purple-300 hover:text-white hover:border-cyan-400"
              }`}
              title="AI Voice Assistant (Speak to Play, Search or Control)"
            >
              <Mic className={`w-4 h-4 ${isVoiceListening ? "text-rose-400 animate-bounce" : "text-cyan-400"}`} />
              <span className="hidden sm:inline text-xs font-bold">{isVoiceListening ? "Listening..." : "Voice AI"}</span>
            </button>

            {/* Quick Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full glass-card border transition-all flex items-center gap-1.5 shadow-md ${
                themeMode === "light"
                  ? "border-purple-300 bg-white/70 text-purple-900 hover:bg-white"
                  : "border-purple-500/30 text-slate-300 hover:text-white hover:border-cyan-400"
              }`}
              title={themeMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {themeMode === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-purple-600" />
                  <span className="hidden sm:inline text-xs font-bold text-purple-900">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span className="hidden sm:inline text-xs font-bold text-slate-200">Light</span>
                </>
              )}
            </button>

            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2.5 glass-card px-3 py-1.5 rounded-full border border-purple-500/30 hover:border-purple-400 transition-all"
              >
                {getUserAvatarUrl(user) ? (
                  <img
                    src={getUserAvatarUrl(user)!}
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-7 h-7 rounded-full border border-cyan-400 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold">
                    {user.displayName?.[0] || "U"}
                  </div>
                )}
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <p className="font-bold text-slate-200 truncate max-w-[100px]">
                    {user.displayName?.split(" ")[0]}
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoginModalReason("Sign in to sync your playlists, favorites, and settings across all devices!");
                  setShowLoginModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon hover:shadow-neon-pink transition-all transform hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PULL TO REFRESH DYNAMIC INDICATOR */}
      {(pullY > 0 || isPullRefreshing) && (
        <div
          className="w-full flex items-center justify-center overflow-hidden transition-[height] duration-150 z-30 bg-purple-950/60 backdrop-blur-md border-b border-purple-500/30"
          style={{ height: `${Math.min(pullY, 70)}px` }}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold text-cyan-300">
            <RotateCcw
              className={`w-4 h-4 text-cyan-400 ${
                isPullRefreshing ? "animate-spin" : ""
              }`}
              style={{
                transform: isPullRefreshing ? undefined : `rotate(${pullY * 4}deg)`
              }}
            />
            <span>
              {isPullRefreshing
                ? "Refreshing fresh playlists & trending songs..."
                : pullY >= 75
                ? "Release to refresh..."
                : "Pull down to refresh playlists & songs"}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN APP LANDSCAPE INTERFACE
         ======================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 pb-32 z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME (APP'S NATIVE LANDSCAPE VIEW) */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* HERO BANNER: "YOUR MUSIC, YOUR VIBE." WITH OFFICIAL APP 3D PARTICLE WAVE CANVAS */}
              <div className={`relative rounded-3xl p-6 sm:p-10 border overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[260px] transition-all ${
                themeMode === "light"
                  ? "bg-gradient-to-br from-white via-purple-50/70 to-pink-50/40 border-purple-200/90 shadow-[0_12px_36px_rgba(147,51,234,0.12)] text-slate-900"
                  : "glass-panel-glow border-purple-500/30 shadow-neon"
              }`}>
                
                {/* 3D PARTICLE WAVE CANVAS COVERING 100% OF THE CARD */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <canvas ref={heroWaveCanvasRef} width={1400} height={420} className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10 space-y-3 text-center md:text-left">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md ${
                    themeMode === "light"
                      ? "bg-purple-100/90 border-purple-300 text-purple-800 font-bold shadow-sm"
                      : "bg-purple-500/20 border-purple-500/40 text-purple-300"
                  }`}>
                    <Sparkles className={`w-3.5 h-3.5 ${themeMode === "light" ? "text-purple-600" : "text-cyan-400"}`} />
                    <span>32-Bit Studio Acoustics • Official App 3D Particle Waves</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                    <span className={`font-cursive text-4xl sm:text-6xl mr-2 font-bold ${
                      themeMode === "light"
                        ? "text-cyan-700 drop-shadow-[0_2px_4px_rgba(2,132,199,0.3)] font-black"
                        : "text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    }`}>
                      Your Music,
                    </span>
                    <span className={`font-black ${
                      themeMode === "light"
                        ? "bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm font-black"
                        : "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent text-glow-purple"
                    }`}>
                      Your Vibe.
                    </span>
                  </h1>

                  <p className={`text-xs sm:text-sm max-w-xl ${
                    themeMode === "light" ? "text-slate-700 font-medium" : "text-slate-300/90"
                  }`}>
                    Stream high-fidelity lossless sound directly in your browser. Complete with 9-band hardware equalizer presets, synced lyrics, and real-time beat sync.
                  </p>
                </div>

                {/* Quick Interactive App Actions */}
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("partymode")}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass-card hover:border-pink-500/60 text-white font-bold text-xs transition-all shadow-lg hover:scale-105"
                  >
                    <span className="text-lg">🎉</span>
                    <div className="text-left">
                      <div className="text-[10px] text-pink-400 uppercase tracking-wider font-semibold">BeatSync</div>
                      <div>Dual Deck Party</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("search")}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass-card hover:border-cyan-500/60 text-white font-bold text-xs transition-all shadow-lg hover:scale-105"
                  >
                    <span className="text-lg">🧭</span>
                    <div className="text-left">
                      <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">Explore</div>
                      <div>Browse Catalog</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        setLoginModalReason("Sign in with Google to view and sync your personal playlists!");
                        setShowLoginModal(true);
                      } else {
                        setShowProfileModal(true);
                      }
                    }}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass-card hover:border-purple-500/60 text-white font-bold text-xs transition-all shadow-lg hover:scale-105"
                  >
                    <span className="text-lg">🎵</span>
                    <div className="text-left">
                      <div className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Library</div>
                      <div>My Playlist</div>
                    </div>
                  </button>

                  <a
                    href="/api/download"
                    download="mjpulse.apk"
                    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-400/50 hover:border-emerald-400 text-white font-bold text-xs transition-all shadow-lg hover:scale-105"
                  >
                    <Download className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <div className="text-left">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Android App</div>
                      <div>Download APK</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* 1. FRESH PLAYLISTS CAROUSEL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white">Trending Playlists</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedBrowseItem(null);
                        setShowBrowseModal(true);
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-sm"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Explore All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none flex-nowrap lg:grid lg:grid-cols-6">
                  {featuredPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => handleOpenPlaylistSubScreen(pl)}
                      className="w-40 sm:w-44 lg:w-auto shrink-0 group cursor-pointer glass-card p-2.5 rounded-2xl flex flex-col justify-between hover:border-purple-500/50 hover:shadow-neon transition-all transform hover:-translate-y-1"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-900">
                        <img
                          src={getAestheticArtwork(pl.coverUrl, "playlist", pl.title)}
                          alt={pl.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = getAestheticArtwork(null, "playlist", pl.title + "_err");
                          }}
                        />
                        <div 
                          onClick={(e) => handleQuickPlayPlaylist(pl, e)}
                          className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          title="Play Playlist"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        {pl.badge && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[8px] font-black bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                            {pl.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {pl.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {pl.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = activeFilter === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => loadCategoryTracks(cat.label)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon"
                          : "glass-card text-slate-300 hover:text-white hover:border-purple-400"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* 3. DUAL-PANE LANDSCAPE APP VIEW (Track List + Live Audio Deck) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT PANE: TRACKS LIST (With Visible Glowing Animated Wave Bars on Playing Card) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {activeFilter === "All" ? "Today's Trending" : `${activeFilter} Tracks`}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 bg-white/5 border border-white/10">
                        {appTracks.length} tracks
                      </span>
                    </div>
                  </div>

                  {isLoadingTracks ? (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading {activeFilter} audio tracks...
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {appTracks.filter((t): t is Track => Boolean(t && t.id)).map((track) => {
                        const isCurrent = currentTrack?.id === track.id;
                        const isFav = favorites.includes(track.id);

                        return (
                          <div
                            key={track.id}
                            className={`group flex items-center justify-between gap-3.5 p-3 rounded-2xl glass-card transition-all cursor-pointer ${
                              isCurrent
                                ? "border-purple-500 bg-purple-950/25 shadow-neon"
                                : "hover:border-purple-500/40 hover:bg-white/[0.04]"
                            }`}
                            onClick={() => playTrack(track)}
                          >
                            {/* Artwork & Live Wave Equalizer Bars */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                              <img
                                src={getAestheticArtwork(track.thumbnail, "song", track.title)}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.src = getAestheticArtwork(null, "song", track.title + "_err");
                                }}
                              />

                              {/* PROMINENT LIVE ANIMATED WAVE BARS ON PLAYING TRACK */}
                              {isCurrent && isPlaying ? (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-1 px-1.5 z-10">
                                  <div className="w-1 bg-cyan-400 rounded-full h-3 animate-[wave_0.7s_ease-in-out_infinite]" />
                                  <div className="w-1 bg-pink-500 rounded-full h-5 animate-[wave_0.5s_ease-in-out_infinite_0.15s]" />
                                  <div className="w-1 bg-cyan-400 rounded-full h-2.5 animate-[wave_0.8s_ease-in-out_infinite_0.3s]" />
                                  <div className="w-1 bg-pink-500 rounded-full h-6 animate-[wave_0.6s_ease-in-out_infinite_0.1s]" />
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                </div>
                              )}
                            </div>

                            {/* Track Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4
                                  className={`text-xs sm:text-sm font-bold truncate ${
                                    isCurrent ? "text-cyan-300" : "text-white group-hover:text-purple-300"
                                  }`}
                                >
                                  {track.title}
                                </h4>
                                {isCurrent && isPlaying && (
                                  <span className="flex items-center gap-1 text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 shrink-0">
                                    <Activity className="w-2.5 h-2.5 animate-pulse" /> Playing
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {track.artist}
                              </p>
                            </div>

                            {/* Actions & Duration */}
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                                {track.durationFormatted || formatSeconds(track.duration || 0)}
                              </span>

                              {/* Favorite Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(track.id);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-white/5 transition-colors"
                              >
                                <Heart className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                              </button>

                              {/* Circular Play Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isCurrent) togglePlayPause();
                                  else playTrack(track);
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isCurrent && isPlaying
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon"
                                    : "bg-white/10 group-hover:bg-purple-600 text-white"
                                }`}
                              >
                                {isCurrent && isPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT PANE: NOW PLAYING DECK & CONTINUOUS SINE WAVE CANVAS */}
                <div className="lg:col-span-5 sticky top-20 space-y-4">
                  <div className="glass-panel-glow border border-purple-500/30 p-6 rounded-3xl space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-xs font-bold text-cyan-300 tracking-wider">NOW PLAYING DECK</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        32-BIT LOSSLESS
                      </span>
                    </div>

                    {/* Big Artwork (Pristine, NO inner circle hole) */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
                      <img
                        src={getAestheticArtwork(currentTrack?.thumbnail, "album", currentTrack?.title || "Music")}
                        alt={currentTrack?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getAestheticArtwork(null, "album", (currentTrack?.title || "Music") + "_err");
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-white truncate drop-shadow">
                            {currentTrack?.title}
                          </h4>
                          <p className="text-xs text-purple-300 truncate drop-shadow">
                            {currentTrack?.artist}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* LIVE DSP AUDIO SINE WAVE CANVAS */}
                    <div className="relative w-full h-16 rounded-xl bg-black/40 border border-cyan-500/20 overflow-hidden flex items-center justify-center">
                      <canvas ref={deckCanvasRef} width={400} height={64} className="w-full h-full" />
                      <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-400 font-bold">
                        BEATSYNC WAVE
                      </div>
                    </div>

                    {/* LIVE SYNCED LYRICS SNIPPET (Karaoke line preview) */}
                    <div
                      onClick={() => setShowLyricsModal(true)}
                      className="glass-panel p-2.5 rounded-xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:shadow-neon transition-all text-center group"
                    >
                      <p className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                        <span>Karaoke Synced Lyrics</span>
                      </p>
                      <p className="text-xs font-bold text-white truncate mt-1 group-hover:text-cyan-300 transition-colors">
                        {activeLyricIndex >= 0 && lyrics[activeLyricIndex]
                          ? lyrics[activeLyricIndex].text
                          : (lyrics[0]?.text || "Sing along with MJ Pulse")}
                      </p>
                    </div>

                    {/* Progress Seekbar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{formatSeconds(currentTime)}</span>
                        <span>{formatSeconds(duration)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={currentTime}
                        onInput={handleSeekInput}
                        onPointerUp={handleSeekCommit}
                        onTouchEnd={handleSeekCommit}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Main Deck Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => currentTrack && toggleFavorite(currentTrack.id)}
                        className="p-2 rounded-xl glass-panel text-slate-400 hover:text-pink-500 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            currentTrack && favorites.includes(currentTrack.id)
                              ? "fill-pink-500 text-pink-500"
                              : ""
                          }`}
                        />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleShuffle}
                          className={`w-8 h-8 rounded-full glass-panel flex items-center justify-center transition-all ${
                            isShuffle
                              ? "text-cyan-400 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.5)] bg-cyan-500/10"
                              : "text-slate-400 hover:text-white hover:bg-white/10"
                          }`}
                          title={isShuffle ? "Shuffle ON" : "Shuffle OFF"}
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={handlePrev}
                          className="w-9 h-9 rounded-full glass-panel hover:bg-white/10 flex items-center justify-center text-white"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>

                        <button
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full theme-btn-gradient flex items-center justify-center text-white shadow-neon hover:scale-105 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleNext(false)}
                          className="w-9 h-9 rounded-full glass-panel hover:bg-white/10 flex items-center justify-center text-white"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>

                        <button
                          onClick={toggleRepeatMode}
                          className={`w-8 h-8 rounded-full glass-panel flex items-center justify-center transition-all ${
                            repeatMode !== "OFF"
                              ? "text-pink-400 border border-pink-400/60 shadow-[0_0_8px_rgba(236,72,153,0.5)] bg-pink-500/10"
                              : "text-slate-400 hover:text-white hover:bg-white/10"
                          }`}
                          title={`Repeat Mode: ${repeatMode}`}
                        >
                          {repeatMode === "ONE" ? (
                            <Repeat1 className="w-3.5 h-3.5" />
                          ) : (
                            <Repeat className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (!user) {
                            setLoginModalReason("Karaoke Synced Lyrics is an exclusive feature. Sign in with Google to read along!");
                            setShowLoginModal(true);
                            return;
                          }
                          setShowLyricsModal(true);
                        }}
                        className="p-2 rounded-xl glass-panel text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Karaoke Lyrics"
                      >
                        <Music className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: SEARCH SONG */}
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl font-display font-black text-white">Search Music Catalog</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Search any song, artist, album, or playlist. Click to stream instantly with real-time audio visualizers.
                </p>

                {/* Search Bar Input with Autocomplete Suggestions Dropdown */}
                <form
                  onSubmit={(e) => {
                    setShowSearchSuggestions(false);
                    handleSearch(e);
                  }}
                  className="relative w-full max-w-xl mx-auto pt-2"
                  ref={mainSearchRef}
                >
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Try 'Arijit Singh', 'Diljit Dosanjh', 'Badshah', 'Starboy'..."
                      value={searchQuery}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setShowSearchSuggestions(false);
                      }}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchSuggestions(true);
                      }}
                      className="w-full bg-[#11111c] border border-white/10 focus:border-purple-500 rounded-2xl pl-12 pr-36 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchSuggestions(false);
                        }}
                        className="absolute right-28 p-1.5 rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                        title="Clear search text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="absolute right-2 px-5 py-2 rounded-xl text-xs font-bold theme-btn-gradient text-white transition-all disabled:opacity-50"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </button>
                  </div>

                  {/* Main Tab Autocomplete Suggestions Dropdown (YouTube & Song Match) */}
                  {showSearchSuggestions && (
                    <div
                      style={{
                        backgroundColor: "#0c0d18",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                      }}
                      className="absolute top-full left-0 right-0 mt-2 border border-purple-500/60 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] z-[9999] overflow-hidden py-2 max-h-80 overflow-y-auto custom-scrollbar"
                    >
                      {/* 1. When Empty: Show Trending Searches */}
                      {!searchQuery.trim() ? (
                        <div className="p-4 space-y-2.5 text-left">
                          <div className="text-[10px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-pink-500" />
                            <span>Trending Searches & Popular Hits</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {trendingSuggestions.map((trend, i) => (
                              <button
                                key={i}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSearchQuery(trend);
                                  setShowSearchSuggestions(false);
                                  setShowNavSuggestions(false);
                                  handleSearch(undefined, trend);
                                }}
                                className="px-3 py-1.5 text-xs rounded-full bg-white/10 hover:bg-purple-600 text-white border border-white/20 transition-all font-semibold shadow-sm"
                              >
                                {trend}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* 2. Direct Song Matches (Song Match) */}
                          {suggestedSongs.length > 0 && (
                            <div className="border-b border-white/10 pb-2 mb-1 text-left">
                              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-cyan-400 uppercase flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Top Song Matches</span>
                                </span>
                                <span className="text-[10px] text-slate-400">Tap to Play Directly</span>
                              </div>
                              {suggestedSongs.slice(0, 4).map((song) => (
                                <button
                                  key={song.id}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setShowSearchSuggestions(false);
                                    setShowNavSuggestions(false);
                                    playTrack({
                                      id: song.id,
                                      title: song.title,
                                      artist: song.artist,
                                      album: song.album,
                                      thumbnail: song.thumbnail,
                                      streamUrl: song.streamUrl || "",
                                      source: "MJ PULSE Lossless",
                                    });
                                  }}
                                  className="w-full text-left px-4 py-2.5 flex items-center gap-3.5 hover:bg-white/10 transition-colors group"
                                >
                                  <img
                                    src={song.thumbnail || "/default-artwork.png"}
                                    alt={song.title}
                                    className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0 shadow-md"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                                      {renderHighlightedSuggestion(song.title, searchQuery)}
                                    </p>
                                    <p className="text-[11px] text-slate-300 truncate">{song.artist}</p>
                                  </div>
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-400 text-slate-950 shrink-0 flex items-center gap-1 shadow-md group-hover:scale-105 transition-transform">
                                    <Play className="w-3 h-3 fill-current" />
                                    Play
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 3. YouTube Word Match Query Suggestions */}
                          {searchSuggestions.length > 0 && (
                            <div className="py-1 text-left">
                              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
                                <span>Search Recommendations</span>
                                <span className="text-[9px] text-purple-400 font-mono">YouTube Match</span>
                              </div>
                              {searchSuggestions.map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSearchQuery(item);
                                    setShowSearchSuggestions(false);
                                    setShowNavSuggestions(false);
                                    handleSearch(undefined, item);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-purple-600/30 flex items-center gap-3 transition-colors group"
                                >
                                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                                  <span className="truncate flex-1 font-semibold">
                                    {renderHighlightedSuggestion(item, searchQuery)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 group-hover:text-white font-mono">Search ↵</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </form>

                {/* Quick Genre Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {["Arijit Singh", "Honey Singh", "Punjabi Pop", "Cyberpunk Synth", "Lo-Fi Hindi", "The Weeknd"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchQuery(chip);
                        handleSearch(undefined, chip);
                      }}
                      className="text-xs px-3 py-1 rounded-full glass-card hover:border-purple-400 text-slate-300 hover:text-white transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-cyan-400" />
                    <span>{searchResults.length > 0 ? `Results for "${searchQuery}"` : "Search Recommendations"}</span>
                  </h3>
                  {searchResults.length > 0 && (
                    <button onClick={() => setSearchResults([])} className="text-xs text-purple-400 hover:underline">
                      Clear Results
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(searchResults.length > 0 ? searchResults : appTracks)
                    .filter((t): t is Track => Boolean(t && t.id))
                    .map((track) => {
                    const isSelected = currentTrack?.id === track.id;
                    const isFav = favorites.includes(track.id);

                    return (
                      <div
                        key={track.id}
                        className={`group glass-card p-3 rounded-2xl flex flex-col justify-between transition-all ${
                          isSelected ? "border-purple-500 shadow-neon bg-purple-950/25" : ""
                        }`}
                      >
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
                          <img
                            src={getAestheticArtwork(track.thumbnail, "song", track.title)}
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = getAestheticArtwork(null, "song", track.title + "_err");
                            }}
                          />
                          <button
                            onClick={() => {
                              if (isSelected) togglePlayPause();
                              else playTrack(track);
                            }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                              {isSelected && isPlaying ? (
                                <Pause className="w-6 h-6 fill-current" />
                              ) : (
                                <Play className="w-6 h-6 fill-current ml-0.5" />
                              )}
                            </div>
                          </button>
                        </div>

                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-sm text-white truncate flex-1" title={track.title}>{track.title}</h4>
                            <button
                              onClick={() => toggleFavorite(track.id)}
                              className="text-slate-400 hover:text-pink-500 p-1"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                          <span>{track.durationFormatted || formatSeconds(track.duration || 0)}</span>
                          <button
                            onClick={() => {
                              if (isSelected) togglePlayPause();
                              else playTrack(track);
                            }}
                            className="text-xs font-semibold text-cyan-400 hover:underline"
                          >
                            {isSelected && isPlaying ? "Pause" : "Play Now"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PARTY MODE (AUTHENTIC DUAL DECK DJ CONTROLLER - NO HOLES) */}
          {activeTab === "partymode" && (
            <motion.div
              key="partymode"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
                  <span>Dual Deck Pro DJ Station & Crossfader</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                  DJ PARTY & DUAL TURNTABLES
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Two independent DJ decks with pitch tuning, smooth audio crossfading, and real-time synthesized FX pads.
                </p>
              </div>

              {/* DUAL DECK DJ CONSOLE (DECK A + DECK B) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* DECK A (CYAN THEME) */}
                <div className="glass-panel-glow border border-cyan-500/40 rounded-3xl p-6 space-y-4 shadow-neon-cyan">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                      {deckA.isPlaying ? "● DECK A (LIVE)" : "○ DECK A"}
                    </span>
                    <span className="text-xs font-mono text-cyan-300">
                      {deckA.bpm + deckA.pitch} BPM
                    </span>
                  </div>

                  {/* Spinning Platter */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div
                      onClick={() => !deckA.track && setActiveDeckSongModal("A")}
                      className={`relative w-44 h-44 rounded-full border-4 ${
                        deckA.track ? "border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]" : "border-dashed border-cyan-400/40"
                      } overflow-hidden flex items-center justify-center bg-slate-950 cursor-pointer ${
                        deckA.isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                      }`}
                    >
                      {deckA.track ? (
                        <img
                          src={getAestheticArtwork(deckA.track?.thumbnail, "song", deckA.title)}
                          alt="Deck A"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getAestheticArtwork(null, "song", deckA.title + "_err");
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center">
                          <Disc className="w-14 h-14 text-cyan-400/50 mb-1" />
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300/80">Deck A Empty</span>
                          <span className="text-[9px] text-slate-400">Click to choose song</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white mt-4 truncate max-w-xs text-center">
                      {deckA.track ? deckA.title : "No Song Loaded"}
                    </h4>
                    <p className="text-xs text-cyan-300 truncate max-w-xs text-center">
                      {deckA.track ? deckA.artist : "Choose a song to begin mixing"}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveDeckSongModal("A")}
                    className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all"
                  >
                    {deckA.track ? "🔄 Change Song for Deck A" : "🎵 Choose Song for Deck A"}
                  </button>

                  {/* SCRUBBING TIMELINE SEEK BAR */}
                  <div className={`space-y-1.5 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-md ${!deckA.track ? "opacity-40 pointer-events-none" : ""}`}>
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-semibold">
                      <span className="bg-cyan-500/10 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                        {formatSeconds(deckATime)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">
                        {deckA.track ? "Deck A Timeline" : "No Song Loaded"}
                      </span>
                      <span className="bg-cyan-500/10 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                        {formatSeconds(deckA.track ? (deckADuration || 0) : 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={deckA.track ? (deckADuration || 100) : 100}
                      step={0.5}
                      value={deckA.track ? deckATime : 0}
                      onChange={(e) => seekDeck("A", parseFloat(e.target.value))}
                      disabled={!deckA.track}
                      className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-30"
                      title="Seek Deck A Timeline"
                    />
                  </div>

                  {/* MAIN TRANSPORT CONTROL BUTTONS */}
                  <div className="space-y-2 pt-1">
                    {/* Row 1: Track Navigation & Play/Pause */}
                    <div className="grid grid-cols-5 gap-1.5">
                      <button
                        onClick={() => changeDeckTrack("A", "prev")}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border border-white/10"
                        title="Previous Track on Deck A"
                      >
                        <SkipBack className="w-4 h-4 fill-current" />
                        <span className="text-[9px]">PREV</span>
                      </button>
                      <button
                        onClick={() => skipDeck("A", -10)}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5"
                        title="Rewind 10 seconds"
                      >
                        <Rewind className="w-4 h-4" />
                        <span className="text-[9px]">-10s</span>
                      </button>
                      <button
                        onClick={() => toggleDeckPlay("A")}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg ${
                          deckA.isPlaying
                            ? "bg-cyan-500 text-black shadow-neon-cyan scale-105"
                            : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black border border-cyan-500/40"
                        }`}
                        title={deckA.isPlaying ? "Pause Deck A" : "Play Deck A"}
                      >
                        {deckA.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        <span className="text-[10px] tracking-wider">{deckA.isPlaying ? "PAUSE" : "PLAY"}</span>
                      </button>
                      <button
                        onClick={() => skipDeck("A", 10)}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5"
                        title="Forward 10 seconds"
                      >
                        <FastForward className="w-4 h-4" />
                        <span className="text-[9px]">+10s</span>
                      </button>
                      <button
                        onClick={() => changeDeckTrack("A", "next")}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border border-white/10"
                        title="Next Track on Deck A"
                      >
                        <SkipForward className="w-4 h-4 fill-current" />
                        <span className="text-[9px]">NEXT</span>
                      </button>
                    </div>

                    {/* Row 2: DJ CUE & LOOP Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => cueDeck("A")}
                        className="py-1.5 rounded-xl glass-panel text-cyan-300 hover:text-white hover:bg-cyan-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-cyan-500/30"
                        title="Cue / Restart from 0:00"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[10px]">CUE (0:00)</span>
                      </button>
                      <button
                        onClick={() => toggleDeckLoop("A")}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                          deckALoop
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                            : "glass-panel text-slate-400 hover:text-white border-white/10"
                        }`}
                        title={deckALoop ? "Loop Enabled" : "Loop Disabled"}
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{deckALoop ? "LOOP: ON" : "LOOP: OFF"}</span>
                      </button>
                    </div>
                  </div>

                  {/* DECK VOLUME & PITCH CONTROL ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-cyan-500/20">
                    <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/20">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={deckAVolume}
                        onChange={(e) => setDeckVol("A", parseFloat(e.target.value))}
                        className="w-full h-1 bg-cyan-950/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        title="Deck A Volume"
                      />
                      <span className="text-[10px] font-mono text-cyan-300 w-7 text-right">
                        {Math.round(deckAVolume * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 glass-panel px-2.5 py-1.5 rounded-xl border border-cyan-500/20">
                      <button
                        onClick={() => adjustPitch("A", -1)}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-bold text-slate-300"
                        title="Decrease Pitch"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => resetDeckPitch("A")}
                        className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[10px] font-mono text-cyan-300"
                        title="Reset Pitch to 0"
                      >
                        {deckA.pitch >= 0 ? `+${deckA.pitch}` : deckA.pitch} ST
                      </button>
                      <button
                        onClick={() => adjustPitch("A", 1)}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-bold text-slate-300"
                        title="Increase Pitch"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

                {/* DECK B (PINK / MAGENTA THEME) */}
                <div className="glass-panel-glow border border-pink-500/40 rounded-3xl p-6 space-y-4 shadow-neon-pink">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-pink-400 flex items-center gap-1.5">
                      {deckB.isPlaying ? "● DECK B (LIVE)" : "○ DECK B"}
                    </span>
                    <span className="text-xs font-mono text-pink-300">
                      {deckB.bpm + deckB.pitch} BPM
                    </span>
                  </div>

                  {/* Spinning Platter */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div
                      onClick={() => !deckB.track && setActiveDeckSongModal("B")}
                      className={`relative w-44 h-44 rounded-full border-4 ${
                        deckB.track ? "border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.4)]" : "border-dashed border-pink-500/40"
                      } overflow-hidden flex items-center justify-center bg-slate-950 cursor-pointer ${
                        deckB.isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                      }`}
                    >
                      {deckB.track ? (
                        <img
                          src={getAestheticArtwork(deckB.track?.thumbnail, "song", deckB.title)}
                          alt="Deck B"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getAestheticArtwork(null, "song", deckB.title + "_err");
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center">
                          <Disc className="w-14 h-14 text-pink-400/50 mb-1" />
                          <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300/80">Deck B Empty</span>
                          <span className="text-[9px] text-slate-400">Click to choose song</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white mt-4 truncate max-w-xs text-center">
                      {deckB.track ? deckB.title : "No Song Loaded"}
                    </h4>
                    <p className="text-xs text-pink-300 truncate max-w-xs text-center">
                      {deckB.track ? deckB.artist : "Choose a song to begin mixing"}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveDeckSongModal("B")}
                    className="w-full py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-500/40 transition-all"
                  >
                    {deckB.track ? "🔄 Change Song for Deck B" : "🎵 Choose Song for Deck B"}
                  </button>

                  {/* SCRUBBING TIMELINE SEEK BAR */}
                  <div className={`space-y-1.5 px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/20 backdrop-blur-md ${!deckB.track ? "opacity-40 pointer-events-none" : ""}`}>
                    <div className="flex items-center justify-between text-[11px] font-mono text-pink-300 font-semibold">
                      <span className="bg-pink-500/10 px-1.5 py-0.5 rounded text-pink-300 border border-pink-500/30">
                        {formatSeconds(deckBTime)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">
                        {deckB.track ? "Deck B Timeline" : "No Song Loaded"}
                      </span>
                      <span className="bg-pink-500/10 px-1.5 py-0.5 rounded text-pink-300 border border-pink-500/30">
                        {formatSeconds(deckB.track ? (deckBDuration || 0) : 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={deckB.track ? (deckBDuration || 100) : 100}
                      step={0.5}
                      value={deckB.track ? deckBTime : 0}
                      onChange={(e) => seekDeck("B", parseFloat(e.target.value))}
                      disabled={!deckB.track}
                      className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-pink-400 disabled:opacity-30"
                      title="Seek Deck B Timeline"
                    />
                  </div>

                  {/* MAIN TRANSPORT CONTROL BUTTONS */}
                  <div className="space-y-2 pt-1">
                    {/* Row 1: Track Navigation & Play/Pause */}
                    <div className="grid grid-cols-5 gap-1.5">
                      <button
                        onClick={() => changeDeckTrack("B", "prev")}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-500/40 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border border-white/10"
                        title="Previous Track on Deck B"
                      >
                        <SkipBack className="w-4 h-4 fill-current" />
                        <span className="text-[9px]">PREV</span>
                      </button>
                      <button
                        onClick={() => skipDeck("B", -10)}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5"
                        title="Rewind 10 seconds"
                      >
                        <Rewind className="w-4 h-4" />
                        <span className="text-[9px]">-10s</span>
                      </button>
                      <button
                        onClick={() => toggleDeckPlay("B")}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg ${
                          deckB.isPlaying
                            ? "bg-pink-500 text-white shadow-neon-pink scale-105"
                            : "bg-pink-500/20 text-pink-300 hover:bg-pink-500 border border-pink-500/40"
                        }`}
                        title={deckB.isPlaying ? "Pause Deck B" : "Play Deck B"}
                      >
                        {deckB.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        <span className="text-[10px] tracking-wider">{deckB.isPlaying ? "PAUSE" : "PLAY"}</span>
                      </button>
                      <button
                        onClick={() => skipDeck("B", 10)}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5"
                        title="Forward 10 seconds"
                      >
                        <FastForward className="w-4 h-4" />
                        <span className="text-[9px]">+10s</span>
                      </button>
                      <button
                        onClick={() => changeDeckTrack("B", "next")}
                        className="py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-500/40 text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border border-white/10"
                        title="Next Track on Deck B"
                      >
                        <SkipForward className="w-4 h-4 fill-current" />
                        <span className="text-[9px]">NEXT</span>
                      </button>
                    </div>

                    {/* Row 2: DJ CUE & LOOP Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => cueDeck("B")}
                        className="py-1.5 rounded-xl glass-panel text-pink-300 hover:text-white hover:bg-pink-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-pink-500/30"
                        title="Cue / Restart from 0:00"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[10px]">CUE (0:00)</span>
                      </button>
                      <button
                        onClick={() => toggleDeckLoop("B")}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                          deckBLoop
                            ? "bg-pink-500/20 text-pink-300 border-pink-400"
                            : "glass-panel text-slate-400 hover:text-white border-white/10"
                        }`}
                        title={deckBLoop ? "Loop Enabled" : "Loop Disabled"}
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{deckBLoop ? "LOOP: ON" : "LOOP: OFF"}</span>
                      </button>
                    </div>
                  </div>

                  {/* DECK VOLUME & PITCH CONTROL ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-pink-500/20">
                    <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-pink-500/20">
                      <Volume2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={deckBVolume}
                        onChange={(e) => setDeckVol("B", parseFloat(e.target.value))}
                        className="w-full h-1 bg-pink-950/50 rounded-lg appearance-none cursor-pointer accent-pink-400"
                        title="Deck B Volume"
                      />
                      <span className="text-[10px] font-mono text-pink-300 w-7 text-right">
                        {Math.round(deckBVolume * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 glass-panel px-2.5 py-1.5 rounded-xl border border-pink-500/20">
                      <button
                        onClick={() => adjustPitch("B", -1)}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-bold text-slate-300"
                        title="Decrease Pitch"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => resetDeckPitch("B")}
                        className="px-2 py-0.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-[10px] font-mono text-pink-300"
                        title="Reset Pitch to 0"
                      >
                        {deckB.pitch >= 0 ? `+${deckB.pitch}` : deckB.pitch} ST
                      </button>
                      <button
                        onClick={() => adjustPitch("B", 1)}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-bold text-slate-300"
                        title="Increase Pitch"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* DJ CROSSFADER SLIDER SECTION */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">🎚️ DJ CROSSFADER</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCrossfader(0)}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    >
                      DECK A (0%)
                    </button>
                    <button
                      onClick={() => updateCrossfader(50)}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold bg-white/10 text-white border border-white/20"
                    >
                      50/50 BALANCED
                    </button>
                    <button
                      onClick={() => updateCrossfader(100)}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40"
                    >
                      DECK B (100%)
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={crossfader}
                  onChange={(e) => updateCrossfader(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400">◀ DECK A {Math.round(getCrossfadeVolumes(crossfader).volA * 100)}%</span>
                  <span className="text-slate-400 font-bold">{crossfader === 50 ? "● BALANCED" : `${crossfader}%`}</span>
                  <span className="text-pink-400">DECK B {Math.round(getCrossfadeVolumes(crossfader).volB * 100)}% ▶</span>
                </div>
              </div>

              {/* DJ SOUND FX SAMPLER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Disc className="w-4 h-4 text-pink-400" />
                    <span>Instant DJ FX Sound Pads</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Real-Time Web Audio Synth</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { name: "Airhorn", type: "airhorn", icon: "📢", color: "hover:border-yellow-400 text-yellow-300" },
                    { name: "Police Siren", type: "siren", icon: "🚨", color: "hover:border-red-400 text-red-300" },
                    { name: "Laser Zap", type: "laser", icon: "⚡", color: "hover:border-cyan-400 text-cyan-300" },
                    { name: "Sub Drop", type: "bassdrop", icon: "💣", color: "hover:border-purple-400 text-purple-300" },
                    { name: "Scratch", type: "scratch", icon: "🎛️", color: "hover:border-pink-400 text-pink-300" },
                  ].map((pad) => (
                    <button
                      key={pad.type}
                      onClick={() => playDjSound(pad.type as any)}
                      className={`glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all shadow-lg ${pad.color}`}
                    >
                      <span className="text-2xl">{pad.icon}</span>
                      <span className="text-xs font-bold">{pad.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PARTY MODE: FLASH SCREEN (SCREEN STROBE) - FROM APP */}
              <div className="glass-card p-6 rounded-3xl border border-yellow-500/40 space-y-5 shadow-neon">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <span>Flash Screen (Screen Strobe & Rave Light)</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Sync monitor display backlight strobe to high-energy bass and DJ tempo
                    </p>
                  </div>
                  <button
                    onClick={() => setStrobeActive(!strobeActive)}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg flex items-center gap-2 ${
                      strobeActive
                        ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-pulse"
                        : "bg-white/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                    }`}
                  >
                    <span>{strobeActive ? "⚡ STROBE ACTIVE" : "○ ACTIVATE STROBE"}</span>
                  </button>
                </div>

                {/* Strobe Color Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">Flash Color:</span>
                    <span className="font-mono text-yellow-400 font-bold">{strobeColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["White", "Cyan", "Pink", "Lime", "Disco"] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setStrobeColor(color)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          strobeColor === color
                            ? "bg-white text-black border-white shadow-md scale-105"
                            : "bg-white/5 text-slate-400 hover:text-white border-white/10"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strobe Speed Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">Strobe Frequency / Mode:</span>
                    <span className="font-mono text-cyan-400 font-bold">{strobeSpeed}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["Slow", "Medium", "Fast", "BeatSync"] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setStrobeSpeed(speed)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          strobeSpeed === speed
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-neon"
                            : "bg-white/5 text-slate-400 hover:text-white border-white/10"
                        }`}
                      >
                        {speed === "BeatSync" ? "⚡ BeatSync" : speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Launch Fullscreen Rave Button */}
                <button
                  onClick={() => setShowFullscreenRave(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-500 hover:opacity-90 text-black font-black text-xs uppercase tracking-wider shadow-neon transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>↗️ Launch Fullscreen Rave Flash Screen</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DASHBOARD (WITH APK DOWNLOAD, TERMS & PRIVACY POLICY) */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              id="dashboard-view"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Platform Dashboard & Downloads</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                  ABOUT MJ PULSE
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Official Android APK download, system specifications, creator credits, and legal policies.
                </p>
              </div>

              {/* 1. DOWNLOAD APK SECTION (Requested in Dashboard) */}
              <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-neon space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="text-center sm:text-left">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      OFFICIAL BUILD
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-1">Download MJ PULSE for Android</h3>
                    <p className="text-xs text-slate-400">Version 1.2.0 • 85 MB APK • ARM64 / ARMv7 • Android 8.0 - 15</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href="/api/download"
                      download="mjpulse.apk"
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-neon transition-all transform hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Latest APK (85 MB)</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="glass-panel p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">AUDIO ARCHITECTURE</span>
                    <span className="font-bold text-white text-sm">32-Bit Studio Float</span>
                  </div>
                  <div className="glass-panel p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">TELEMETRY & PRIVACY</span>
                    <span className="font-bold text-emerald-400 text-sm">100% Ad-Free, No Tracking</span>
                  </div>
                  <div className="glass-panel p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">PACKAGE ID</span>
                    <span className="font-bold text-cyan-300 text-sm truncate block">com.mahendrapratap.mjpulseapp</span>
                  </div>
                </div>
              </div>

              {/* THEME ENGINE: EXTENDABLE / EXPANDABLE ACCORDION PANEL (12 THEMES + DARK/LIGHT MODE) */}
              <div className="glass-card rounded-3xl border border-purple-500/30 overflow-hidden transition-all duration-300">
                {/* Accordion Header */}
                <div 
                  onClick={() => setIsThemePanelExpanded(!isThemePanelExpanded)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-white">Theme Engine & Aesthetics</h4>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          12 Themes
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Active: <strong className="text-white">{currentTheme.emoji} {currentTheme.name}</strong> • Mode: <strong className="text-cyan-300">{themeMode === "light" ? "Studio Light" : "Cyber Dark"}</strong> • Font: <strong className="text-pink-300 font-mono text-[11px]">{currentTheme.fontFamily.replace(/'/g, "")}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl text-xs font-bold glass-panel border border-purple-500/30 flex items-center gap-2 text-purple-200 hover:text-white hover:border-purple-400 transition-all shadow-sm"
                    >
                      <span>{isThemePanelExpanded ? "Collapse Panel" : "Expand Themes"}</span>
                      {isThemePanelExpanded ? (
                        <ChevronUp className="w-4 h-4 text-purple-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-purple-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accordion Expandable Body */}
                <AnimatePresence initial={false}>
                  {isThemePanelExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="p-6 sm:p-8 space-y-6 bg-black/20">
                        {/* MODE TOGGLES: CYBER DARK VS STUDIO LIGHT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              setThemeMode("dark");
                              document.body.classList.remove("light-theme");
                              try { localStorage.setItem("mjpulse_theme", "dark"); } catch (e) {}
                            }}
                            className={`p-4 rounded-2xl flex items-center justify-between border transition-all text-left ${
                              themeMode === "dark"
                                ? "bg-purple-950/60 border-purple-400 text-white shadow-neon scale-[1.01]"
                                : (themeMode === "light" ? "bg-white border-slate-300 text-slate-800 hover:border-purple-400" : "bg-white/5 border-white/10 text-slate-300 hover:text-white")
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-cyan-400">
                                <Moon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${themeMode === "dark" ? "text-white" : (themeMode === "light" ? "text-slate-900" : "text-slate-200")}`}>Cyber Dark Mode</p>
                                <p className={`text-[10px] ${themeMode === "light" ? "text-slate-600" : "text-slate-400"}`}>OLED deep space with reactive neon glow</p>
                              </div>
                            </div>
                            {themeMode === "dark" && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </button>

                          <button
                            onClick={() => {
                              setThemeMode("light");
                              document.body.classList.add("light-theme");
                              try { localStorage.setItem("mjpulse_theme", "light"); } catch (e) {}
                            }}
                            className={`p-4 rounded-2xl flex items-center justify-between border transition-all text-left ${
                              themeMode === "light"
                                ? "bg-amber-100 border-amber-500 text-slate-900 shadow-lg scale-[1.01]"
                                : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                                <Sun className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${themeMode === "light" ? "text-slate-900" : "text-white"}`}>Studio Light Mode</p>
                                <p className={`text-[10px] ${themeMode === "light" ? "text-slate-600" : "text-slate-400"}`}>Crisp high-contrast studio porcelain elegance</p>
                              </div>
                            </div>
                            {themeMode === "light" && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                          </button>
                        </div>

                        {/* 12-THEME PALETTES GRID */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                              12 Complete Mobile UI Themes & Acoustic Styles
                            </span>
                            <span className="text-[10px] text-slate-400">Click any theme to transform fonts, controls, & layout</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {UI_THEMES.map((theme) => {
                              const isSelected = selectedThemeId === theme.id;
                              return (
                                <div
                                  key={theme.id}
                                  onClick={() => handleSelectTheme(theme.id)}
                                  style={{
                                    borderRadius: `${theme.cardBorderRadius}px`,
                                    borderWidth: `${theme.cardBorderWidth}px`,
                                  }}
                                  className={`p-3.5 border transition-all cursor-pointer relative flex flex-col justify-between group ${
                                    isSelected
                                      ? "bg-purple-950/40 border-purple-400 shadow-neon scale-[1.02]"
                                      : "bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-white/10"
                                  }`}
                                >
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span 
                                        className="text-sm font-bold text-white flex items-center gap-1.5"
                                        style={{ fontFamily: theme.fontFamily }}
                                      >
                                        <span className="text-base">{theme.emoji}</span> {theme.name}
                                      </span>
                                      {isSelected ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/50 flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Active
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-slate-500 group-hover:text-purple-300">Select</span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                                      {theme.tagline}
                                    </p>
                                  </div>

                                  {/* Color Palette Swatches & Font Label */}
                                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                      <div
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: theme.primary }}
                                        title={`Primary: ${theme.primary}`}
                                      />
                                      <div
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: theme.secondary }}
                                        title={`Secondary: ${theme.secondary}`}
                                      />
                                      <div
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: theme.accent }}
                                        title={`Accent: ${theme.accent}`}
                                      />
                                    </div>
                                    <span 
                                      className="text-[10px] font-mono text-cyan-300/80 px-1.5 py-0.5 rounded bg-white/5"
                                      title={`Font: ${theme.fontFamily}`}
                                    >
                                      {theme.fontFamily.replace(/'/g, "").split(",")[0]}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. CORE TEAM CREDITS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <Code className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        ENGINEERING & ARCHITECTURE
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">Mahendra Pratap Singh Jatav</h4>
                      <p className="text-xs text-purple-300">MS Jatav • Lead Developer</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Architected the high-throughput streaming pipeline, native Android audio engines, low-latency broadcast widget synchronization, and real-time syllable karaoke synchronization.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">⚡ Audio Engine Architecture</span>
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">🤖 Native Kotlin Framework</span>
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">📡 Zero-Delay Widget Sync</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-pink-500/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                      <Palette className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                        UI / UX & PRODUCT DESIGN
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">Jaya Kushwah</h4>
                      <p className="text-xs text-pink-300">Mahi • Lead Designer</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Conceptualized the visual identity, cyberpunk color palettes, glassmorphic card design system, fluid micro-interactions, responsive turntable vinyl physics, and immersive AOD ambient screen.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">🎨 Cyberpunk Glass Design</span>
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">✨ Fluid Micro-Interactions</span>
                    <span className="glass-panel px-2.5 py-1 rounded-lg text-slate-300">🌌 Ambient AOD Experience</span>
                  </div>
                </div>
              </div>

              {/* 3. LEGAL, TERMS & CONDITIONS, PRIVACY POLICY (PERMANENTLY OPEN & STACKED VERTICALLY) */}
              <div className="space-y-6">
                {/* 1. TERMS & CONDITIONS (PERMANENTLY OPEN) */}
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-4 shadow-neon">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Terms & Conditions</h4>
                        <p className="text-xs text-slate-400">Personal fair use, streaming policies & licenses</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      License v1.2.0 • Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed pt-1">
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        1. Acceptance of Terms
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        By accessing MJ PULSE web or downloading the Android application, you agree to these Terms and Conditions. The platform is created strictly for personal entertainment and non-commercial music discovery.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        2. Streaming & Music Content
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        MJ PULSE provides high-fidelity audio streaming. Song recordings, compositions, album artwork, and artist metadata belong to their respective copyright owners. Streaming is permitted strictly under fair personal consumption.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        3. Intellectual Property Rights
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        The MJ PULSE application code, audio processing DSP engine, dynamic themes, and visualizer wave algorithms are protected by intellectual property laws. Reverse engineering or unauthorized commercial redistribution is strictly prohibited.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        4. User Accounts & Party Sync
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        When creating playlists or using the "Room" party session feature, you are responsible for maintaining session privacy. MJ PULSE never shares or sells user listening data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. PRIVACY POLICY (PERMANENTLY OPEN DIRECTLY BELOW TERMS) */}
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-4 shadow-neon-cyan">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Privacy Policy</h4>
                        <p className="text-xs text-slate-400">Zero telemetry, local storage & Google Auth security</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      100% Encrypted & Private
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed pt-1">
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        1. Zero Ad Telemetry & Tracking
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        MJ PULSE does not run behavioral advertising networks, commercial tracking cookies, or third-party analytic trackers. Your listening habits and searches remain completely private.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        2. Google Authentication Security
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        When signing in with Google via Firebase Auth, we securely authenticate your display name and email strictly to manage saved playlists and cloud favorites. No credentials are stored on external servers.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        3. Local On-Device Storage
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        Your volume preferences, custom 9-band equalizer profiles, selected themes, and offline playlists are stored locally on your device for fast zero-latency retrieval without cloud dependency.
                      </p>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5">
                      <h5 className="font-bold text-white text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        4. Data Control & Deletion
                      </h5>
                      <p className="text-slate-400 leading-relaxed">
                        You maintain complete control over your profile. Signing out or clearing local app storage immediately erases cached history, tokens, and active session states without retention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ========================================================
          12-THEMES PALETTE & AESTHETICS MODAL (ALL SCREENS POPUP)
         ======================================================== */}
      {showThemeModal && (
        <div
          onClick={() => setShowThemeModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl glass-panel-glow border border-purple-500/40 p-6 sm:p-8 rounded-3xl space-y-6 max-h-[85vh] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">12 UI Themes & Audio Acoustics</h3>
                  <p className="text-xs text-slate-400">Choose your visual color palette and reactive 3D wave visualizer theme</p>
                </div>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dark / Light Mode Switcher */}
            <div className="flex items-center justify-between p-3 rounded-2xl glass-card border border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>Display Lighting Mode:</span>
                <span className="text-purple-400">{themeMode === "dark" ? "Cyber Dark (OLED)" : "Studio Light (Clean)"}</span>
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
              >
                {themeMode === "light" ? (
                  <>
                    <Moon className="w-4 h-4 text-cyan-300" />
                    <span>Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Switch to Light</span>
                  </>
                )}
              </button>
            </div>

            {/* 12 Themes Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {UI_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-400 shadow-neon scale-[1.02]"
                          : "bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span className="text-base">{theme.emoji}</span> {theme.name}
                          </span>
                          {isSelected ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/50 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 group-hover:text-purple-300">Select</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                          {theme.tagline}
                        </p>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.primary }}
                            title={`Primary: ${theme.primary}`}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.secondary }}
                            title={`Secondary: ${theme.secondary}`}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.accent }}
                            title={`Accent: ${theme.accent}`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {theme.primary}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon transition-all"
              >
                Apply & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          FULL 9-BAND STUDIO DSP EQUALIZER MODAL (EXACT FROM APP)
         ======================================================== */}
      {showEqModal && (
        <div
          onClick={() => setShowEqModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-28 bg-black/85 backdrop-blur-lg cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl glass-panel-glow border border-purple-500/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl cursor-default"
          >
            {/* Top Right Corner Close Button */}
            <button
              onClick={() => setShowEqModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              title="Close Equalizer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-3 pr-10">
              <h4 className="font-bold text-white text-lg font-display flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                9-Band Studio DSP Equalizer
              </h4>
              <p className="text-xs text-cyan-300">32Hz - 16kHz Full Human Audio Spectrum Tuning</p>
            </div>

            {/* Presets Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acoustic Presets</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(EQ_PRESETS).map((pName) => (
                  <button
                    key={pName}
                    onClick={() => applyPreset(pName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activePreset === pName
                        ? "bg-purple-600 text-white shadow-neon"
                        : "glass-card text-slate-300 hover:text-white hover:border-purple-400"
                    }`}
                  >
                    {pName}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE 9-BAND SPECTRUM MONITOR */}
            <div className="h-20 w-full rounded-2xl bg-black/40 border border-white/10 p-3.5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-cyan-400 animate-ping" : "bg-slate-500"}`} />
                  REAL-TIME DSP HARDWARE SPECTRUM ({isPlaying ? "STREAMING" : "IDLE"})
                </span>
                <span className="text-pink-400 font-semibold">{activePreset} Mode</span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-10 w-full pt-1">
                {EQ_BANDS.map((band, idx) => {
                  const gain = eqGains[idx] || 0;
                  const baseH = isPlaying ? 35 + ((idx * 8 + 15) % 45) : 18;
                  const gainOffset = gain * 3.5;
                  const barHeight = Math.max(15, Math.min(100, baseH + gainOffset));
                  return (
                    <div key={`meter-${band.freq}`} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div
                        className="w-full rounded-t-sm transition-all duration-150"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: band.color,
                          boxShadow: isPlaying ? `0 0 10px ${band.color}` : "none",
                          opacity: isPlaying ? 0.95 : 0.4,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 9 Vertical Sliders */}
            <div className="grid grid-cols-9 gap-2 items-end pt-4 pb-2 bg-black/30 p-4 rounded-2xl border border-white/5">
              {EQ_BANDS.map((band, idx) => (
                <div key={band.freq} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono font-bold" style={{ color: band.color }}>
                    {eqGains[idx] > 0 ? `+${eqGains[idx]}` : eqGains[idx]}dB
                  </span>

                  {/* Vertical Slider Simulation */}
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={eqGains[idx]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const updated = [...eqGains];
                      updated[idx] = val;
                      setEqGains(updated);
                      setActivePreset("Custom");
                      initWebAudioAndFilters();
                      if (biquadFiltersRef.current[idx] && audioCtxRef.current) {
                        try {
                          biquadFiltersRef.current[idx].gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.05);
                        } catch (err) {}
                      }
                    }}
                    className="h-28 w-1.5 appearance-none rounded-lg cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                    style={{ accentColor: band.color }}
                  />

                  <div className="text-center mt-1">
                    <span className="block text-[9px] font-bold text-white">{band.freq}</span>
                    <span className="block text-[8px] text-slate-400 uppercase">{band.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => applyPreset("Flat")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Flat</span>
              </button>

              <button
                onClick={() => setShowEqModal(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon"
              >
                Apply 9-Band Equalizer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          UPCOMING PLAYBACK QUEUE MODAL (SAME VIBE & RELATED QUEUE)
         ======================================================== */}
      {showQueueModal && (
        <div
          onClick={() => setShowQueueModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-28 bg-black/85 backdrop-blur-lg cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl glass-panel-glow border border-amber-500/40 p-6 rounded-3xl space-y-4 max-h-[80vh] flex flex-col shadow-2xl cursor-default"
          >
            {/* Top Right Corner Close Button */}
            <button
              onClick={() => setShowQueueModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              title="Close Queue"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-white/10 pb-3 pr-10">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-amber-400" />
                  Playback Queue
                </h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {vibeQueue.length} Upcoming Songs
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Autoplaying distinct songs matching current vibe & mood
              </p>
            </div>

            {/* Now Playing Mini-Banner */}
            {currentTrack && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 shrink-0">
                <img
                  src={getAestheticArtwork(currentTrack.thumbnail, "song", currentTrack.title)}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shadow-md shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = getAestheticArtwork(null, "song", currentTrack.title + "_err");
                  }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Now Playing
                  </span>
                  <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                  <p className="text-xs text-slate-300 truncate">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-mono text-amber-300">
                    {formatSeconds(currentTime)} / {formatSeconds(duration)}
                  </span>
                </div>
              </div>
            )}

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-1 px-1">
              {vibeQueue.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Up Next</span>
                    <button
                      onClick={() => {
                        if (currentTrack) replenishVibeQueue(currentTrack, undefined, false);
                      }}
                      className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-[10px]"
                    >
                      <Sparkles className="w-3 h-3" />
                      More Like This
                    </button>
                  </div>
                  {vibeQueue.map((track, idx) => (
                    <div
                      key={track.id + "_" + idx}
                      onClick={() => {
                        playTrack(track, undefined, vibeQueue.slice(idx + 1));
                      }}
                      className="group flex items-center gap-3 p-2.5 rounded-2xl glass-card hover:bg-white/10 hover:border-amber-400/50 transition-all cursor-pointer border border-white/5"
                    >
                      <span className="w-5 text-center text-xs font-mono text-slate-500 group-hover:text-amber-400 font-bold">
                        {idx + 1}
                      </span>
                      <img
                        src={getAestheticArtwork(track.thumbnail, "song", track.title)}
                        alt={track.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = getAestheticArtwork(null, "song", track.title + "_err");
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                          {track.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {track.durationFormatted && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {track.durationFormatted}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVibeQueue((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-all"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs space-y-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-amber-300 font-bold">Curating Automatic Vibe Queue...</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Loading matching tracks for continuous playback.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          SYNCED KARAOKE LYRICS MODAL (FIXED & SCROLLING)
         ======================================================== */}
      {showLyricsModal && (
        <div
          onClick={() => setShowLyricsModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-28 bg-black/85 backdrop-blur-lg cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-panel-glow border border-purple-500/40 p-6 rounded-3xl space-y-4 max-h-[80vh] flex flex-col shadow-2xl cursor-default"
          >
            {/* Top Right Corner Close Button */}
            <button
              onClick={() => setShowLyricsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              title="Close Lyrics"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-3 pr-10">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  Karaoke Lyrics
                </h4>
                {isLyricsSynced ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    ⚡ Live Synced
                  </span>
                ) : (
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                    📜 Full Lyrics
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-300 truncate max-w-sm mt-0.5">{currentTrack?.title} — {currentTrack?.artist}</p>
            </div>

            <div ref={lyricsContainerRef} onScroll={handleLyricsScroll} className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 py-4 px-3">
              {loadingLyrics ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Fetching synced lyrics...
                </div>
              ) : lyrics.length > 0 ? (
                lyrics.map((line, idx) => {
                  const isCurrent = isLyricsSynced && idx === activeLyricIndex;
                  return (
                    <div
                      key={idx}
                      ref={isCurrent ? activeLyricRef : null}
                      onClick={() => {
                        if (isLyricsSynced && line.timeSec >= 0 && audioRef.current) {
                          audioRef.current.currentTime = line.timeSec;
                          setCurrentTime(line.timeSec);
                        }
                      }}
                      className={`text-sm leading-relaxed transition-all duration-200 cursor-pointer rounded-2xl px-5 py-3 mx-0.5 ${
                        isCurrent
                          ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/20 text-cyan-300 font-extrabold text-base border-2 border-cyan-400/80 text-glow-cyan shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <p className="leading-relaxed break-words">{line.text}</p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <p>No synced lyrics found for this track.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Enjoy the lossless audio playback!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* FULLSCREEN RAVE FLASH SCREEN OVERLAY (FROM APP) */}
      {showFullscreenRave && (
        <div
          onClick={() => setShowFullscreenRave(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 cursor-pointer select-none transition-colors duration-75"
          style={{
            backgroundColor: flashIntensity > 0 ? getFlashColorHex() : "#000000",
          }}
        >
          <div className="w-full flex justify-end">
            <button
              onClick={() => setShowFullscreenRave(false)}
              className="px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white font-bold text-xs border border-white/30 backdrop-blur-md shadow-2xl flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Exit Rave Screen (ESC)</span>
            </button>
          </div>

          <div className="text-center bg-black/75 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/20 shadow-2xl space-y-2">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
              ⚡ FULLSCREEN RAVE STROBE
            </h2>
            <p className="text-xs text-yellow-300 font-bold">
              Color: {strobeColor} • Speed: {strobeSpeed}
            </p>
            <p className="text-[10px] text-slate-300">
              Tap anywhere on the screen to exit
            </p>
          </div>

          <div className="text-[11px] text-white/70 font-mono">
            MJ PULSE ULTRA STROBE ENGINE
          </div>
        </div>
      )}

      {/* ========================================================
          TERMS & CONDITIONS POPUP (IN-APP DIALOG - NOT A NEW PAGE)
         ======================================================== */}
      {showTermsModal && (
        <div
          onClick={() => setShowTermsModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl glass-panel-glow border border-purple-500/40 p-6 sm:p-8 rounded-3xl space-y-4 max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-purple-400 hover:text-white p-1 rounded-lg hover:bg-white/10 flex items-center gap-1 text-xs"
                >
                  <span>← Back</span>
                </button>
                <div className="flex items-center gap-2 ml-1">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Terms & Conditions</h3>
                </div>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 pr-2 leading-relaxed">
              <div>
                <h5 className="font-bold text-white text-sm">1. Acceptance of Terms</h5>
                <p className="mt-1">By accessing MJ PULSE web or downloading the Android application, you agree to these Terms and Conditions. The platform is created strictly for personal entertainment.</p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm">2. Streaming & Music Content</h5>
                <p className="mt-1">MJ PULSE provides high-fidelity audio streaming. Song recordings, compositions, album artwork, and artist metadata belong to their respective copyright owners. Streaming is permitted strictly under fair personal consumption.</p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm">3. Intellectual Property Rights</h5>
                <p className="mt-1">The MJ PULSE application code, audio processing engine, dynamic themes, and visualizer designs are protected by intellectual property laws. Reverse engineering or unauthorized commercial redistribution is strictly prohibited.</p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm">4. User Accounts & Party Sync</h5>
                <p className="mt-1">When creating playlists or using the "Room" party session feature, you are responsible for maintaining session privacy. MJ PULSE never sells user data.</p>
              </div>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon"
            >
              Close & Return to Dashboard
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          PRIVACY POLICY POPUP (IN-APP DIALOG - NOT A NEW PAGE)
         ======================================================== */}
      {showPrivacyModal && (
        <div
          onClick={() => setShowPrivacyModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl glass-panel-glow border border-cyan-500/40 p-6 sm:p-8 rounded-3xl space-y-4 max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-cyan-400 hover:text-white p-1 rounded-lg hover:bg-white/10 flex items-center gap-1 text-xs"
                >
                  <span>← Back</span>
                </button>
                <div className="flex items-center gap-2 ml-1">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Privacy Policy</h3>
                </div>
              </div>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 pr-2 leading-relaxed">
              <div>
                <h5 className="font-bold text-white text-sm">1. Zero Ad Telemetry & Tracking</h5>
                <p className="mt-1">MJ PULSE does not run behavioral advertising networks, commercial tracking cookies, or third-party analytic trackers. Your listening habits remain private.</p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm">2. Google Authentication Security</h5>
                <p className="mt-1">When signing in with Google via Firebase Auth, we securely authenticate your display name and email strictly to manage saved playlists and cloud favorites.</p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm">3. Local On-Device Storage</h5>
                <p className="mt-1">Your volume preferences, custom 9-band equalizer profiles, and offline playlists are stored locally on your device for fast zero-latency retrieval.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shadow-neon-cyan"
            >
              Close & Return to Dashboard
            </button>
          </motion.div>
        </div>
      )}

      {/* SONG PICKER MODAL FOR DECK A / DECK B WITH LIVE ONLINE SEARCH */}
      {activeDeckSongModal && (
        <div
          onClick={() => {
            setActiveDeckSongModal(null);
            setDeckSearchQuery("");
            setDeckSearchResults([]);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-28 bg-black/85 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg glass-panel-glow border border-purple-500/40 p-6 rounded-3xl space-y-4 max-h-[85vh] flex flex-col shadow-2xl cursor-default"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${activeDeckSongModal === "A" ? "bg-cyan-400 shadow-[0_0_8px_#06b6d4]" : "bg-pink-400 shadow-[0_0_8px_#ec4899]"}`} />
                <h4 className="font-bold text-white text-base">
                  Choose Song for DECK {activeDeckSongModal}
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveDeckSongModal(null);
                  setDeckSearchQuery("");
                  setDeckSearchResults([]);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIVE SONG SEARCH INPUT */}
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={deckSearchQuery}
                onChange={(e) => handleDeckSearch(e.target.value)}
                placeholder={`Search songs online for Deck ${activeDeckSongModal}...`}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl glass-panel text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-all border border-purple-500/30"
                autoFocus
              />
              {deckSearchQuery && (
                <button
                  onClick={() => {
                    setDeckSearchQuery("");
                    setDeckSearchResults([]);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* TRACKS LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 min-h-[260px]">
              {isDeckSearching ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                  <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Searching tracks...</span>
                </div>
              ) : deckSearchQuery.trim() !== "" ? (
                deckSearchResults.length > 0 ? (
                  <>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
                      Search Results ({deckSearchResults.length})
                    </p>
                    {deckSearchResults.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (activeDeckSongModal === "A") {
                            setDeckA((prev) => ({
                              ...prev,
                              track: t,
                              title: t.title,
                              artist: t.artist,
                              isPlaying: false,
                            }));
                            if (deckAAudioRef.current) deckAAudioRef.current.currentTime = 0;
                          } else {
                            setDeckB((prev) => ({
                              ...prev,
                              track: t,
                              title: t.title,
                              artist: t.artist,
                              isPlaying: false,
                            }));
                            if (deckBAudioRef.current) deckBAudioRef.current.currentTime = 0;
                          }
                          setActiveDeckSongModal(null);
                          setDeckSearchQuery("");
                          setDeckSearchResults([]);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl glass-card hover:border-purple-400 cursor-pointer transition-all hover:bg-white/5"
                      >
                        <img 
                          src={getAestheticArtwork(t.thumbnail, "song", t.title)} 
                          alt={t.title} 
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getAestheticArtwork(null, "song", t.title + "_err");
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{t.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{t.artist}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${activeDeckSongModal === "A" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-pink-500/20 text-pink-300 border border-pink-500/30"}`}>
                          Load
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <p>No songs found for &quot;{deckSearchQuery}&quot;</p>
                    <p className="text-[10px] text-slate-500 mt-1">Try another song or artist name</p>
                  </div>
                )
              ) : (
                <>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
                    Featured & Library Tracks
                  </p>
                  {appTracks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (activeDeckSongModal === "A") {
                          setDeckA((prev) => ({
                            ...prev,
                            track: t,
                            title: t.title,
                            artist: t.artist,
                            isPlaying: false,
                          }));
                          if (deckAAudioRef.current) deckAAudioRef.current.currentTime = 0;
                        } else {
                          setDeckB((prev) => ({
                            ...prev,
                            track: t,
                            title: t.title,
                            artist: t.artist,
                            isPlaying: false,
                          }));
                          if (deckBAudioRef.current) deckBAudioRef.current.currentTime = 0;
                        }
                        setActiveDeckSongModal(null);
                        setDeckSearchQuery("");
                        setDeckSearchResults([]);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl glass-card hover:border-purple-400 cursor-pointer transition-all hover:bg-white/5"
                    >
                      <img 
                        src={getAestheticArtwork(t.thumbnail, "song", t.title)} 
                        alt={t.title} 
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getAestheticArtwork(null, "song", t.title + "_err");
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{t.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{t.artist}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${activeDeckSongModal === "A" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-pink-500/20 text-pink-300 border border-pink-500/30"}`}>
                        Load
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM DOCK BAR (HOME, SEARCH, PARTY MODE, DASHBOARD)
         ======================================================== */}
      <nav className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="glass-panel-glow border border-purple-500/30 px-3 py-2 rounded-full flex items-center gap-1 sm:gap-2 shadow-2xl pointer-events-auto">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "search", label: "Search Song", icon: Search },
            { id: "partymode", label: "Party Mode", icon: Sparkles },
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "theme-btn-gradient text-white shadow-neon"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================
          PERSISTENT FLOATING AUDIO PLAYER BAR (BOTTOM OF SCREEN)
         ======================================================== */}
      <div className="sticky bottom-0 left-0 right-0 z-[70] glass-panel-glow border-t border-purple-500/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Track Info */}
          <div className="flex items-center gap-3 w-full md:w-1/4">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
              <img
                src={getAestheticArtwork(currentTrack?.thumbnail, "song", currentTrack?.title || "Music")}
                alt={currentTrack?.title || "Track"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getAestheticArtwork(null, "song", (currentTrack?.title || "Music") + "_err");
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                {currentTrack?.title || "Select a song"}
              </h5>
              <p className="text-[10px] text-slate-400 truncate">
                {currentTrack?.artist || "MJ Pulse Audio"}
              </p>
            </div>
            <button
              onClick={() => currentTrack && toggleFavorite(currentTrack.id)}
              className="text-slate-400 hover:text-pink-500 p-1"
            >
              <Heart
                className={`w-4 h-4 ${
                  currentTrack && favorites.includes(currentTrack.id)
                    ? "fill-pink-500 text-pink-500"
                    : ""
                }`}
              />
            </button>
          </div>

          {/* Controls & Progress */}
          <div className="flex-1 max-w-xl w-full flex flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleShuffle} 
                className={`transition-colors p-1.5 rounded-full hover:bg-white/10 ${isShuffle ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-slate-400 hover:text-white"}`}
                title={isShuffle ? "Shuffle ON" : "Shuffle OFF"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button onClick={handlePrev} className="text-slate-400 hover:text-white p-1">
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className="w-9 h-9 rounded-full theme-btn-gradient text-white flex items-center justify-center shadow-neon hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button onClick={() => handleNext(false)} className="text-slate-400 hover:text-white p-1">
                <SkipForward className="w-4 h-4" />
              </button>

              <button 
                onClick={toggleRepeatMode} 
                className={`transition-colors p-1.5 rounded-full hover:bg-white/10 relative flex items-center gap-0.5 ${repeatMode !== "OFF" ? "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" : "text-slate-400 hover:text-white"}`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "ONE" ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
                {repeatMode !== "OFF" && (
                  <span className="text-[9px] font-black uppercase -ml-0.5">{repeatMode === "ONE" ? "1" : "All"}</span>
                )}
              </button>
            </div>

            <div className="w-full flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>{formatSeconds(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onInput={handleSeekInput}
                onPointerUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Controls: Queue, Lyrics, Equalizer, Share, Vertical Volume */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 w-full md:w-1/4">
            {/* Queue Toggle */}
            <button
              onClick={() => {
                setShowLyricsModal(false);
                setShowEqModal(false);
                setShowVolumePopup(false);
                setShowQueueModal((prev) => !prev);
              }}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                showQueueModal
                  ? "bg-amber-500/30 text-amber-300 border-amber-400 shadow-neon"
                  : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Upcoming Playback Queue"
            >
              <ListMusic className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline text-[11px] font-bold">Queue</span>
              {vibeQueue.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">
                  {vibeQueue.length}
                </span>
              )}
            </button>

            {/* Lyrics Toggle */}
            <button
              onClick={() => {
                setShowEqModal(false);
                setShowQueueModal(false);
                setShowVolumePopup(false);
                setShowLyricsModal((prev) => !prev);
              }}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                showLyricsModal
                  ? "bg-purple-600/30 text-purple-300 border-purple-400 shadow-neon"
                  : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="Karaoke Synced Lyrics"
            >
              <Music className="w-4 h-4 text-pink-400" />
              <span className="hidden xl:inline text-[11px] font-bold">Lyrics</span>
            </button>

            {/* Equalizer Toggle */}
            <button
              onClick={() => {
                setShowLyricsModal(false);
                setShowQueueModal(false);
                setShowVolumePopup(false);
                initWebAudioAndFilters();
                setShowEqModal((prev) => !prev);
              }}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                showEqModal
                  ? "bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-neon"
                  : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title="9-Band Studio Equalizer"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-[11px] font-bold">EQ</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                if (!currentTrack) return;
                const shareText = `🎵 Streaming "${currentTrack.title}" by ${currentTrack.artist} on MJ Pulse!\nhttps://mj-pulse.web.app`;
                if (navigator.share) {
                  navigator.share({
                    title: currentTrack.title,
                    text: shareText,
                    url: "https://mj-pulse.web.app",
                  }).catch(() => {});
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(shareText);
                  alert(`Copied song link to clipboard:\n${currentTrack.title} - ${currentTrack.artist}`);
                }
              }}
              className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 hover:bg-white/5 transition-all"
              title="Share Song"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Vertical Volume Button & Animated Popup */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLyricsModal(false);
                  setShowEqModal(false);
                  setShowQueueModal(false);
                  setShowVolumePopup((prev) => !prev);
                }}
                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-all ${
                  showVolumePopup
                    ? "bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-neon"
                    : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}% (Click for vertical slider)`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Vertical Volume Slider Popup */}
              {showVolumePopup && (
                <>
                  <div
                    onClick={() => setShowVolumePopup(false)}
                    className="fixed inset-0 z-[75]"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full mb-3 right-0 z-[80] glass-panel-glow border border-cyan-500/40 rounded-2xl p-3 flex flex-col items-center gap-2.5 shadow-2xl backdrop-blur-2xl bg-black/95 w-14"
                  >
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                    <div className="h-32 flex items-center justify-center py-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-28 h-2 -rotate-90 origin-center accent-cyan-400 bg-slate-700/80 rounded-lg appearance-none cursor-pointer"
                        title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                      />
                    </div>
                    <button
                      onClick={toggleMute}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* USER PROFILE MODAL */}
      {showProfileModal && user && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProfileModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm glass-panel-glow border border-purple-500/40 p-6 rounded-3xl space-y-6 shadow-2xl cursor-default"
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              {getUserAvatarUrl(user) ? (
                <img
                  src={getUserAvatarUrl(user)!}
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-16 h-16 rounded-full mx-auto border-2 border-cyan-400 shadow-neon object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-600 mx-auto flex items-center justify-center text-xl font-bold">
                  {user.displayName?.[0] || "U"}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{user.displayName || "MJ Pulse Listener"}</h3>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Saved Favorites</span>
                <span className="font-bold text-pink-400">{favorites.length} Songs</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Audio Engine</span>
                <span className="font-bold text-emerald-400">32-Bit Studio Float</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-xs border border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of MJ Pulse</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* MULTI-PROVIDER SIGN IN MODAL (GOOGLE, FACEBOOK, PHONE OTP) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-panel-glow border border-purple-500/40 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl"
          >
            <button
              onClick={() => {
                setShowLoginModal(false);
                setAuthErrorMessage(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[2px] shadow-neon">
                <div className="w-full h-full bg-[#0a0a12] rounded-2xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-display font-black text-white">Sign In to MJ PULSE</h3>
              <p className="text-xs text-slate-300">
                {loginModalReason || "Sign in to sync your playlists, favorites, and settings across mobile app and web."}
              </p>
            </div>

            {/* Login Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                onClick={() => {
                  setLoginTab("google");
                  setAuthErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  loginTab === "google"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Google
              </button>
              <button
                onClick={() => {
                  setLoginTab("facebook");
                  setAuthErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  loginTab === "facebook"
                    ? "bg-[#1877F2] text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Facebook
              </button>
              <button
                onClick={() => {
                  setLoginTab("phone");
                  setAuthErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  loginTab === "phone"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Phone OTP
              </button>
            </div>

            {authErrorMessage && (
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center">
                {authErrorMessage}
              </div>
            )}

            {/* TAB 1: GOOGLE */}
            {loginTab === "google" && (
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            )}

            {/* TAB 2: FACEBOOK */}
            {loginTab === "facebook" && (
              <div className="space-y-4">
                <button
                  onClick={handleFacebookLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-xl transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>
            )}

            {/* TAB 3: PHONE OTP */}
            {loginTab === "phone" && (
              <div className="space-y-4">
                {!phoneOtpSent ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3.5 text-cyan-400" />
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Enter Mobile Number"
                          className="w-full pl-9 pr-3 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSendPhoneOtp}
                      disabled={phoneAuthLoading}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm shadow-xl transition-all"
                    >
                      {phoneAuthLoading ? "Sending OTP..." : "Send Verification OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-200 text-xs space-y-1">
                      <p className="font-semibold flex items-center justify-between">
                        <span>Verification Code Sent!</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 uppercase font-mono">
                          {otpProviderUsed || "SMS / WhatsApp"}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        {otpSuccessMessage || "Check your SMS / WhatsApp for the 6-digit verification code."}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpInput}
                        onChange={(e) => setPhoneOtpInput(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full text-center tracking-[0.5em] py-3 rounded-2xl bg-black/40 border border-white/10 text-white font-mono text-lg font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      onClick={handleVerifyPhoneOtp}
                      disabled={phoneAuthLoading}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-xl transition-all"
                    >
                      {phoneAuthLoading ? "Verifying..." : "Verify & Sign In"}
                    </button>

                    <button
                      onClick={() => {
                        setPhoneOtpSent(false);
                        setPhoneOtpInput("");
                        setWebConfirmationResult(null);
                      }}
                      className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
                    >
                      Change phone number or resend
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* SPOTIFY-STYLE ONBOARDING / PROFILE SETUP MODAL */}
      {showOnboardingModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg max-h-[92vh] glass-panel-glow border border-purple-500/50 p-5 sm:p-7 rounded-3xl space-y-5 shadow-2xl flex flex-col my-auto"
          >
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 p-[2px] shadow-neon">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                Welcome to MJ PULSE 🎵
              </h3>
              <p className="text-xs text-slate-300">
                Setup your profile and customize your music taste just like Spotify!
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="space-y-5 overflow-y-auto pr-1 max-h-[60vh] custom-scrollbar">
              {/* Profile Avatar & Name */}
              <div className="glass-panel p-4 rounded-2xl space-y-3 border border-white/10">
                <div className="flex items-center gap-3">
                  {getUserAvatarUrl(user) ? (
                    <img
                      src={getUserAvatarUrl(user)!}
                      alt={onboardingName || "User"}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-14 h-14 rounded-full border-2 border-cyan-400 object-cover shadow-neon shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-neon">
                      {onboardingName?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Your Name / Display Name
                    </label>
                    <input
                      type="text"
                      value={onboardingName}
                      onChange={(e) => setOnboardingName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <span>Gender</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Select one)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Male", emoji: "👨 Male" },
                    { label: "Female", emoji: "👩 Female" },
                    { label: "Other", emoji: "🌈 Other" },
                    { label: "Prefer not to say", emoji: "🔒 Secret" }
                  ].map((g) => {
                    const isSelected = onboardingGender === g.label;
                    return (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => setOnboardingGender(g.label)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-purple-600 border-purple-400 text-white shadow-neon"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {g.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages / Channels Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
                  <span>Music Languages / Channels</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {onboardingLanguages.length} selected
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ONBOARDING_LANGUAGES.map((lang) => {
                    const isSelected = onboardingLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setOnboardingLanguages(onboardingLanguages.filter((l) => l !== lang));
                          } else {
                            setOnboardingLanguages([...onboardingLanguages, lang]);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-teal-600 border-teal-400 text-white shadow-[0_0_12px_rgba(20,184,166,0.5)]"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Music Genres / Interests Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
                  <span>Music Genres & Interests</span>
                  <span className="text-[10px] text-pink-400 font-mono">
                    {onboardingGenres.length} selected
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ONBOARDING_GENRES.map((genre) => {
                    const isSelected = onboardingGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setOnboardingGenres(onboardingGenres.filter((g) => g !== genre));
                          } else {
                            setOnboardingGenres([...onboardingGenres, genre]);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-pink-600 border-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected ? `✓ ${genre}` : `+ ${genre}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favorite Artists Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
                  <span>Favorite Artists</span>
                  <span className="text-[10px] text-purple-400 font-mono">
                    {onboardingArtists.length} selected
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ONBOARDING_ARTISTS.map((artist) => {
                    const isSelected = onboardingArtists.includes(artist);
                    return (
                      <button
                        key={artist}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setOnboardingArtists(onboardingArtists.filter((a) => a !== artist));
                          } else {
                            setOnboardingArtists([...onboardingArtists, artist]);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-purple-600 border-purple-400 text-white shadow-neon"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected ? `✓ ${artist}` : `+ ${artist}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2 border-t border-white/10">
              <button
                onClick={handleSaveOnboardingProfile}
                disabled={onboardingSaving}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {onboardingSaving ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Save & Start Listening 🚀</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowOnboardingModal(false);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI VOICE ASSISTANT MODAL OVERLAY */}
      {isVoiceAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-panel-glow border border-purple-500/50 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl text-center"
          >
            <button
              onClick={() => {
                setIsVoiceAssistantOpen(false);
                if (isVoiceListening && speechRecognitionRef.current) {
                  try { speechRecognitionRef.current.stop(); } catch {}
                }
                setIsVoiceListening(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Animated Microphone Orb */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-rose-500 opacity-30 ${
                  isVoiceListening ? "animate-ping" : ""
                }`}
              />
              <button
                onClick={handleToggleVoiceAssistant}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-neon transition-transform active:scale-95 ${
                  isVoiceListening
                    ? "bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-[0_0_30px_rgba(244,63,94,0.7)]"
                    : "bg-gradient-to-tr from-purple-600 to-cyan-500 text-white"
                }`}
              >
                {isVoiceListening ? (
                  <Mic className="w-9 h-9 animate-bounce" />
                ) : (
                  <MicOff className="w-9 h-9 opacity-80" />
                )}
              </button>
            </div>

            <div>
              <h3 className="text-xl font-display font-black text-white">
                {isVoiceListening ? "Listening to Your Voice..." : "AI Voice Assistant"}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {isVoiceListening
                  ? "Speak any command: 'Play Arijit Singh', 'Pause', 'Next', 'Search songs'"
                  : "Tap the microphone to speak"}
              </p>
            </div>

            {/* Audio Visualizer Waveforms */}
            {isVoiceListening && (
              <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                {[40, 75, 55, 90, 65, 80, 50, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] }}
                    transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: "easeInOut" }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-rose-400"
                  />
                ))}
              </div>
            )}

            {/* Transcript & Feedback Card */}
            <div className="glass-panel p-4 rounded-2xl text-left space-y-2 border border-white/10">
              {voiceCommandText && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">You Said:</span>
                  <p className="text-sm font-semibold text-cyan-300">"{voiceCommandText}"</p>
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MJ Assistant:</span>
                <p className="text-xs text-slate-200 mt-0.5">{voiceAssistantReply}</p>
              </div>
            </div>

            {/* Quick Command Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {[
                "Play Kesariya",
                "Play Arijit Singh",
                "Pause",
                "Next Song",
                "Search Romantic",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => processVoiceCommand(chip)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          BROWSE & DISCOVER MODAL (MOBILE-STYLE APP SCREEN)
         ======================================================== */}
      {showBrowseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
              themeMode === "light"
                ? "bg-white/95 border-purple-200 text-slate-900 shadow-[0_20px_50px_rgba(147,51,234,0.15)]"
                : "bg-[#0c0a15]/95 border-purple-500/40 text-slate-100 shadow-neon"
            }`}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                {selectedBrowseItem ? (
                  <button
                    onClick={() => setSelectedBrowseItem(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Categories</span>
                  </button>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                    {selectedBrowseItem ? selectedBrowseItem.title : "Browse & Discover"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {selectedBrowseItem
                      ? selectedBrowseItem.subtitle
                      : "Explore handpicked genres, top artists, moods & curated music vaults"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowBrowseModal(false);
                  setSelectedBrowseItem(null);
                }}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
              {!selectedBrowseItem ? (
                <>
                  {/* CATEGORY FILTER PILLS */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {["All", ...BROWSE_CATEGORIES_DATA.map((c) => c.category)].map((filterTitle) => {
                      const isActive = browseCategoryFilter === filterTitle;
                      return (
                        <button
                          key={filterTitle}
                          onClick={() => setBrowseCategoryFilter(filterTitle)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon"
                              : "glass-card text-slate-300 hover:text-white hover:border-purple-400"
                          }`}
                        >
                          {filterTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* CATEGORY GROUPS WITH HORIZONTAL ALBUM CAROUSELS (MATCHING MOBILE APP) */}
                  <div className="space-y-7">
                    {BROWSE_CATEGORIES_DATA.filter((group) =>
                      browseCategoryFilter === "All" ? true : group.category === browseCategoryFilter
                    ).map((group) => (
                      <div key={group.category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-neon" />
                            <span>{group.category}</span>
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {group.items.length} vibes
                          </span>
                        </div>

                        {/* Horizontal Carousel for Collection Cards */}
                        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none scroll-smooth">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectBrowseItem(item)}
                              className="w-48 sm:w-56 shrink-0 group cursor-pointer glass-card p-3 rounded-2xl flex flex-col justify-between hover:border-purple-500/60 hover:shadow-neon transition-all transform hover:-translate-y-1.5"
                            >
                              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-slate-900 shadow-md">
                                <img
                                  src={getAestheticArtwork(item.image, "playlist", item.title)}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src = getAestheticArtwork(null, "playlist", item.title + "_err");
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-purple-400 truncate mt-0.5 font-semibold">
                                  {item.isSerial ? "Serial Episodes →" : "Explore →"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* SUB-SCREEN: DISPLAY TRACKS FOR SELECTED BROWSE ITEM */
                <div className="space-y-6">
                  {/* COLLECTION HERO HEADER */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl glass-panel-glow border border-purple-500/30">
                    <img
                      src={getAestheticArtwork(selectedBrowseItem.image, "playlist", selectedBrowseItem.title)}
                      alt={selectedBrowseItem.title}
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-2xl border border-white/10 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = getAestheticArtwork(null, "playlist", selectedBrowseItem.title + "_err");
                      }}
                    />
                    <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-block">
                          {selectedBrowseItem.isSerial ? "SERIAL SHOW VAULT" : "COLLECTION VAULT"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block">
                          {displayedBrowseTracks.length} available
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black font-display text-white truncate">
                        {activePartition ? `${selectedBrowseItem.title} • ${activePartition.name}` : selectedBrowseItem.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                        {activePartition ? `Streaming ${activePartition.name} episodes` : selectedBrowseItem.subtitle}
                      </p>

                      {/* Search & Actions Bar */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                          onClick={() => {
                            if (displayedBrowseTracks.length > 0) {
                              playTrack(displayedBrowseTracks[0], undefined, displayedBrowseTracks);
                            }
                          }}
                          disabled={isLoadingBrowseTracks || displayedBrowseTracks.length === 0}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-neon transition-all disabled:opacity-50 shrink-0"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Play All {selectedBrowseItem.isSerial ? "Episodes" : "Tracks"}</span>
                        </button>

                        <button
                          onClick={() => {
                            const plTitle = activePartition ? `${selectedBrowseItem.title} - ${activePartition.name}` : selectedBrowseItem.title;
                            const shareText = `🎵 Check out playlist "${plTitle}" on MJ Pulse!\nhttps://extracted-api.vercel.app`;
                            if (navigator.share) {
                              navigator.share({
                                title: plTitle,
                                text: shareText,
                                url: "https://extracted-api.vercel.app",
                              }).catch(() => {});
                            } else if (navigator.clipboard) {
                              navigator.clipboard.writeText(shareText);
                              alert(`Copied playlist link to clipboard:\n${plTitle}`);
                            }
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all shrink-0"
                          title="Share Playlist"
                        >
                          <Share2 className="w-4 h-4 text-emerald-400" />
                          <span>Share Playlist</span>
                        </button>

                        {/* Internal collection search input */}
                        <div className="relative w-full sm:max-w-xs">
                          <input
                            type="text"
                            placeholder={`Search in ${activePartition ? activePartition.name : selectedBrowseItem.title}...`}
                            value={subSearchQuery}
                            onChange={(e) => setSubSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          {subSearchQuery && (
                            <button
                              onClick={() => setSubSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INFINITE HORIZONTAL PARTITION CHIPS BAR (Up to 500 Unique Categories without Repetition) */}
                  {partitionChips && partitionChips.length > 0 && (
                    <div className="space-y-1.5 bg-black/20 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Sub-Categories & Vaults ({partitionChips.length})</span>
                        </span>
                        <span className="text-[11px] text-cyan-400 font-medium">Swipe horizontally →</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
                        {partitionChips.map((part) => {
                          const isActive = activePartition?.id === part.id;
                          return (
                            <button
                              key={part.id}
                              onClick={() => handleSelectPartition(part)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                                isActive
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon scale-105 border border-cyan-400"
                                  : "glass-card text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/10"
                              }`}
                            >
                              {part.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TRACKS LIST */}
                  <div className="space-y-2">
                    {isLoadingBrowseTracks ? (
                      <div className="py-20 text-center text-slate-400 text-xs">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading collection tracks for {selectedBrowseItem.title}...
                      </div>
                    ) : displayedBrowseTracks.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs">
                        {subSearchQuery ? `No matching tracks found for "${subSearchQuery}".` : "No tracks found for this collection."}
                      </div>
                    ) : (
                      displayedBrowseTracks
                        .filter((track): track is Track => Boolean(track && track.id))
                        .map((track, idx) => {
                          const isCurrent = currentTrack?.id === track.id;
                          const isSerial = !!selectedBrowseItem.isSerial;
                          const epNum = extractEpisodeNumber(track.title || "");
                          const epBadge = isSerial
                            ? (epNum !== 999 ? `EP ${epNum}` : `EP ${idx + 1}`)
                            : `${idx + 1}`;

                          return (
                            <div
                              key={`${track.id}-${idx}`}
                              onClick={() => playTrack(track, undefined, displayedBrowseTracks)}
                              className={`flex items-center justify-between p-3 rounded-xl glass-card transition-all cursor-pointer group ${
                                isCurrent
                                  ? "border-purple-500 bg-purple-950/30 shadow-neon"
                                  : "hover:border-purple-500/40 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <span
                                  className={`text-center font-mono font-bold shrink-0 ${
                                    isSerial
                                      ? "text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                      : idx === 0
                                      ? "w-6 text-xs text-yellow-400 font-black"
                                      : idx === 1
                                      ? "w-6 text-xs text-slate-300 font-black"
                                      : idx === 2
                                      ? "w-6 text-xs text-amber-500 font-black"
                                      : "w-6 text-xs text-slate-400 group-hover:text-cyan-300"
                                  }`}
                                >
                                  {epBadge}
                                </span>
                                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/5">
                                  <img
                                    src={getAestheticArtwork(track.thumbnail, "song", track.title)}
                                    alt={track.title || "Track"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = getAestheticArtwork(null, "song", (track.title || "Track") + "_err");
                                    }}
                                  />
                                  {isCurrent && isPlaying && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                      <div className="flex items-end gap-[2px] h-3">
                                        <span className="w-[3px] bg-cyan-400 animate-pulse h-full" />
                                        <span className="w-[3px] bg-pink-400 animate-pulse h-2" />
                                        <span className="w-[3px] bg-purple-400 animate-pulse h-full" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4
                                    className={`text-xs sm:text-sm font-semibold truncate ${
                                      isCurrent ? "text-cyan-300" : "text-white group-hover:text-purple-300"
                                    }`}
                                  >
                                    {track.title || "Unknown Title"}
                                  </h4>
                                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                                    {track.artist || "Unknown Artist"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-3">
                                <span className="text-[11px] font-mono text-slate-400">
                                  {formatSeconds(track.duration || 180)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playTrack(track, undefined, displayedBrowseTracks);
                                  }}
                                  className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-purple-600 text-slate-300 group-hover:text-white flex items-center justify-center transition-all shadow"
                                >
                                  {isCurrent && isPlaying ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
