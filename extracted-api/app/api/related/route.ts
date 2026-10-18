import { NextRequest } from "next/server";
import { saavnService } from "../../../services/saavn.service";
import { handleApiError } from "../../../lib/errorHandler";
import { Track } from "../../../types/music";

export const dynamic = "force-dynamic";

/**
 * Extracts normalized core song title for strict variant deduplication.
 * Example: "Kesariya (Lofi Flip)" -> "kesariya"
 *          "Kesariya (From Brahmastra)" -> "kesariya"
 *          "Apna Bana Le" -> "apna bana le"
 */
function extractBaseTitle(rawTitle: string): string {
  if (!rawTitle) return "";
  let t = rawTitle.toLowerCase();
  // Strip anything inside parentheses and brackets: (Lofi), (Remix), (From "..."), [Official], etc.
  t = t.replace(/\s*[\(\[][^\)\]]*[\)\]]/gi, " ");
  // Strip common descriptor suffixes
  t = t.replace(/\b(remix|lofi|lo-fi|flip|reverb|slowed|acoustic|reprise|unplugged|mashup|mix|dance mix|club mix|original|soundtrack|ost|version|male|female|duet|teaser|audio|video|full song|cover|recreated|dj)\b/gi, " ");
  // Strip punctuation
  t = t.replace(/[^a-z0-9\s]/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

/**
 * Detects whether artist or track belongs to vintage golden era
 */
function isVintageRetro(text: string): boolean {
  return /(kishore|rafi|lata mangeshkar|mukesh|asha bhosle|manna dey|r\.?d\.? burman|s\.?d\.? burman|laxmikant|pyarelal|hemnat|talat|geeta dutt|70s|80s|purane gane|old is gold)/i.test(text);
}

function is90sEra(text: string): boolean {
  return /(kumar sanu|udit narayan|alka yagnik|anuradha paudwal|sonu nigam|abhijeet|sadhana sargam|nadeem|shravan|jatin|lalit|90s|retro hits)/i.test(text);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist") || "";
    const genre = searchParams.get("genre") || "";
    const title = searchParams.get("title") || "";
    const currentId = searchParams.get("currentId") || "";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "25", 10), 10), 50);

    const seedBase = extractBaseTitle(title);
    const isRetro = isVintageRetro(artist + " " + title);
    const is90s = is90sEra(artist + " " + title);

    // Extract lead artist: e.g. "Pritam, Arijit Singh" -> "Arijit Singh"
    const artistsList = artist.split(/&|,|feat\.|ft\.|with|\bx\b|\bX\b|\//i).map((a) => a.trim()).filter(Boolean);
    const leadArtist = artistsList.find((a) => !["pritam", "t-series", "sony music", "sachin-jigar"].includes(a.toLowerCase())) || artistsList[0] || "";

    const candidatePool: Track[] = [];

    // 1. Direct JioSaavn Recommendation Graph (Native recommendation engine)
    try {
      const recoResults = await saavnService.getSongRecommendations(
        currentId,
        Math.max(limit + 10, 35),
        title,
        leadArtist || artist
      );
      if (Array.isArray(recoResults) && recoResults.length > 0) {
        candidatePool.push(...recoResults);
      }
    } catch (err) {
      console.warn("Saavn getSongRecommendations notice:", err);
    }

    // 2. Era & Genre Targeted Query if pool is small
    if (candidatePool.length < Math.max(limit, 25)) {
      let smartQueries: string[] = [];
      if (isRetro) {
        smartQueries = [
          leadArtist ? `${leadArtist} golden hits` : "Kishore Kumar Lata Mangeshkar evergreen hits",
          "70s 80s Bollywood evergreen romantic classics",
          "RD Burman Mohammed Rafi classic hits"
        ];
      } else if (is90s) {
        smartQueries = [
          leadArtist ? `${leadArtist} 90s hits` : "90s Bollywood romantic melodies",
          "Kumar Sanu Alka Yagnik Udit Narayan 90s love songs",
          "Best of 90s Bollywood evergreen songs"
        ];
      } else if (/(diljit|aujla|shubh|moosewala|sidhu|ap dhillon)/i.test(artist + " " + title)) {
        smartQueries = [
          "Latest Punjabi Top Hits",
          "Diljit Dosanjh Karan Aujla AP Dhillon songs",
          "Punjabi Pop & Romance trending"
        ];
      } else if (/(gurjar|haryanvi|rajasthani|renuka|masoom)/i.test(artist + " " + title)) {
        smartQueries = [
          leadArtist ? `${leadArtist} songs` : "Top Haryanvi Hits",
          "New Haryanvi Rajasthani DJ songs",
          "Ranjeet Gurjar Masoom Sharma hits"
        ];
      } else {
        // Modern Bollywood Romance & Pop
        smartQueries = [
          leadArtist ? `${leadArtist} romantic songs` : "Bollywood top romantic hits",
          "Trending Hindi love songs Arijit Singh",
          genre ? `${genre} top songs` : "Bollywood acoustic melodies"
        ];
      }

      for (const q of smartQueries) {
        if (candidatePool.length >= 35) break;
        try {
          const res = await saavnService.searchTracks(q, 20);
          if (Array.isArray(res) && res.length > 0) {
            candidatePool.push(...res);
          }
        } catch (_) {}
      }
    }

    // 3. Strict Deduplication & "Same Feeling, NOT Same Song" Filter
    const seenBaseTitles = new Set<string>();
    const finalTracks: Track[] = [];

    // Add seed song base title so NO variant of the currently playing song is ever returned!
    if (seedBase) {
      seenBaseTitles.add(seedBase);
    }

    for (const track of candidatePool) {
      if (!track || !track.id || !track.title) continue;
      if (track.id === currentId) continue;

      const trackBase = extractBaseTitle(track.title);
      if (!trackBase || trackBase.length < 2) continue;

      // Reject if it's the exact same song or a tune/remix/lofi/reverb variant of seed
      if (trackBase === seedBase) continue;

      // Reject if title contains seed title or vice versa (e.g. "Kesariya Dance Mix" vs "Kesariya")
      if (seedBase.length >= 4 && (trackBase.includes(seedBase) || seedBase.includes(trackBase))) {
        continue;
      }

      // Reject if we already picked another version of this candidate song in this batch
      if (seenBaseTitles.has(trackBase)) continue;

      // For retro tracks, filter out modern EDM or 2024 rap
      if (isRetro && !isVintageRetro(track.artist + " " + track.title + " " + (track.album || ""))) {
        // Skip modern fast EDM if user is listening to 70s Kishore/Rafi
        if (/(badshah|honey singh|mc stan|krsna|shubh|aujla)/i.test(track.artist)) continue;
      }

      seenBaseTitles.add(trackBase);
      finalTracks.push(track);

      if (finalTracks.length >= limit) break;
    }

    return Response.json({
      success: true,
      query: { artist: leadArtist, title, genre },
      count: finalTracks.length,
      data: finalTracks,
      tracks: finalTracks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
