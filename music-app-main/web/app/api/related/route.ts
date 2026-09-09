import { NextRequest } from "next/server";
import { saavnService } from "../../../services/saavn.service";
import { handleApiError } from "../../../lib/errorHandler";
import { Track } from "../../../types/music";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist") || "";
    const genre = searchParams.get("genre") || "";
    const title = searchParams.get("title") || "";
    const currentId = searchParams.get("currentId") || "";
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    // Extract lead artist: e.g. "Arijit Singh & Mithoon" -> "Arijit Singh"
    const leadArtist = artist
      .split(/&|,|feat\.|ft\.|with|\bx\b|\bX\b|\//i)[0]
      ?.trim() || "";

    // Extract primary genre/mood keywords
    const cleanGenre = genre
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .split(" ")
      .filter((w) => w.length > 2 && !["pulse", "cloud", "master"].includes(w.toLowerCase()))
      .slice(0, 2)
      .join(" ");

    const relatedMap = new Map<string, Track>();

    // 1. Primary search: Lead Artist + Genre/Mood
    const primaryQuery = leadArtist && cleanGenre ? `${leadArtist} ${cleanGenre}` : leadArtist ? `${leadArtist} hits` : `${cleanGenre} hits`;
    if (primaryQuery.trim()) {
      const primaryResults = await saavnService.searchTracks(primaryQuery, limit);
      for (const t of primaryResults) {
        if (t.id !== currentId && t.title.toLowerCase() !== title.toLowerCase()) {
          relatedMap.set(t.id, t);
        }
      }
    }

    // 2. Secondary search if not enough tracks: Lead artist alone
    if (relatedMap.size < 6 && leadArtist) {
      const artistResults = await saavnService.searchTracks(`${leadArtist} songs`, limit);
      for (const t of artistResults) {
        if (t.id !== currentId && t.title.toLowerCase() !== title.toLowerCase()) {
          relatedMap.set(t.id, t);
        }
      }
    }

    // 3. Fallback: Style / Genre trending if still low
    if (relatedMap.size < 5 && cleanGenre) {
      const genreResults = await saavnService.searchTracks(`${cleanGenre} trending songs`, limit);
      for (const t of genreResults) {
        if (t.id !== currentId && t.title.toLowerCase() !== title.toLowerCase()) {
          relatedMap.set(t.id, t);
        }
      }
    }

    const tracks = Array.from(relatedMap.values()).slice(0, limit);

    return Response.json({
      success: true,
      query: { artist: leadArtist, genre: cleanGenre, title },
      count: tracks.length,
      data: tracks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
