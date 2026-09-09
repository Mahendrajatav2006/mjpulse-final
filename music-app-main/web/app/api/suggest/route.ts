import { NextRequest } from "next/server";

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

    // 1. YouTube instant search autocomplete
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

    // 2. JioSaavn music autocomplete
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
            data.songs.data.slice(0, 6).forEach((s: any) => {
              if (s.title) suggestionsSet.add(cleanEntities(s.title));
            });
          }
          if (Array.isArray(data?.artists?.data)) {
            data.artists.data.slice(0, 4).forEach((a: any) => {
              if (a.title) suggestionsSet.add(cleanEntities(a.title));
            });
          }
        }
      } catch (_) {}
    })();

    await Promise.allSettled([ytPromise, saavnPromise]);

    const suggestions = Array.from(suggestionsSet).slice(0, 15);

    return Response.json({
      success: true,
      query,
      suggestions:
        suggestions.length > 0
          ? suggestions
          : [query, `${query} song`, `${query} remix`, `${query} status`],
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
