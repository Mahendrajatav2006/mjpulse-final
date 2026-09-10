import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Redirect directly to the official GitHub Release v1.2.0 APK
  // Verified 200 OK, full speed direct CDN download
  const directApkUrl = "https://github.com/Mahendrajatav2006/music-app/releases/download/v1.2.0/MJPulse-Music.apk";
  return NextResponse.redirect(directApkUrl, { status: 302 });
}
