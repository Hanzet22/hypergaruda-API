# HyperGaruda API — Control Deck

A refreshed, responsive interface for browsing the BintangAPI endpoint inventory, maintained by HyperGaruda.

## Dashboard
- Overview: `index.html`
- Endpoint catalog: `catalog.html`
- Previous dashboard snapshot: `legacy-index.html`
- Legacy category playgrounds: `ai.html`, `ai-image.html`, `ai-tools.html`, `baca.html`, `berita.html`, `brat-maker.html`, `downloader.html`, `nonton.html`, `scriptblox.html`, `search.html`, `stalker.html`, `tools.html`, and `uploader.html`.

The new interface provides category navigation, endpoint search, method labels, route copying, dark/light themes, and a mobile-friendly layout.

## Catalog inventory
The local catalog contains **74 individually transcribed endpoint records across 13 modules**. The official BintangAPI documentation index currently reports **77 endpoints**; the net difference of 3 is tracked as an unmapped source delta rather than invented route names.

| Module | Records |
|---|---:|
| AI Chat | 9 |
| AI Image | 3 |
| AI Tools | 5 |
| Baca | 4 |
| Berita | 8 |
| Brat Maker | 2 |
| Downloader | 3 |
| Nonton | 9 |
| ScriptBlox | 3 |
| Search | 8 |
| Stalker | 16 |
| Tools | 3 |
| Uploader | 1 |
| **Total** | **74** |

> The 74 local records are not live-verified or approved endpoint claims. BintangAPI's current index reports 77 total endpoints with category counts that differ from the preserved legacy pages. Three net records are not yet individually mapped. The redesigned dashboard and new Playground simulation do not invoke upstream APIs directly. Legacy module pages remain separate.

## Architecture
- `assets/`: shared visual system and browser interactions.
- `data/endpoints.json`: normalized endpoint inventory.
- `apps/web`: reserved Next.js application boundary.
- `apps/docs`: reserved Astro documentation boundary.
- `apps/ui-lab`: reserved Vite UI/CSS experiment boundary.
- `packages/contracts`: transport-neutral TypeScript contracts.
- `packages/config`: non-secret runtime configuration parser.
- `packages/rate-limit`: framework-neutral dual-layer token-bucket engine, bounded memory store, and optional injected Redis/Lua adapter.
- `services/native`: isolated Rust library scaffold.

The current UI uses HTML5, CSS3, and browser JavaScript to keep this migration slice lightweight and compatible with static hosting. The framework boundaries from Phase 03 remain reserved and are not falsely described as fully instantiated apps.

## Phase 06 — Endpoint catalog & Playground
The official BintangAPI index reports 77 endpoints. This repository preserves 74 individually transcribed route records and records the three-entry net delta as unmapped until individual detail pages can be reconciled. The new `playground.html` is a documentation and request-preview simulator only: it does not send upstream requests. Live execution remains disabled until a validated gateway and provider allowlist exist. See [Phase 06 notes](docs/PHASE-06-ENDPOINT-PLAYGROUND.md).

## Phase 05 — Rate limiting
The rate-limit package separates gateway/client policies from provider/endpoint policies. Its memory backend is for local or single-process use; Redis is optional and is not connected or provisioned by this repository. See [Phase 05 design and integration notes](docs/PHASE-05-RATE-LIMITING.md).

## Attribution
- Dashboard UI / integration: [HyperGaruda](https://github.com/Hanzet22)
- API documentation / upstream service: [BintangAPI X](https://github.com/Bintang-X)
- Upstream documentation: [BintangAPI](https://bintangapi.my.id/) · [API index](https://bintangapi.my.id/api)
- Related snippet-library reference: [StarLabs](https://starlabs.biz.id/) (the public page currently reports 0 snippets; no code was copied from it).

This repository does not claim ownership of the upstream BintangAPI service or its implementation. Use and redistribution of upstream code or services remain subject to their respective terms and permissions.

## Development
This UI slice has no third-party runtime dependencies and can be served as static files. The foundation metadata check remains available with `npm ci --ignore-scripts` and `npm run check:foundation`.

## Roadmap
1. UI revamp and endpoint inventory normalization.
2. API Gateway Foundation with runtime validation and provider allowlists.
3. Dual Rate Limiter and abuse controls (Phase 05 package foundation implemented; gateway integration pending).
4. Sandbox boundary and execution isolation design.
5. Authentication, authorization, audit events, and operational hardening.
6. Provider migration, deployment, monitoring, and release readiness.

See [Phase 03 Foundation](docs/PHASE-03-FOUNDATION.md), [Phase 04 UI Revamp](docs/PHASE-04-UI-REVAMP.md), and [Phase 05 Rate Limiting](docs/PHASE-05-RATE-LIMITING.md), plus [Phase 06 Playground](docs/PHASE-06-ENDPOINT-PLAYGROUND.md).

## License
This repository retains its existing MIT license. Upstream APIs, provider names, and third-party services remain the property of their respective owners and may have separate terms.
