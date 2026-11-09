# Phase 05 — Dual Rate Limiter & Abuse Protection

Status: implemented as a framework-neutral package. No live gateway route or Redis connection is enabled.

## Goals
- Separate gateway/client budgets from provider and endpoint budgets.
- Keep quota decisions behind one transport-neutral contract.
- Support local development without Redis and distributed deployments through an optional Redis adapter.
- Return consistent decisions and HTTP rate-limit headers.
- Keep identity resolution outside the limiter so proxy trust is explicit.

## Package layout
- packages/rate-limit/src/types.ts — policies, requests, decisions, store contract.
- memory-store.ts — bounded single-process token-bucket store.
- redis-store.ts — optional Lua-backed Redis store through an injected executor.
- engine.ts — single and multi-policy evaluation.
- headers.ts — framework-neutral RateLimit-* and Retry-After headers.
- key.ts — namespaced keys from opaque, already-resolved identities.

## Dual-layer model
1. Gateway/client policy: apply before dispatch, keyed by a trusted client identity or authenticated principal.
2. Provider policy: apply before the outbound provider call, keyed by provider and endpoint identity.

Use RateLimitEngine.checkMany() for combined client + provider decisions. Store implementations evaluate all supplied keys atomically and consume none if any policy denies. This prevents a denied provider quota from consuming the client's budget as a side effect.

Policies use token buckets: capacity controls burst allowance and refillPerSecond controls sustained throughput. No production quota values are asserted here; configure them from measured capacity and provider terms.

## Storage and deployment
- Memory store: development or deliberately single-process use only. It is bounded and does not coordinate instances.
- Redis store: optional shared backend. The host injects a RedisScriptExecutor; this package does not install a Redis SDK, connect to a database, or read credentials.
- The Redis adapter performs one Lua evaluation for multi-key atomicity. The host adapter maps its Redis client's eval signature to eval(script, keys, args).
- Redis keys share the configured prefix. For Redis Cluster, the host must use a hash-tagged key strategy so keys used in one multi-key script share a slot.
- A Redis outage surfaces as a storage error. The production gateway must fail closed with a controlled 503 for protected routes unless an explicit reviewed policy says otherwise. Never silently fall back to per-instance memory in production.

## Identity and proxy trust
- Pass only stable opaque identifiers into rateLimitKey(); do not store raw API keys, access tokens, email addresses, or other secrets.
- Resolve client IP in the hosting adapter. Do not trust arbitrary X-Forwarded-For values. Configure trusted proxy hops or CIDRs to match the actual deployment topology.
- IP policies should account for IPv6 aggregation and shared NAT trade-offs. Authenticated identities are usually better for per-user quotas.
- Avoid logging raw rate-limit keys. Log policy IDs, scopes, outcomes, and request IDs only.

## HTTP behavior
- Allowed requests can emit RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset.
- Denied requests should return HTTP 429 Too Many Requests with Retry-After in seconds.
- If the rate-limit backend is unavailable in production, return a controlled 503 rather than pretending the request was rate-limited or allowing unbounded traffic.
- Never expose provider credentials, raw identities, Redis errors, or internal stack traces in client responses.

## Not included
- No Redis provisioning, credentials, or live connection.
- No Next.js middleware or deployed gateway integration; apps/web remains a reserved boundary.
- No authentication system, API-key issuance, provider migration, execution sandbox, or deployment.
- No provider quota numbers without authoritative provider documentation.

## Integration sketch
    import { MemoryRateLimitStore, RateLimitEngine, rateLimitKey } from "@hypergaruda/rate-limit";
    const limiter = new RateLimitEngine(new MemoryRateLimitStore());
    const decision = await limiter.checkMany([
      { key: rateLimitKey("hg", "gateway-client", trustedClientId),
        policy: { id: "gateway-default", scope: "gateway-client", capacity: 20, refillPerSecond: 1 } },
      { key: rateLimitKey("hg", "provider", "provider-a:search"),
        policy: { id: "provider-search", scope: "provider", capacity: 5, refillPerSecond: 0.25 } }
    ]);
    if (!decision.allowed) {
      // HTTP adapter returns 429 with rateLimitHeaders(decision).
    }

The example quotas are illustrative only, not production recommendations. Replace the memory store with RedisRateLimitStore only after a shared Redis service is provisioned and configured.
