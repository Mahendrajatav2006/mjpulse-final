import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Direct download URL for local static APK on the same origin
  const url = new URL("/downloads/MJPulse-Music.apk", request.url);
  return NextResponse.redirect(url, { status: 307 });
}

