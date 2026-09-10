import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Redirect directly to the official GitHub Release APK
  // Ensures fastest download speeds and latest build
  const directApkUrl = "https://github.com/Mahendrajatav2006/music-app/releases/download/v1.2.0/MJPulse-Music.apk";
  return NextResponse.redirect(directApkUrl, { status: 302 });
}
