import { NextRequest } from "next/server";
import { musicService } from "../../../services/music.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, error: "Missing playlist id" }, { status: 400 });
    }

    const details = await musicService.getPlaylistDetails(id);

    if (!details) {
      return Response.json({ success: false, error: "Playlist not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: details,
      ...details,
    });
  } catch (error) {
    console.error("Playlist API Error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
