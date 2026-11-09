import type { RateLimitDecision, RateLimitRequest, RateLimitStore } from "./types.js";
interface Bucket { tokens: number; updatedAtMs: number; expiresAtMs: number; }
export interface MemoryRateLimitStoreOptions { maxEntries?: number; now?: () => number; }

/** Bounded single-process store for development; not a distributed production quota store. */
export class MemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, Bucket>();
  private readonly maxEntries: number;
  private readonly now: () => number;
  constructor(options: MemoryRateLimitStoreOptions = {}) {
    this.maxEntries = options.maxEntries ?? 10_000;
    this.now = options.now ?? Date.now;
    if (!Number.isSafeInteger(this.maxEntries) || this.maxEntries < 1) throw new Error("maxEntries must be a positive safe integer.");
  }
  async consumeMany(requests: readonly RateLimitRequest[]): Promise<RateLimitDecision[]> {
    if (!requests.length) return [];
    const now = this.now();
    const prepared = requests.map((request) => {
      validateRequest(request);
      const refillPerMs = request.policy.refillPerSecond / 1000;
      const bucket = this.buckets.get(request.key);
      const elapsed = bucket ? Math.max(0, now - bucket.updatedAtMs) : 0;
      const tokens = bucket ? Math.min(request.policy.capacity, bucket.tokens + elapsed * refillPerMs) : request.policy.capacity;
      return { request, cost: request.policy.cost ?? 1, refillPerMs, tokens };
    });
    if (new Set(requests.map((item) => item.key)).size !== requests.length) throw new Error("Duplicate keys are not allowed in one consumeMany operation.");
    const denied = prepared.some((item) => item.tokens < item.cost);
    const decisions = prepared.map(({ request, cost, refillPerMs, tokens }) => {
      const remaining = Math.max(0, tokens - (denied ? 0 : cost));
      return {
        allowed: !denied, limit: request.policy.capacity, remaining: Math.floor(remaining),
        resetAtMs: now + Math.ceil((request.policy.capacity - remaining) / refillPerMs),
        retryAfterMs: tokens >= cost ? 0 : Math.ceil((cost - tokens) / refillPerMs),
        policyId: request.policy.id, scope: request.policy.scope,
      } satisfies RateLimitDecision;
    });
    if (!denied) for (const { request, cost, refillPerMs, tokens } of prepared) {
      const ttlMs = Math.ceil((request.policy.capacity / refillPerMs) * 1000) + 60_000;
      this.buckets.delete(request.key);
      this.buckets.set(request.key, { tokens: Math.max(0, tokens - cost), updatedAtMs: now, expiresAtMs: now + ttlMs });
    }
    this.prune(now);
    return decisions;
  }
  private prune(now: number): void {
    for (const [key, bucket] of this.buckets) if (bucket.expiresAtMs <= now) this.buckets.delete(key);
    while (this.buckets.size > this.maxEntries) {
      const oldest = this.buckets.keys().next().value;
      if (oldest === undefined) break;
      this.buckets.delete(oldest);
    }
  }
}
function validateRequest(request: RateLimitRequest): void {
  const { key, policy } = request; const cost = policy.cost ?? 1;
  if (!key || !policy.id || !policy.scope) throw new Error("Rate-limit key and policy fields are required.");
  if (!Number.isFinite(policy.capacity) || policy.capacity < 1) throw new Error("capacity must be at least 1.");
  if (!Number.isFinite(policy.refillPerSecond) || policy.refillPerSecond <= 0) throw new Error("refillPerSecond must be greater than 0.");
  if (!Number.isFinite(cost) || cost <= 0 || cost > policy.capacity) throw new Error("cost must be greater than 0 and no greater than capacity.");
}
