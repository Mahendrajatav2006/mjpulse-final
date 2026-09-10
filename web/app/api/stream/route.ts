import { NextRequest } from "next/server";
import { saavnService } from "../../../services/saavn.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "";
    const artist = searchParams.get("artist") || "";
    const query = searchParams.get("q") || `${title} ${artist}`.trim();

    if (!query) {
      return Response.json({
        success: false,
        error: "Query or title required",
      }, { status: 400 });
    }

    const streamUrl = await saavnService.getStreamUrlForQuery(query);

    if (streamUrl) {
      return Response.json({
        success: true,
        query,
        streamUrl,
      });
    }

    // High quality reliable CDN fallback stream if query fails
    return Response.json({
      success: true,
      query,
      streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      fallback: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
