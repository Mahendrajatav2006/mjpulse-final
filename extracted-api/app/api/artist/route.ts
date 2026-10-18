import { NextRequest } from "next/server";
import { musicService } from "../../../services/music.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, error: "Missing artist id" }, { status: 400 });
    }

    const artistDetails = await musicService.getArtistDetails(id);

    if (!artistDetails) {
      return Response.json({ success: false, error: "Artist not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: artistDetails,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
