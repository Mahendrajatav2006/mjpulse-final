import { NextRequest } from "next/server";
import { musicService } from "../../../services/music.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const songs = await musicService.searchTracks(query, limit);

    return Response.json({
      success: true,
      query,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
