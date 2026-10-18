import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Check both relative to workspace web/public and process.cwd()
  const possiblePaths = [
    path.join(process.cwd(), "public", "downloads", "MJPulse-Music.apk"),
    path.join(process.cwd(), "web", "public", "downloads", "MJPulse-Music.apk"),
    path.resolve("./public/downloads/MJPulse-Music.apk"),
    "/app/applet/web/public/downloads/MJPulse-Music.apk",
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": 'attachment; filename="MJPulse-Music.apk"',
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400, must-revalidate",
        },
      });
    }
  }

  // Fallback to direct public CDN release
  return NextResponse.redirect(
    "https://github.com/Mahendrajatav2006/music-app/releases/download/v1.2.0/MJPulse-Music.apk",
    { status: 302 }
  );
}


