import { NextRequest } from "next/server";
import { saavnService } from "../../../services/saavn.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

function normalizeTitle(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/\s*[\(\[].*?[\)\]]/gi, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarity(a: string, b: string): number {
  const normA = normalizeTitle(a);
  const normB = normalizeTitle(b);
  if (!normA || !normB) return 0;
  if (normA === normB || normA.includes(normB) || normB.includes(normA)) return 1.0;
  
  const wordsA = new Set(normA.split(" ").filter(w => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let common = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) common++;
  });
  return common / Math.min(wordsA.size, wordsB.size);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim() || "";
    const title = searchParams.get("title")?.trim() || "";
    const artist = searchParams.get("artist")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";

    // 1. Direct song details by ID
    if (id && !id.startsWith("saavn_") && !id.startsWith("special-") && !id.startsWith("yt-")) {
      const track = await saavnService.getSongDetails(id);
      if (track && track.streamUrl && track.streamUrl.length > 5) {
        return Response.json({
          success: true,
          data: track,
        });
      }
    }

    // 2. Search by Title / Artist with strict similarity check to prevent audio mismatch
    const searchQuery = (q || `${title} ${artist}`).trim();
    if (searchQuery) {
      // Collect query candidates (full query, individual title segments if split by ||, |, -)
      const queryCandidates = [searchQuery];
      if (title && /[\||\-]/.test(title)) {
        const segments = title.split(/[\|]{1,2}|-+/).map(s => s.trim()).filter(s => s.length > 2);
        queryCandidates.push(...segments);
      }

      for (const queryToTry of queryCandidates) {
        const candidates = await saavnService.searchTracks(queryToTry, 6);
        if (candidates && candidates.length > 0) {
          if (title) {
            let bestMatch: any = null;
            let highestScore = -1;

            for (const cand of candidates) {
              // Compare with full title and each title segment
              let score = calculateSimilarity(title, cand.title);
              if (score < 0.4 && queryCandidates.length > 1) {
                for (const seg of queryCandidates) {
                  const segScore = calculateSimilarity(seg, cand.title);
                  if (segScore > score) score = segScore;
                }
              }
              if (score > highestScore) {
                highestScore = score;
                bestMatch = cand;
              }
            }

            if (bestMatch && highestScore >= 0.6) {
              return Response.json({
                success: true,
                data: bestMatch,
              });
            }
          } else if (candidates[0]?.streamUrl) {
            return Response.json({
              success: true,
              data: candidates[0],
            });
          }
        }
      }
    }

    return Response.json(
      {
        success: false,
        message: "No track stream found",
      },
      { status: 404 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
