import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface AppUpdatePayload {
  versionCode: number;
  versionName: string;
  minRequiredVersionCode: number;
  title: string;
  releaseDate: string;
  downloadUrl: string;
  isMandatory: boolean;
  changelog: string[];
}

export async function GET() {
  const updateInfo: AppUpdatePayload = {
    versionCode: 6,
    versionName: "1.2.1",
    minRequiredVersionCode: 1,
    title: "New Update Available! 🚀",
    releaseDate: "October 2026",
    downloadUrl: "https://mj-pulse.web.app/mjpulse.apk",
    isMandatory: false,
    changelog: [
      "🔥 Massive-scale song search: 60+ songs per query",
      "🎤 Search songs by lyrics & lines (find any song without title)",
      "⚡ Room (Listen Together) renamed with zero-delay sync",
      "📷 In-app Camera QR Code Scanner for instant Room join",
      "🎧 Lossless 320kbps studio-grade audio streaming",
      "🛡️ Google Play Services OAuth 2.0 Security Certified",
    ],
  };

  return NextResponse.json(
    {
      success: true,
      ...updateInfo,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}
