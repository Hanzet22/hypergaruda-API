import type { RateLimitResult } from "./types.js";
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const limit = Math.min(...result.decisions.map((item) => item.limit));
  const remaining = Math.min(...result.decisions.map((item) => item.remaining));
  const reset = Math.max(0, ...result.decisions.map((item) => Math.ceil((item.resetAtMs - Date.now()) / 1000)));
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(Number.isFinite(limit) ? limit : 0),
    "RateLimit-Remaining": String(Number.isFinite(remaining) ? remaining : 0),
    "RateLimit-Reset": String(reset),
  };
  if (!result.allowed) headers["Retry-After"] = String(Math.max(1, Math.ceil(result.retryAfterMs / 1000)));
  return headers;
}
