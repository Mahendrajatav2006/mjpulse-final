import { Track } from "../types/music";
import CryptoJS from "crypto-js";

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

  private decryptMediaUrl(encryptedUrl?: string): string {
    if (!encryptedUrl) return "";
    try {
      const key = CryptoJS.enc.Utf8.parse("38346591");
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl),
      });
      const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const url = decrypted.toString(CryptoJS.enc.Utf8);
      if (!url) return "";
      // Return highest quality 320kbps MP4 audio
      return url.replace(/_\d+\.mp4/, "_320.mp4");
    } catch (err) {
      return "";
    }
  }

  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
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
        const streamUrl =
          this.decryptMediaUrl(item.more_info?.encrypted_media_url) ||
          item.more_info?.vlink ||
          "";

        return {
          id: item.id || `saavn-${Math.random().toString(36).substring(2, 8)}`,
          title: this.cleanHtmlEntities(item.title || "Untitled"),
          artist,
          album: this.cleanHtmlEntities(item.more_info?.album || ""),
          thumbnail: image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
          streamUrl,
          duration: durationSec > 0 ? durationSec : undefined,
          durationFormatted: this.formatDuration(item.more_info?.duration),
          source: "MJ PULSE Cloud",
        };
      });
    } catch (error) {
      console.error("[SaavnService] Search error:", error);
      return [];
    }
  }

  async getStreamUrlForQuery(query: string): Promise<string | null> {
    if (!query || !query.trim()) return null;
    try {
      const tracks = await this.searchTracks(query.trim(), 5);
      for (const t of tracks) {
        if (t.streamUrl && t.streamUrl.startsWith("http")) {
          return t.streamUrl;
        }
      }
    } catch (e) {
      console.error("[SaavnService] getStreamUrlForQuery error:", e);
    }
    return null;
  }
}

export const saavnService = new SaavnService();

