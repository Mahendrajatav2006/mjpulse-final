# 🎵 MJ PULSE — Music Streaming Ecosystem

Comprehensive multi-platform music ecosystem featuring a **Native Android Mobile App** and a **Next.js 14 Web Player & Backend Service**.

---

## 🌟 Key Features

### 📱 Android Mobile App (`/app`)
- **Jetpack Compose UI**: 3D Glassmorphic dark theme, glowing neon accents, and interactive vinyl record rotation.
- **Audio Streaming Engine**: Real streaming with safe state-machine lifecycle guards (`AudioPlayerManager.kt`) preventing native errors.
- **Platform Catalogs**: Curated collections representing **Spotify**, **JioSaavn**, **Gaana**, and **YouTube Music** with synchronized lyrics.
- **Special Modes**:
  - **Party Mode**: Haptic bass-reactive pulse and energetic full-screen animations.
  - **DJ Deck**: Interactive dual crossfader and tempo management.
  - **Spatial Audio & Hi-Res Master**: 360 virtual surround toggles.

### 🌐 Next.js Web Player & Backend (`/web`)
- **Service-Oriented Architecture (SOA)**: Modular services (`youtube.service.ts`, `firebase.service.ts`) separated from API controllers (`/api/search`, `/api/auth`).
- **Headless YouTube Engine**: Uses client-side YouTube IFrame API (`window.YT`) with a visually hidden container (`w-0 h-0`). **Completely eliminates Node.js 403 Forbidden and browser CORS issues.**
- **Edge Caching**: 1-hour cache on search queries to conserve Google YouTube Data API quota.

---

## 📁 Project Directory Structure

```plaintext
├── app/                           # Android Mobile Application (Kotlin / Jetpack Compose)
├── web/                           # Next.js 14 Web Player & API Backend
│   ├── app/                       # Next.js App Router (Pages & API routes)
│   ├── components/                # React Web Player Component
│   ├── services/                  # YouTube & Firebase backend services
│   ├── lib/                       # Centralized configuration & error handling
│   └── package.json               # Web dependencies
├── DEVELOPER_HANDOFF.md           # In-depth architectural & developer guide
├── README.md                      # Project overview
└── build.gradle.kts               # Android project build configuration
```

---

## 🚀 Getting Started

### Running the Android App
1. Open the root folder in **Android Studio**.
2. Sync Gradle dependencies.
3. Run on an Android device or emulator running API 29+.

### Running the Web Player
```bash
cd web
npm install
cp .env.example .env.local
# Add your YOUTUBE_API_KEY in .env.local
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Web Player.

---

## 📄 License
MIT License
