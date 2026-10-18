import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "mj-pulse.web.app";
  const cleanHost = host.includes("0.0.0.0") || host.includes("localhost") || host.includes("127.0.0.1") ? "mj-pulse.web.app" : host;
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const downloadUrl = `${proto}://${cleanHost}/mjpulse.apk?v=${Date.now()}`;

  const res = NextResponse.redirect(downloadUrl, { status: 302 });
  res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  return res;
}
