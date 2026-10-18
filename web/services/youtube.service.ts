import YTMusic from "ytmusic-api";
import { Track } from "../types/music";

export class YouTubeService {
  private ytmusic: YTMusic;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.ytmusic = new YTMusic();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          await this.ytmusic.initialize();
          this.initialized = true;
        } catch (error) {
          console.error("Failed to initialize YTMusic API:", error);
          this.initPromise = null;
          throw error;
        }
      })();
    }

    return this.initPromise;
  }

  private formatDuration(seconds?: number): string {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "3:30";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  private extractArtistName(item: any): string {
    if (item.artist && typeof item.artist === "object" && item.artist.name) {
      return item.artist.name;
    }
    if (typeof item.artist === "string" && item.artist.trim()) {
      return item.artist.trim();
    }
    if (Array.isArray(item.artists) && item.artists.length > 0) {
      return item.artists
        .map((a: any) => (typeof a === "string" ? a : a?.name))
        .filter(Boolean)
        .join(", ");
    }
    return "Unknown Artist";
  }

  private extractThumbnail(item: any): string {
    if (Array.isArray(item.thumbnails) && item.thumbnails.length > 0) {
      const best = item.thumbnails[item.thumbnails.length - 1]?.url || "";
      if (best) {
        // Boost resolution for crisp rendering
        return best.replace(/=w\d+-h\d+/, "=w500-h500");
      }
    }
    if (item.videoId) {
      return `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80";
  }

  async searchTracks(query: string, maxResults: number = 20): Promise<Track[]> {
    const trimmedQuery = query?.trim() || "";
    if (!trimmedQuery) {
      return this.getTrendingTracks();
    }

    try {
      await this.ensureInitialized();
      const results = await this.ytmusic.searchSongs(trimmedQuery);

      if (!Array.isArray(results) || results.length === 0) {
        return this.getTrendingTracks();
      }

      const items = results.slice(0, maxResults);

      return items.map((item: any) => {
        const durationSec = typeof item.duration === "number" ? item.duration : undefined;
        return {
          id: item.videoId,
          title: item.name || "Untitled Track",
          artist: this.extractArtistName(item),
          album: item.album?.name || undefined,
          thumbnail: this.extractThumbnail(item),
          duration: durationSec,
          durationFormatted: this.formatDuration(durationSec),
          source: "YouTube Music",
        };
      });
    } catch (error) {
      console.error("[YouTubeService] Search error:", error);
      return this.getCuratedFallback(trimmedQuery);
    }
  }

  async getTrendingTracks(): Promise<Track[]> {
    try {
      await this.ensureInitialized();
      const results = await this.ytmusic.searchSongs("Top Hits Trending 2024");
      if (Array.isArray(results) && results.length > 0) {
        return results.slice(0, 20).map((item: any) => {
          const durationSec = typeof item.duration === "number" ? item.duration : undefined;
          return {
            id: item.videoId,
            title: item.name || "Untitled Track",
            artist: this.extractArtistName(item),
            album: item.album?.name || undefined,
            thumbnail: this.extractThumbnail(item),
            duration: durationSec,
            durationFormatted: this.formatDuration(durationSec),
            source: "YouTube Music",
          };
        });
      }
    } catch (e) {
      console.error("[YouTubeService] Trending fetch error:", e);
    }

    return this.getCuratedFallback("");
  }

  private getCuratedFallback(query: string): Track[] {
    const curated: Track[] = [
      {
        id: "NJAv_7lHUIU",
        title: "Kesariya",
        artist: "Arijit Singh, Pritam",
        album: "Brahmastra",
        thumbnail: "https://i.ytimg.com/vi/NJAv_7lHUIU/hqdefault.jpg",
        duration: 269,
        durationFormatted: "4:29",
        source: "YouTube Music",
      },
      {
        id: "YALvuUpY_b0",
        title: "Apna Bana Le",
        artist: "Arijit Singh, Sachin-Jigar",
        album: "Bhediya",
        thumbnail: "https://i.ytimg.com/vi/YALvuUpY_b0/hqdefault.jpg",
        duration: 261,
        durationFormatted: "4:21",
        source: "YouTube Music",
      },
      {
        id: "Lq0S1lqEjxo",
        title: "Born to Shine",
        artist: "Diljit Dosanjh",
        album: "G.O.A.T.",
        thumbnail: "https://i.ytimg.com/vi/Lq0S1lqEjxo/hqdefault.jpg",
        duration: 213,
        durationFormatted: "3:33",
        source: "YouTube Music",
      },
      {
        id: "xTvyyoF_LZY",
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        thumbnail: "https://i.ytimg.com/vi/xTvyyoF_LZY/hqdefault.jpg",
        duration: 233,
        durationFormatted: "3:53",
        source: "YouTube Music",
      },
      {
        id: "3y-O-4IL-PU",
        title: "Starboy",
        artist: "The Weeknd ft. Daft Punk",
        album: "Starboy",
        thumbnail: "https://i.ytimg.com/vi/3y-O-4IL-PU/hqdefault.jpg",
        duration: 230,
        durationFormatted: "3:50",
        source: "YouTube Music",
      },
      {
        id: "hLPeS4U21Z8",
        title: "Despacito",
        artist: "Luis Fonsi ft. Daddy Yankee",
        album: "VIDA",
        thumbnail: "https://i.ytimg.com/vi/hLPeS4U21Z8/hqdefault.jpg",
        duration: 228,
        durationFormatted: "3:48",
        source: "YouTube Music",
      },
      {
        id: "sKK6MOdXrG0",
        title: "So High",
        artist: "Sidhu Moose Wala",
        album: "PBX 1",
        thumbnail: "https://i.ytimg.com/vi/sKK6MOdXrG0/hqdefault.jpg",
        duration: 237,
        durationFormatted: "3:57",
        source: "YouTube Music",
      },
      {
        id: "JFcgOboQZ08",
        title: "Danza Kuduro",
        artist: "Don Omar ft. Lucenzo",
        album: "Meet the Orphans",
        thumbnail: "https://i.ytimg.com/vi/JFcgOboQZ08/hqdefault.jpg",
        duration: 198,
        durationFormatted: "3:18",
        source: "YouTube Music",
      },
    ];

    if (!query) return curated;

    const filtered = curated.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.length > 0 ? filtered : curated;
  }
}

export const youtubeService = new YouTubeService();
