// src/lib/errors/handle-error.ts
import { Prisma } from "@prisma/client";
import { AppError } from "./app-error";

export function handleError(error: any): AppError {
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(", ")
          : error.meta?.target;
        return new AppError(
          `Unique constraint violation on ${target}`,
          `That ${target} is already in use.`,
          409
        );
      }

      case "P2025":
        return new AppError(
          "Record not found.",
          "The resource you are trying to access was not found.",
          404
        );

      case "P2003":
        return new AppError(
          "Foreign key constraint failed.",
          "Cannot delete or update because it is linked to another record.",
          400
        );

      default:
        return new AppError(
          `Database error: ${error.code}`,
          "An unexpected database error occurred.",
          500
        );
    }
  }

  // Zod validation error (from react-hook-form, zod, etc.)
  if (error.name === "ZodError") {
    return new AppError("Validation failed", "Invalid input data.", 400);
  }

  // Syntax or type errors
  if (error instanceof SyntaxError) {
    return new AppError(
      error.message,
      "There was a problem with your request format.",
      400
    );
  }

  // Custom AppError
  if (error instanceof AppError) {
    return error;
  }

  // Default catch-all
  return new AppError(
    error.message || "Internal Server Error",
    "Something went wrong while processing your request.",
    500,
    false
  );
}
