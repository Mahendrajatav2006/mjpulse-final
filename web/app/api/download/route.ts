import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Redirect to the local APK file in the public/downloads folder
  // Make sure you place the built APK at web/public/downloads/MJPulse-Music.apk
  const localApkUrl = "/downloads/MJPulse-Music.apk";
  return NextResponse.redirect(new URL(localApkUrl, request.url), { status: 302 });
}
