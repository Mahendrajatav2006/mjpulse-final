import { NextRequest } from "next/server";
import { musicService } from "../../../services/music.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "song";
    const limit = parseInt(searchParams.get("limit") || "60", 10);
    const page = parseInt(searchParams.get("page") || searchParams.get("p") || "1", 10);

    let resultData: any = {};
    let count = 0;

    if (type === "all") {
      const allResults = await musicService.searchAll(query);
      resultData = {
        data: allResults?.songs || [],
        artists: allResults?.artists || [],
        albums: allResults?.albums || [],
        playlists: allResults?.playlists || [],
      };
      count = (allResults?.songs?.length || 0) + (allResults?.artists?.length || 0);
    } else if (type === "artist") {
      const artists = await musicService.searchArtists(query, limit);
      resultData = { artists };
      count = artists.length;
    } else if (type === "album") {
      const albums = await musicService.searchAlbums(query, limit);
      resultData = { albums };
      count = albums.length;
    } else if (type === "playlist") {
      const playlists = await musicService.searchPlaylists(query, limit);
      resultData = { playlists };
      count = playlists.length;
    } else {
      // Default to song (Expanded massive scale results)
      const fetchLimit = Math.max(limit, 50);
      const songs = await musicService.searchTracks(query, fetchLimit, page);
      resultData = { data: songs };
      count = songs.length;
    }

    return Response.json({
      success: true,
      query,
      count,
      ...resultData
    });
  } catch (error) {
    return handleApiError(error);
  }
}
