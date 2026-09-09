import { NextResponse } from "next/server";

export async function GET() {
  // Redirects directly to the latest official APK on GitHub Releases
  const apkReleaseUrl =
    "https://github.com/Mahendrajatav2006/music-app/releases/latest/download/MJPulse-Music.apk";

  return NextResponse.redirect(apkReleaseUrl, { status: 307 });
}
