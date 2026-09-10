import { NextRequest, NextResponse } from "next/server";
import { saavnService } from "../../../services/saavn.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "Trending Hits";
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const tracks = await saavnService.searchTracks(query, limit);

    return NextResponse.json({
      success: true,
      query,
      count: tracks.length,
      data: tracks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
