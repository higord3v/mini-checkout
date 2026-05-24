import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app.errors";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const message = err.errors[0]?.message ?? "Invalid request";
    res.status(400).json({ success: false, message });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ success: false, message: "Malformed request body" });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
}
