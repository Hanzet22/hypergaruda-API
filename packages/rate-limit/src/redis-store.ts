import type { RateLimitDecision, RateLimitRequest, RateLimitStore, RedisScriptExecutor } from "./types.js";
const TOKEN_BUCKET_SCRIPT = `
local count = #KEYS
local now = redis.call("TIME")
local nowMs = (tonumber(now[1]) * 1000) + math.floor(tonumber(now[2]) / 1000)
local allowed = 1
local retryAfter = 0
local computed = {}
for i = 1, count do
  local offset = ((i - 1) * 4)
  local capacity = tonumber(ARGV[offset + 1])
  local refillPerMs = tonumber(ARGV[offset + 2])
  local cost = tonumber(ARGV[offset + 3])
  local ttlMs = tonumber(ARGV[offset + 4])
  local values = redis.call("HMGET", KEYS[i], "tokens", "updatedAtMs")
  local tokens = tonumber(values[1]) or capacity
  local updatedAtMs = tonumber(values[2]) or nowMs
  tokens = math.min(capacity, tokens + (math.max(0, nowMs - updatedAtMs) * refillPerMs))
  local needed = math.max(0, cost - tokens)
  if needed > 0 then allowed = 0; retryAfter = math.max(retryAfter, math.ceil(needed / refillPerMs)) end
  table.insert(computed, {capacity=capacity, refillPerMs=refillPerMs, cost=cost, ttlMs=ttlMs, tokens=tokens})
end
local result = {allowed, retryAfter}
for i = 1, count do
  local item = computed[i]
  local remaining = math.max(0, item.tokens - (allowed == 1 and item.cost or 0))
  table.insert(result, math.floor(remaining))
  table.insert(result, math.ceil((item.capacity - remaining) / item.refillPerMs))
end
if allowed == 1 then
  for i = 1, count do
    local item = computed[i]
    redis.call("HSET", KEYS[i], "tokens", math.max(0, item.tokens - item.cost), "updatedAtMs", nowMs)
    redis.call("PEXPIRE", KEYS[i], item.ttlMs)
  end
end
return result
`;
export interface RedisRateLimitStoreOptions { executor: RedisScriptExecutor; keyPrefix?: string; }
/** Optional atomic Redis adapter. The host injects a client wrapper; no SDK or credentials are bundled. */
export class RedisRateLimitStore implements RateLimitStore {
  private readonly executor: RedisScriptExecutor;
  private readonly keyPrefix: string;
  constructor(options: RedisRateLimitStoreOptions) {
    this.executor = options.executor; this.keyPrefix = options.keyPrefix ?? "hypergaruda:rate-limit";
    if (!this.keyPrefix.trim()) throw new Error("keyPrefix must not be empty.");
  }
  async consumeMany(requests: readonly RateLimitRequest[]): Promise<RateLimitDecision[]> {
    if (!requests.length) return [];
    const keys = requests.map(({ key, policy }) => {
      validateRequest({ key, policy });
      return this.keyPrefix + ":" + key;
    });
    if (new Set(keys).size !== keys.length) throw new Error("Duplicate keys are not allowed in one consumeMany operation.");
    const args: string[] = [];
    for (const { policy } of requests) {
      const refillPerMs = policy.refillPerSecond / 1000;
      args.push(String(policy.capacity), String(refillPerMs), String(policy.cost ?? 1), String(Math.ceil(policy.capacity / refillPerMs) + 60_000));
    }
    const raw = await this.executor.eval(TOKEN_BUCKET_SCRIPT, keys, args);
    if (!Array.isArray(raw) || raw.length !== 2 + requests.length * 2) throw new Error("Redis rate-limit script returned an invalid response.");
    const values = raw.map(Number);
    if (values.some((value) => !Number.isFinite(value))) throw new Error("Redis rate-limit script returned non-numeric values.");
    const allowed = values[0] === 1; const retryAfterMs = Math.max(0, values[1]);
    return requests.map(({ policy }, index) => ({
      allowed, limit: policy.capacity, remaining: Math.max(0, values[2 + index * 2]),
      resetAtMs: Date.now() + Math.max(0, values[3 + index * 2]), retryAfterMs,
      policyId: policy.id, scope: policy.scope,
    }));
  }
}
function validateRequest(request: RateLimitRequest): void {
  const { key, policy } = request; const cost = policy.cost ?? 1;
  if (!key || !policy.id || !policy.scope) throw new Error("Rate-limit key and policy fields are required.");
  if (!Number.isFinite(policy.capacity) || policy.capacity < 1) throw new Error("capacity must be at least 1.");
  if (!Number.isFinite(policy.refillPerSecond) || policy.refillPerSecond <= 0) throw new Error("refillPerSecond must be greater than 0.");
  if (!Number.isFinite(cost) || cost <= 0 || cost > policy.capacity) throw new Error("cost must be greater than 0 and no greater than capacity.");
}
