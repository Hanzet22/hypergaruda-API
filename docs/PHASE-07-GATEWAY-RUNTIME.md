# Phase 07 — Gateway Runtime & Provider Adapter Foundation

Status: implemented as a framework-neutral execution foundation. No provider adapter is configured, no upstream network request is made, and no documented endpoint is marked live.

## Package
- `packages/gateway` — `@hypergaruda/gateway`, Node.js ESM workspace with no third-party dependencies.
- `types.ts` — gateway request, route, provider adapter and response contracts.
- `registry.ts` — explicit provider and endpoint registration; duplicate IDs and missing adapters are rejected.
- `validation.ts` — fixed relative provider paths, method checks, allowed parameter names, primitive values and length/count bounds.
- `runtime.ts` — rate-limit integration, per-provider concurrency ceiling, abort deadline, bounded response size and safe response-header forwarding.
- `errors.ts` — stable gateway error codes and HTTP status mapping.

## Dispatch sequence
1. Resolve a registered endpoint ID and provider adapter.
2. Validate the request against the route's explicit parameter allowlist.
3. Atomically check gateway-client and provider rate-limit policies through Phase 05 `RateLimitEngine.checkMany()`.
4. Fail closed with a controlled 503 if the rate-limit store errors.
5. Apply the in-process per-provider concurrency ceiling.
6. Invoke only the registered adapter with a fixed provider-relative path and an `AbortSignal` deadline.
7. Bound response bytes, validate the returned status, and forward only a constrained content-type header.

## Security boundaries
- No caller-supplied destination URL, arbitrary proxy, dynamic host, or redirect-following implementation exists in this package.
- Provider adapters own destination configuration and must use explicit HTTPS origins, outbound host allowlists, TLS verification, redirect rejection/revalidation, and bounded response reads.
- The adapter contract receives an abort signal and must honor cancellation. The runtime races the deadline and keeps the concurrency slot occupied until the adapter promise settles.
- The runtime forwards no caller headers or provider credentials.
- Rate-limit identities must be opaque values resolved by a trusted host adapter; raw API keys, tokens, emails and untrusted forwarded IP headers must not be passed.
- Concurrency accounting in this package is process-local. Multi-instance production deployments need an infrastructure-level concurrency control.
- No automatic retries are performed; retry policy must be added only for provider operations with documented idempotency.
- Response bodies remain opaque bytes/text; provider-specific schema validation belongs in a reviewed adapter contract.

## Endpoint catalogue status
No route from the 77-record Phase 06 documentation catalogue is auto-registered. Upstream provider mapping, permission status and endpoint-specific behavior must be reviewed before a route is enabled. The previous 35 review-required entries remain gated. The package intentionally ships with zero configured provider adapters and zero configured routes.

## Not included
- No live HTTP provider adapter or network calls.
- No authentication, API-key issuance, identity resolution, Redis provisioning, secrets, production quotas or deployment.
- No Next.js/Astro/Vite server integration.
- No tests or build were run for this phase, per the no-test implementation preference. GitHub readback is the structural confirmation only.

## Next integration work
A host-specific server adapter can translate HTTP requests into `GatewayRequest`, resolve trusted identity, construct the `RateLimitEngine` with an approved store, register reviewed providers/routes, and map `GatewayError` into the shared API error envelope.
