import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  console.error("[API Error]:", error);
  const message = error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
