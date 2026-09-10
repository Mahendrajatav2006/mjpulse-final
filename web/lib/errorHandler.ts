export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown) {
  console.error("[MJ PULSE Backend Error]:", error);

  if (error instanceof AppError) {
    return Response.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : "Internal Server Error";
  return Response.json(
    { success: false, error: message },
    { status: 500 }
  );
}
