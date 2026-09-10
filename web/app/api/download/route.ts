import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Redirect directly to the official latest GitHub Release APK
  // Verified 302 -> 200 OK, always serves the newest release APK directly from GitHub CDN
  const directApkUrl = "https://github.com/Mahendrajatav2006/music-app/releases/latest/download/MJPulse-Music.apk";
  return NextResponse.redirect(directApkUrl, { status: 302 });
}
