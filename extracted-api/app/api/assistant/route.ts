import { NextRequest } from "next/server";
import { aiService } from "../../../services/ai.service";
import { handleApiError } from "../../../lib/errorHandler";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command } = body;

    if (!command || typeof command !== "string") {
      return Response.json({ success: false, error: "Invalid or missing 'command'." }, { status: 400 });
    }

    const aiResponse = await aiService.processVoiceCommand(command);

    return Response.json({
      success: true,
      ...aiResponse
    });
  } catch (error) {
    return handleApiError(error);
  }
}
