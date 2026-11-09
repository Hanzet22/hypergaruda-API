import type { RateLimitRequest, RateLimitResult, RateLimitStore } from "./types.js";
export class RateLimitEngine {
  constructor(private readonly store: RateLimitStore) {}
  async check(request: RateLimitRequest): Promise<RateLimitResult> { return this.checkMany([request]); }
  async checkMany(requests: readonly RateLimitRequest[]): Promise<RateLimitResult> {
    const decisions = await this.store.consumeMany(requests);
    const allowed = decisions.every((decision) => decision.allowed);
    return { allowed, decisions, retryAfterMs: allowed ? 0 : Math.max(0, ...decisions.map((item) => item.retryAfterMs)) };
  }
}
