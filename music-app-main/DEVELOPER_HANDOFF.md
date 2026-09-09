# 🎵 MJ PULSE — Complete Developer Handoff Package

Welcome to the **MJ PULSE** codebase! This repository contains the complete ecosystem:
1. **Android Mobile App** (`/app`) — Kotlin, Jetpack Compose, Material 3, Real Streaming Engine, 3D Glassmorphism & Neon Design.
2. **Web Player & API Backend** (`/web`) — Next.js 14 (App Router), Service-Oriented Architecture, YouTube IFrame Headless Engine, Firebase Sync.

---

## 🔗 Live URLs & Shareable Links

- **Live Streaming Emulator (Preview App):**  
  [https://ais-pre-tamtobw6qfsx4sa37gloxz-911705781311.asia-east1.run.app](https://ais-pre-tamtobw6qfsx4sa37gloxz-911705781311.asia-east1.run.app)

- **AI Studio Development Workspace:**  
  [https://ais-dev-tamtobw6qfsx4sa37gloxz-911705781311.asia-east1.run.app](https://ais-dev-tamtobw6qfsx4sa37gloxz-911705781311.asia-east1.run.app)

---

## 🚀 How to Share & Export with Another Developer

You have 3 easy ways to send this entire project to another developer:

### Method 1: Export as ZIP (Recommended for Offline / Local Dev)
1. In Google AI Studio Build (top-right menu), click **Export Project** or **Download ZIP**.
2. Share the ZIP file with the developer.
3. The developer unzips it and has access to both:
   - The Android Studio project (`/app` and root `build.gradle.kts`)
   - The Next.js Web project (`/web`)

### Method 2: Push Directly to GitHub
1. In Google AI Studio Build, click the **GitHub** button in the settings/export menu.
2. Connect your GitHub account and select **Create New Repository** (e.g., `mj-pulse-ecosystem`).
3. Add the other developer as a Collaborator on GitHub so they can `git clone`, edit, and push code directly!

### Method 3: Share AI Studio Workspace Link
- Click the **Share** button in the top right of your AI Studio interface.
- Copy the public or collaborator link and send it. The developer can open and edit in real time in AI Studio.

---

## 📁 Repository Directory Structure

```plaintext
MJ_PULSE/
├── app/                               # ANDROID MOBILE APP
│   └── src/main/
│       ├── AndroidManifest.xml        # Network Security & Permissions
│       └── java/com/example/
│           ├── MainActivity.kt        # Edge-to-Edge Navigation Root
│           ├── audio/
│           │   └── AudioPlayerManager.kt # Multi-State Safe MediaPlayer Engine
│           ├── data/
│           │   ├── model/Song.kt      # Song & Lyric Data Models (Spotify/JioSaavn/Gaana/YT)
│           │   └── repository/        # Multi-Platform Curated Catalog
│           └── ui/
│               ├── screens/           # HomeScreen, PlayerScreen, SearchScreen, DJDeckScreen
│               └── theme/             # Neon Cyan, Pink, Violet Glassmorphism Theme
├── web/                               # NEXT.JS WEB PLAYER & BACKEND
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/route.ts        # Search API Route (Delegates to Service)
│   │   │   └── auth/route.ts          # Auth & Favorites Sync API Route
│   │   ├── page.tsx                   # Main Entry Page
│   │   └── layout.tsx
│   ├── components/
│   │   └── WebPlayer.tsx              # Headless YouTube IFrame Player (Zero CORS/403)
│   ├── services/
│   │   ├── youtube.service.ts         # YouTube Data API v3 & Edge Caching
│   │   └── firebase.service.ts        # Modular Firebase Admin / Firestore
│   ├── lib/
│   │   ├── config.ts                  # Centralized Environment Config
│   │   └── errorHandler.ts            # Centralized API Error Handler
│   ├── package.json                   # Web Dependencies (Next 14, Tailwind, Lucide)
│   └── .env.example                   # Environment Keys Template
├── DEVELOPER_HANDOFF.md               # This Guide
└── settings.gradle.kts                # Android Root Gradle Config
```

---

## 💻 Developer Setup Instructions

### 1. Running the Android App
1. Open the project root in **Android Studio** (Ladybug / Hedgehog or newer).
2. Sync Gradle dependencies.
3. Select an Android device or emulator running **Android 10 (API 29) or higher**.
4. Click **Run (`Shift + F10`)**.
5. The app will launch with Spotify, JioSaavn, Gaana, and YT Music streaming tracks and 3D vinyl animations.

### 2. Running the Next.js Web Player & Backend
1. Open terminal inside the `/web` directory:
   ```bash
   cd web
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Add your `YOUTUBE_API_KEY` in `.env.local` (Get it free from Google Cloud Console).
4. Run development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Key Architecture Highlights for Developers
- **Android MediaPlayer Lifecycle:** `AudioPlayerManager` contains safe state machine guards (`isPrepared`, `isPreparing`, `playWhenReady`) preventing native error `(-38, 0)` in State 4.
- **Web Audio Streaming:** Instead of brittle backend scrapers like `play-dl` which get blocked by YouTube with `403 Forbidden`, the web player uses the official `window.YT` IFrame API running headless (`w-0 h-0`). This avoids CORS and node IP blocks completely.
- **Quota Protection:** Searches use Next.js edge caching (`revalidate: 3600`) to protect daily quota.
