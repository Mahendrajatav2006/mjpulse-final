import { NextRequest } from "next/server";
import { firebaseService } from "../../../services/firebase.service";
import { handleApiError } from "../../../lib/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, favorite } = body;

    if (action === "save_favorite" && favorite) {
      const result = await firebaseService.saveFavorite(favorite);
      return Response.json({ success: true, result });
    }

    return Response.json({ success: true, message: "Auth route active" });
  } catch (error) {
    return handleApiError(error);
  }
}
