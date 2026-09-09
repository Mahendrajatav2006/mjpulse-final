import { Track } from "../types/music";
import { youtubeService } from "./youtube.service";
import { saavnService } from "./saavn.service";

export class MusicService {
  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    const trimmed = query?.trim() || "";

    if (!trimmed) {
      return this.getTrendingTracks();
    }

    try {
      // Primary: YouTube Music provides exact playable videoIds for seamless playback
      const ytTracks = await youtubeService.searchTracks(trimmed, limit);
      if (ytTracks && ytTracks.length > 0) {
        return ytTracks;
      }

      // Secondary: Try JioSaavn
      const saavnTracks = await saavnService.searchTracks(trimmed, limit);
      if (saavnTracks && saavnTracks.length > 0) {
        return saavnTracks;
      }
    } catch (err) {
      console.error("[MusicService] Search error:", err);
    }

    return youtubeService.getTrendingTracks();
  }

  async getTrendingTracks(): Promise<Track[]> {
    return youtubeService.getTrendingTracks();
  }
}

export const musicService = new MusicService();
