import { Track } from "../types/music";
import { youtubeService } from "./youtube.service";
import { saavnService } from "./saavn.service";

export class MusicService {
  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    const trimmed = query?.trim() || "";

    if (!trimmed) {
      return this.getTrendingTracks(limit);
    }

    try {
      // Primary: JioSaavn provides direct 320kbps audio streams for Android App and Web
      const saavnTracks = await saavnService.searchTracks(trimmed, limit);
      if (saavnTracks && saavnTracks.length > 0) {
        return saavnTracks;
      }

      // Secondary: Try YouTube Music
      const ytTracks = await youtubeService.searchTracks(trimmed, limit);
      if (ytTracks && ytTracks.length > 0) {
        return ytTracks;
      }
    } catch (err) {
      console.error("[MusicService] Search error:", err);
    }

    return this.getTrendingTracks(limit);
  }

  async getTrendingTracks(limit: number = 20): Promise<Track[]> {
    try {
      const trending = await saavnService.searchTracks("Top Bollywood Hindi Hits", limit);
      if (trending && trending.length > 0) {
        return trending;
      }
    } catch (err) {
      console.error("[MusicService] Trending error:", err);
    }
    return youtubeService.getTrendingTracks();
  }
}

export const musicService = new MusicService();
