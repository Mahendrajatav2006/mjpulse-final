import { NextRequest } from "next/server";
import { musicService } from "../../../services/music.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, error: "Missing album id" }, { status: 400 });
    }

    const details = await musicService.getAlbumDetails(id);

    if (!details) {
      return Response.json({ success: false, error: "Album not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: details,
      ...details,
    });
  } catch (error) {
    console.error("Album API Error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
