import { NextResponse } from "next/server";

export async function GET() {
  // Direct download URL for the compiled Android APK
  const apkDownloadUrl =
    "https://github.com/Mahendrajatav2006/music-app/releases/download/v1.0.0/app-debug.apk";

  return NextResponse.redirect(apkDownloadUrl, { status: 307 });
}
