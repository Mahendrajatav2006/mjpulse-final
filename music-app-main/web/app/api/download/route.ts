import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Redirect directly to the live GitHub Release APK
  // Ensures fastest download speeds, zero bandwidth cost on Vercel, and verified 200 OK
  const directApkUrl = "https://github.com/Mahendrajatav2006/music-app/releases/download/v1.0.0/app-debug.apk";
  return NextResponse.redirect(directApkUrl, { status: 302 });
}
