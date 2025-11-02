// src/lib/errors/api-error-response.ts
import { NextResponse } from "next/server";
import { AppError } from "./app-error";
import { handleError } from "./handle-error";

export function handleResponseError(error: any) {
  const appError = handleError(error);

  return NextResponse.json(
    {
      success: false,
      message: appError.userMessage,
      error:
        process.env.NODE_ENV === "development"
          ? { details: appError.message, stack: appError.stack }
          : undefined,
    },
    { status: appError.statusCode }
  );
}
