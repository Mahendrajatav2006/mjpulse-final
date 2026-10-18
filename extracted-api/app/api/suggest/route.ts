import { NextRequest } from "next/server";
import { youtubeService } from "../../../services/youtube.service";

export const dynamic = "force-dynamic";

const TRENDING_SUGGESTIONS = [
  "Arijit Singh",
  "Kesariya",
  "Diljit Dosanjh",
  "Tum Hi Ho",
  "Apna Bana Le",
  "Sidhu Moosewala",
  "Starboy",
  "Lo-Fi Hindi Hits",
  "Channa Mereya",
  "Shreya Ghoshal",
  "Heer Ranjha",
  "Badshah New Song",
];

function cleanEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return Response.json({
        success: true,
        query: "",
        suggestions: TRENDING_SUGGESTIONS,
      });
    }

    const suggestionsSet = new Set<string>();
    const matchedSongs: Array<{
      id: string;
      title: string;
      artist: string;
      album: string;
      thumbnail: string;
    }> = [];

    // 1. YouTube instant search autocomplete (Word Matches)
    const ytPromise = (async () => {
      try {
        const ytUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(
          query
        )}`;
        const res = await fetch(ytUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          next: { revalidate: 300 },
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && Array.isArray(json[1])) {
            json[1].slice(0, 10).forEach((item: string) => {
              if (item && item.trim()) {
                suggestionsSet.add(item.trim());
              }
            });
          }
        }
      } catch (_) {}
    })();

    // 2. JioSaavn music autocomplete (Direct Song Matches & Artists)
    const saavnPromise = (async () => {
      try {
        const saavnUrl = `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=${encodeURIComponent(
          query
        )}`;
        const res = await fetch(saavnUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          next: { revalidate: 300 },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.topquery?.data?.[0]?.title) {
            suggestionsSet.add(cleanEntities(data.topquery.data[0].title));
          }
          if (Array.isArray(data?.songs?.data)) {
            data.songs.data.slice(0, 4).forEach((s: any) => {
              const songTitle = cleanEntities(s.title || "");
              if (songTitle) {
                suggestionsSet.add(songTitle);
                matchedSongs.push({
                  id: s.id || `saavn_${Date.now()}_${Math.random()}`,
                  title: songTitle,
                  artist: cleanEntities(s.more_info?.primary_artists || s.music || s.description || "Various Artists"),
                  album: cleanEntities(s.album || s.more_info?.album || "MJ Pulse"),
                  thumbnail: (s.image || "").replace("50x50", "250x250").replace("150x150", "250x250"),
                });
              }
            });
          }
          if (Array.isArray(data?.artists?.data)) {
            data.artists.data.slice(0, 3).forEach((a: any) => {
              if (a.title) suggestionsSet.add(cleanEntities(a.title));
            });
          }
        }
      } catch (_) {}
    })();

    await Promise.allSettled([ytPromise, saavnPromise]);

    // 3. If no direct song was matched by title (e.g. user typed lyrics like "teri mitti me mil jawa")
    if (matchedSongs.length === 0 && query.split(/\s+/).filter(Boolean).length >= 2) {
      try {
        const lyricSongs = await youtubeService.searchTracks(query, 1);
        if (lyricSongs && lyricSongs.length > 0 && lyricSongs[0].title) {
          const s = lyricSongs[0];
          const cleanTitle = (s.title || "")
            .replace(/\s*[\(\[].*?[\)\]]/gi, "")
            .replace(/\b(official video|video song|full song|lyric video|audio|remix|status)\b/gi, "")
            .trim();
          matchedSongs.push({
            id: s.id,
            title: cleanTitle || s.title,
            artist: s.artist || "MJ Pulse",
            album: s.album || "MJ Pulse",
            thumbnail: s.thumbnail,
          });
          suggestionsSet.add(cleanTitle || s.title);
        }
      } catch (_) {}
    }

    const suggestions = Array.from(suggestionsSet).slice(0, 10);

    return Response.json({
      success: true,
      query,
      songs: matchedSongs,
      suggestions:
        suggestions.length > 0
          ? suggestions
          : [query, `${query} song`, `${query} remix`, `${query} status`],
      trending: TRENDING_SUGGESTIONS,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        suggestions: TRENDING_SUGGESTIONS,
      },
      { status: 200 }
    );
  }
}
