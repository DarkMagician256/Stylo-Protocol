// ============================================================================
// Error Handler Middleware
// ============================================================================

import type { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  console.error(`[ERROR] ${code}:`, err.message, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: process.env.NODE_ENV === "production"
        ? "An internal error occurred"
        : err.message,
      details: process.env.NODE_ENV === "production" ? undefined : err.details,
    },
    timestamp: Date.now(),
  });
}
