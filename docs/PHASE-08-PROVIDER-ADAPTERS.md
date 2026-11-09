# Phase 08 — Provider Adapter Implementation & Mapping Foundation

Status: implemented as a reusable outbound HTTPS adapter and an approval-gated mapping contract. No upstream provider is configured, no external provider request is made, and no Phase 06 endpoint is registered.

## Added package

- `packages/providers` — `@hypergaruda/providers`, dependency-free at runtime apart from the local `@hypergaruda/gateway` workspace contract.
- `FetchProviderAdapter` implements the Phase 07 `ProviderAdapter` interface.
- `ProviderMappingManifest` records a provider origin, exact allowed hostnames, source reference, permission state, and reviewed endpoint mappings.
- `assertProviderMappingApproved()` blocks mappings whose permission state is not explicitly `confirmed`.

## Outbound request controls

- HTTPS only; clean origin with no credentials, query, fragment, or non-default port.
- Exact hostname allowlist; wildcard and suffix matching are rejected.
- Provider origin is fixed at adapter construction and is never derived from caller input.
- Caller can provide only the fixed relative route path and the validated primitive query parameters supplied by the Gateway contract.
- Path traversal segments, encoded slash/backslash, protocol-relative paths, query/fragment injection, and control characters are rejected.
- Redirects use `redirect: "manual"` and all 3xx responses are rejected. No automatic retries are implemented.
- Gateway-provided `AbortSignal` is passed to fetch.
- Response `Content-Length` is checked when available; response streams are read incrementally and cancelled when the byte cap is exceeded.
- Adapter-level response cap defaults to 1 MB and is bounded to 10 MB. Phase 07 still applies its route-level cap after adapter return.
- Only a constrained content-type header is returned to the Gateway.
- Optional authorization value is accepted only through trusted server-side construction; it must come from a secret store/environment configuration and must never be committed or exposed to the browser.

## Important network boundary

This package uses Node's built-in Fetch API and a fixed exact hostname allowlist. It does not pin DNS resolution to the validated IP address. Therefore it is not a complete defense against a hostile DNS rebinding scenario by itself. Production deployment must enforce outbound egress policy (or use a reviewed egress proxy/HTTP dispatcher that pins and validates destination addresses), block private/loopback/link-local/metadata destinations, and preserve TLS certificate verification. Do not expose arbitrary URL fetching through this adapter.

## Provider and endpoint approval

The Phase 06 catalogue contains documented metadata, not permission or live availability. Its source snapshot records permission as `pending-confirmation`. Accordingly:

- No BintangAPI or StarLabs origin is hardcoded as an active provider.
- No endpoint from the 77-record catalogue is registered.
- The 35 review-required catalogue entries remain disabled.
- The example mapping template starts with `pending-confirmation` and an empty endpoint list.
- A mapping must be reviewed and explicitly marked `confirmed` before it can pass the approval guard. This code guard does not replace a written permission record or legal/terms review.

## Configuration example

Construct the adapter only in a trusted server runtime:

```ts
const provider = new FetchProviderAdapter({
  id: "approved-provider",
  origin: process.env.APPROVED_PROVIDER_ORIGIN!,
  allowedHosts: ["api.example.com"],
  authorization: process.env.APPROVED_PROVIDER_TOKEN,
  maxResponseBytes: 1_000_000,
});
```

The example is illustrative. Do not set a provider origin or token until the provider and its permission are confirmed. Do not commit a real secret.

## Not included

- No live provider adapter instance or endpoint route registration.
- No authentication/API-key issuance or identity resolution.
- No Redis provisioning, production quotas, deployment, or Next.js/Astro/Vite host integration.
- No upstream calls, scraping, or credential use.
- No tests or builds were run, per the no-test implementation instruction. GitHub structural readback is the only completion check.

## Next integration step

After written permission and endpoint behavior are confirmed for one provider, create a reviewed mapping manifest, attach explicit gateway rate-limit policies, register only those approved routes, and integrate the Gateway into a trusted server host. Keep all remaining endpoints disabled.
