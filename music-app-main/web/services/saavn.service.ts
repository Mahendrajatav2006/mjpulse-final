import { Track } from "../types/music";

export class SaavnService {
  private cleanHtmlEntities(str: string): string {
    if (!str) return "";
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  private formatDuration(secondsStr?: string): string {
    const sec = parseInt(secondsStr || "0", 10);
    if (!sec || isNaN(sec)) return "3:30";
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  }

  async searchTracks(query: string, limit: number = 10): Promise<Track[]> {
    if (!query || !query.trim()) return [];

    try {
      const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&q=${encodeURIComponent(
        query.trim()
      )}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) return [];

      const data = await res.json();
      const results = data.results || [];

      return results.slice(0, limit).map((item: any) => {
        const image = (item.image || "")
          .replace("150x150", "500x500")
          .replace("50x50", "500x500");

        const primaryArtists = item.more_info?.artistMap?.primary_artists
          ?.map((a: any) => a.name)
          .join(", ");

        const artist =
          primaryArtists ||
          this.cleanHtmlEntities(item.more_info?.music || item.subtitle || "Unknown Artist");

        const durationSec = parseInt(item.more_info?.duration || "0", 10);

        return {
          id: item.id,
          title: this.cleanHtmlEntities(item.title || "Untitled"),
          artist,
          album: this.cleanHtmlEntities(item.more_info?.album || ""),
          thumbnail: image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
          duration: durationSec > 0 ? durationSec : undefined,
          durationFormatted: this.formatDuration(item.more_info?.duration),
          source: "JioSaavn",
        };
      });
    } catch (error) {
      console.error("[SaavnService] Search error:", error);
      return [];
    }
  }
}

export const saavnService = new SaavnService();
