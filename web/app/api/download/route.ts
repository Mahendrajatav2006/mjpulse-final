import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source");

  if (source === "github") {
    return NextResponse.redirect(
      "https://github.com/Mahendrajatav2006/music-app/releases",
      { status: 302 }
    );
  }

  // Direct high-speed download hosted right inside the web platform
  return NextResponse.redirect(new URL("/downloads/MJPulse-Music.apk", request.url), {
    status: 302,
  });
}
