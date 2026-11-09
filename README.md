# HyperGaruda API — Control Deck

A responsive endpoint catalogue and local API documentation playground maintained by HyperGaruda.

## Dashboard
- Overview: `index.html`
- Endpoint catalogue: `catalog.html`
- API Playground: `playground.html`
- Previous dashboard snapshot: `legacy-index.html`
- Legacy category pages remain available for historical reference.

## Active endpoint inventory
The active catalogue contains **77 documented BintangAPI endpoint records across 13 categories**, transcribed from the public API documentation snapshot dated 2026-11-10.

| Category | Documented routes |
|---|---:|
| AI Chat | 9 |
| AI Image | 3 |
| AI Tools | 6 |
| Baca | 4 |
| Downloader | 3 |
| Info | 8 |
| Maker | 2 |
| Nonton | 9 |
| ScriptBlox | 3 |
| Search | 8 |
| Stalker | 15 |
| Tools | 6 |
| Uploader | 1 |
| **Total** | **77** |

The previous Phase 04 inventory of 74 legacy HTML records is preserved in `data/legacy-endpoints.json`. The active catalogue follows the upstream documentation's route and parameter metadata. Documentation presence is not live verification, availability or provider approval.

## Sources and attribution
- BintangAPI homepage: https://bintangapi.my.id/
- BintangAPI API documentation: https://bintangapi.my.id/api
- StarLabs Code Snippet Library: https://starlabs.biz.id/
- Upstream developer profile: https://github.com/Bintang-X

BintangAPI describes itself as a REST wrapper around scraper and script collections from StarLabs. The captured StarLabs page displayed 159 snippets; snippets are not equivalent to API endpoints. HyperGaruda records public route metadata with attribution. No upstream scraper code, scripts, credentials or implementation logic are copied. The user previously stated that a permission request had been sent to the upstream developer; approval is not assumed and permission status remains pending confirmation.

## Playground behavior
- Endpoint selection, parameter entry, route preview and cURL/Node.js snippet previews are available in `playground.html`.
- Preview generation is local-only and returns a synthetic response.
- The Playground does not send upstream requests.
- Live mode remains disabled until a gateway is implemented with runtime validation, provider allowlists, timeouts, outbound controls and Phase 05 rate limiting.
- Privacy-sensitive profile lookup, media retrieval, script discovery, link-bypass, selected AI-labelled routes, third-party app discovery and file upload are marked review-required.

## Architecture
- `assets/`: shared visual system and browser interactions.
- `data/endpoints.json`: active 77-record documented endpoint inventory.
- `data/legacy-endpoints.json`: preserved 74-record Phase 04 inventory.
- `docs/PHASE-06-ENDPOINT-PLAYGROUND.md`: source provenance, scope and limitations.
- `apps/web`: reserved Next.js application boundary.
- `apps/docs`: reserved Astro documentation boundary.
- `apps/ui-lab`: reserved Vite UI/CSS experiment boundary.
- `packages/contracts`: transport-neutral TypeScript contracts.
- `packages/config`: non-secret runtime configuration parser.
- `packages/rate-limit`: framework-neutral dual-layer token-bucket engine with optional injected Redis/Lua adapter.
- `services/native`: isolated Rust library scaffold.

The current UI remains static HTML5, CSS3 and browser JavaScript. Framework boundaries are not described as instantiated applications.

## Phase 05 — Rate limiting
The rate-limit package separates gateway/client budgets from provider/endpoint budgets. Memory is single-process development storage; Redis is optional and is not connected or provisioned. Gateway integration remains pending. See [Phase 05 notes](docs/PHASE-05-RATE-LIMITING.md).

## Phase 06 — Endpoint expansion and Playground
The active catalogue now follows the 77 route records exposed by BintangAPI docs. The former 74-record inventory remains archived. The Playground generates local-only request previews; it does not contact upstream hosts. Live execution is not available until the gateway is ready. See [Phase 06 notes](docs/PHASE-06-ENDPOINT-PLAYGROUND.md).

## Development
The UI has no third-party runtime dependencies and can be served as static files. The foundation metadata check remains available through `npm run check:foundation`.

## Roadmap
1. Phase 04 — dashboard and catalogue UI refresh.
2. Phase 05 — dual rate-limiter package foundation (gateway integration pending).
3. Phase 06 — documented endpoint expansion and local-only Playground (implemented).
4. Next — gateway runtime, provider adapters, outbound allowlists, timeouts and reviewed live execution.
5. Authentication, authorization, audit events, operational hardening and deployment.

## License
This repository retains its existing MIT license. Upstream APIs, provider names, documentation and third-party services remain the property of their respective owners and may have separate terms.
