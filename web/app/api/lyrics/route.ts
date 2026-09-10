import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface LyricLine {
  timeSec: number;
  text: string;
}

function cleanTitle(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\s*[\(\[](?:from|feat\.?|remix|lofi|original|soundtrack|video|audio|lyrics|hd|4k|official).*?[\)\]]/gi, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function cleanArtist(raw: string): string {
  if (!raw) return "";
  return raw.split(",")[0].split("&")[0].trim();
}

function parseLrc(lrcText: string): LyricLine[] {
  const lines = lrcText.split("\n");
  const result: LyricLine[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const text = match[4].trim();
      if (text) {
        result.push({
          timeSec: minutes * 60 + seconds,
          text,
        });
      }
    }
  }

  return result.sort((a, b) => a.timeSec - b.timeSec);
}

function parsePlainLyrics(plain: string, durationSec: number): LyricLine[] {
  const lines = plain
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const effectiveDuration = durationSec > 0 ? durationSec : 210;
  const interval = Math.max(3, Math.floor(effectiveDuration / (lines.length + 1)));

  return lines.map((text, idx) => ({
    timeSec: Math.min(effectiveDuration - 2, (idx + 1) * interval),
    text,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTitle = searchParams.get("title") || "";
    const rawArtist = searchParams.get("artist") || "";
    const duration = parseInt(searchParams.get("duration") || "0", 10);

    const title = cleanTitle(rawTitle);
    const artist = cleanArtist(rawArtist);

    if (!title) {
      return Response.json({
        success: false,
        message: "Title is required",
        lyrics: [],
      });
    }

    // 1. Try LRCLIB exact match
    let lrclibData: any = null;
    try {
      const exactUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(
        title
      )}&artist_name=${encodeURIComponent(artist)}${
        duration > 0 ? `&duration=${duration}` : ""
      }`;
      const res = await fetch(exactUrl, {
        headers: { "User-Agent": "MJPulseMusic/1.0 (https://web-sigma-puce-cwpj9hlpv7.vercel.app)" },
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        lrclibData = await res.json();
      }
    } catch (_) {}

    // 2. Try LRCLIB search query fallback
    if (!lrclibData || (!lrclibData.syncedLyrics && !lrclibData.plainLyrics)) {
      try {
        const searchQuery = `${title} ${artist}`.trim();
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(searchUrl, {
          headers: { "User-Agent": "MJPulseMusic/1.0 (https://web-sigma-puce-cwpj9hlpv7.vercel.app)" },
          next: { revalidate: 86400 },
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            // Pick first item that has synced lyrics, or just the first item
            lrclibData = list.find((item: any) => item.syncedLyrics) || list[0];
          }
        }
      } catch (_) {}
    }

    if (lrclibData) {
      if (lrclibData.syncedLyrics) {
        const parsed = parseLrc(lrclibData.syncedLyrics);
        if (parsed.length > 0) {
          return Response.json({
            success: true,
            synced: true,
            title,
            artist,
            lyrics: parsed,
          });
        }
      }

      if (lrclibData.plainLyrics) {
        const parsed = parsePlainLyrics(lrclibData.plainLyrics, duration);
        if (parsed.length > 0) {
          return Response.json({
            success: true,
            synced: false,
            title,
            artist,
            lyrics: parsed,
          });
        }
      }
    }

    return Response.json({
      success: true,
      synced: false,
      lyrics: [
        { timeSec: 0, text: `♪ ${rawTitle} ♪` },
        { timeSec: 5, text: `Vocals by ${rawArtist || "Artist"}` },
        { timeSec: 12, text: "High Fidelity Master Audio Streaming..." },
        { timeSec: 25, text: "Feel the Rhythm & Pulse with MJ PULSE" },
        { timeSec: 40, text: `♪ Now Playing: ${rawTitle} ♪` }
      ],
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        lyrics: [],
      },
      { status: 200 }
    );
  }
}
