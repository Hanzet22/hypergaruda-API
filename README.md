# HyperGaruda API — Control Deck

A responsive endpoint catalogue and local API documentation playground maintained by HyperGaruda.

## Dashboard
- Overview: `index.html`
- Endpoint catalogue: `catalog.html`
- API Playground: `playground.html`
- Previous dashboard snapshot: `legacy-index.html`
- Legacy category pages remain available for historical reference.

## Active endpoint inventory
The active catalogue contains **77 documented BintangAPI endpoint records across 13 categories**, transcribed from the public API documentation snapshot dated 2026-11-10. Documentation presence is not live verification or availability.

The former Phase 04 inventory of 74 records is preserved in `data/legacy-endpoints.json`. Public route metadata is attributed to BintangAPI and StarLabs. No upstream scraper source code, scripts, credentials, assets or implementation logic are copied. Permission status remains pending confirmation.

## Playground behavior
The Playground provides local-only endpoint selection, parameter entry, route previews, synthetic responses and cURL/Node.js examples. It does not send upstream requests. Review-required endpoint records remain gated.

## Architecture
- `assets/`: shared visual system and browser interactions.
- `data/endpoints.json`: active 77-record documented endpoint inventory.
- `data/legacy-endpoints.json`: preserved 74-record Phase 04 inventory.
- `docs/`: phase scope, source provenance and implementation notes.
- `packages/contracts`: transport-neutral TypeScript contracts.
- `packages/config`: non-secret runtime configuration parser.
- `packages/rate-limit`: framework-neutral dual-layer token-bucket engine with optional injected Redis/Lua adapter.
- `packages/gateway`: framework-neutral gateway runtime and explicit provider adapter registry.
- `apps/web`, `apps/docs`, `apps/ui-lab`: reserved framework boundaries, not instantiated production apps.
- `services/native`: isolated Rust library scaffold.

The UI remains static HTML5, CSS3 and browser JavaScript. No live API server is deployed by this repository.

## Phase 05 — Rate limiting
The rate-limit package separates gateway/client budgets from provider/endpoint budgets. Memory is single-process development storage; Redis is optional and is not connected or provisioned. See [Phase 05 notes](docs/PHASE-05-RATE-LIMITING.md).

## Catalogue audit\nA static audit of the 77-record inventory, route collision, missing descriptions, provider provenance and integration blockers is recorded in [Catalogue Audit](docs/CATALOGUE-AUDIT-2026-11-10.md). No live upstream requests were made.\n\n## Phase 06 — Endpoint expansion and Playground
The active catalogue follows 77 documented route records. The Playground generates local-only previews; it does not contact upstream hosts. See [Phase 06 notes](docs/PHASE-06-ENDPOINT-PLAYGROUND.md).

## Phase 07 — Gateway runtime
The gateway package provides explicit provider registration, request validation, Phase 05 rate-limit integration, process-local concurrency bounds, deadlines and response-size limits. It ships with zero registered routes and zero live provider adapters. No upstream requests are made. See [Phase 07 notes](docs/PHASE-07-GATEWAY-RUNTIME.md).

## Development
The UI has no third-party runtime dependencies. The foundation metadata check remains available through `npm run check:foundation`.

## Roadmap
1. Phase 04 — dashboard and catalogue UI refresh.
2. Phase 05 — dual rate-limiter package foundation.
3. Phase 06 — documented endpoint expansion and local-only Playground.
4. Phase 07 — gateway runtime and provider adapter foundation.
5. Next — reviewed provider adapter implementation and host-specific HTTP integration, after provider permissions and endpoint policies are confirmed.
6. Authentication, authorization, audit events, operational hardening and deployment.

## License
This repository retains its existing MIT license. Upstream APIs, provider names, documentation and third-party services remain the property of their respective owners and may have separate terms.
