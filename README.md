# 🎵 MJ PULSE — High-Fidelity Music Streaming Ecosystem

[![Live Website](https://img.shields.io/badge/Live%20Website-MJ%20PULSE%20Online-00F2FE?style=for-the-badge&logo=vercel&logoColor=white)](https://web-sigma-puce-cwpj9hlpv7.vercel.app)
[![Download APK](https://img.shields.io/badge/Download-Android%20APK%20(v1.0.0)-FF007F?style=for-the-badge&logo=android&logoColor=white)](https://github.com/Mahendrajatav2006/music-app/releases/latest/download/MJPulse-Music.apk)

Comprehensive multi-platform music ecosystem featuring a **Native Android Mobile App** (`/app`) and a **Next.js 14 Web Player & Master Admin Dashboard** (`/web`).

---

## ⚡ Quick Links & Live Website

- 🌐 **Permanent Live Website URL**: **[https://web-sigma-puce-cwpj9hlpv7.vercel.app](https://web-sigma-puce-cwpj9hlpv7.vercel.app)** *(24x7 Hamesha Live)*
- 🌐 **Backup Live URL**: **[https://web-c34d3ff7k-mahendrajatav2006.vercel.app](https://web-c34d3ff7k-mahendrajatav2006.vercel.app)**
- 📱 **Download Android App (APK)**: [Download MJPulse-Music.apk](https://github.com/Mahendrajatav2006/music-app/releases/latest/download/MJPulse-Music.apk)
- 📦 **All Releases**: [GitHub Releases Page](https://github.com/Mahendrajatav2006/music-app/releases)

---

## 🌟 Key Features

### 🌐 Next.js Web Player & Dashboard (`/web`)
- **Neon Dark Glassmorphism UI**: High-impact, responsive dark dashboard matching reference designs with 3D music graphics and live soundwave spectrums.
- **Full Working Functionality**:
  - Live search across extensive catalogs with instant playback.
  - Interactive bottom music player with real scrubber timeline, visualizer bars, volume control, and shuffle/repeat.
  - Metrics cards (Users, Plays, Active Streamers, Playlists, Tracks).
  - 7-Day interactive activity spline chart.
  - Modals for **Upload Song**, **Create Playlist**, **Push Update**, and **New Announcement**.
  - Direct **Download Android APK** button integrated across all views.
- **Zero-CORS Audio Engine**: Headless YouTube audio engine running via IFrame API for 100% reliable uninterrupted streaming.

### 📱 Android Mobile App (`/app`)
- **Jetpack Compose UI**: 3D Glassmorphic dark theme, glowing neon accents, and interactive vinyl record rotation.
- **Audio Streaming Engine**: Real streaming with safe state-machine lifecycle guards (`AudioPlayerManager.kt`).
- **Clean Brand Identity**: Ad-free, high-definition streaming with no third-party branding on the user interface.
- **Special Modes**:
  - **Party Mode**: Haptic bass-reactive pulse and energetic full-screen animations.
  - **DJ Deck**: Interactive dual crossfader and tempo management.
  - **Spatial Audio & Hi-Res Master**: 360° virtual surround toggles.

---

## 📁 Project Directory Structure

```plaintext
├── .github/
│   └── workflows/
│       └── build-apk.yml          # Automated Android APK builder & GitHub release publisher
├── app/                           # Android Mobile Application (Kotlin / Jetpack Compose)
├── web/                           # Next.js 14 Web Player & Master Dashboard
│   ├── app/                       # Next.js App Router (Pages, Download route & Search API)
│   ├── components/                # Modular UI Components (Dashboard, Showcase, Player, Modals)
│   ├── hooks/                     # Custom hooks (useMusicPlayer with YouTube IFrame API)
│   ├── services/                  # Backend Music & YouTube services
│   ├── types/                     # Shared TypeScript interfaces
│   └── package.json               # Web dependencies
├── vercel.json                    # 1-Click Vercel cloud deployment config
├── DEVELOPER_HANDOFF.md           # In-depth architectural & developer guide
├── README.md                      # Project overview & download links
└── build.gradle.kts               # Android project build configuration
```

---

## 🚀 Getting Started

### 1. Free 24x7 Web Hosting on Vercel
1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMahendrajatav2006%2Fmusic-app&root-directory=web)** button.
2. Sign in with your GitHub account.
3. Click **Deploy**.
4. In under 1 minute, your website will be permanently live with a free URL (e.g. `https://your-app.vercel.app`).

### 2. Building the Android App APK
The Android APK is automatically built by GitHub Actions upon push. You can also build it locally:
```bash
cd app
# Windows
..\gradlew.bat assembleDebug
# Mac / Linux
./gradlew assembleDebug
```
The generated APK will be at:
`app/build/outputs/apk/debug/app-debug.apk`

---

## 📄 License
MIT License
