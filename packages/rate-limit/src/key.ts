import type { RateLimitScope } from "./types.js";
export function rateLimitKey(namespace: string, scope: RateLimitScope, identity: string): string {
  const parts = [namespace, scope, identity];
  if (parts.some((part) => !part || part.trim() !== part)) throw new Error("Rate-limit key parts must be non-empty and trimmed.");
  return parts.map(encodeURIComponent).join(":");
}
