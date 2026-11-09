export type RateLimitScope = "gateway-client" | "provider" | "endpoint" | "identity";
export interface RateLimitPolicy { id: string; scope: RateLimitScope; capacity: number; refillPerSecond: number; cost?: number; }
export interface RateLimitRequest { key: string; policy: RateLimitPolicy; }
export interface RateLimitDecision { allowed: boolean; limit: number; remaining: number; resetAtMs: number; retryAfterMs: number; policyId: string; scope: RateLimitScope; }
export interface RateLimitStore { consumeMany(requests: readonly RateLimitRequest[]): Promise<RateLimitDecision[]>; }
export interface RedisScriptExecutor { eval(script: string, keys: readonly string[], args: readonly string[]): Promise<unknown>; }
export interface RateLimitResult { allowed: boolean; decisions: RateLimitDecision[]; retryAfterMs: number; }
