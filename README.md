# HyperGaruda API — Control Deck

A refreshed, responsive interface for browsing the BintangAPI endpoint inventory, maintained by HyperGaruda.

## Dashboard
- Overview: `index.html`
- Endpoint catalog: `catalog.html`
- Previous dashboard snapshot: `legacy-index.html`
- Legacy category playgrounds: `ai.html`, `ai-image.html`, `ai-tools.html`, `baca.html`, `berita.html`, `brat-maker.html`, `downloader.html`, `nonton.html`, `scriptblox.html`, `search.html`, `stalker.html`, `tools.html`, and `uploader.html`.

The new interface provides category navigation, endpoint search, method labels, route copying, dark/light themes, and a mobile-friendly layout.

## Catalog inventory
The catalog contains **74 endpoint records across 13 modules**, transcribed from the preserved legacy HTML pages.

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

> These are catalog records, not live-verified or approved endpoint claims. The redesigned dashboard does not invoke upstream APIs directly. Legacy playgrounds retain their prior direct-request behavior.

## Architecture
- `assets/`: shared visual system and browser interactions.
- `data/endpoints.json`: normalized endpoint inventory.
- `apps/web`: reserved Next.js application boundary.
- `apps/docs`: reserved Astro documentation boundary.
- `apps/ui-lab`: reserved Vite UI/CSS experiment boundary.
- `packages/contracts`: transport-neutral TypeScript contracts.
- `packages/config`: non-secret runtime configuration parser.
- `services/native`: isolated Rust library scaffold.

The current UI uses HTML5, CSS3, and browser JavaScript to keep this migration slice lightweight and compatible with static hosting. The framework boundaries from Phase 03 remain reserved and are not falsely described as fully instantiated apps.

## Attribution
- Dashboard UI / integration: [HyperGaruda](https://github.com/Hanzet22)
- API documentation / upstream service: [BintangAPI X](https://github.com/Bintang-X)
- Upstream documentation: [bintangapi.my.id](https://bintangapi.my.id/)

This repository does not claim ownership of the upstream BintangAPI service or its implementation. Use and redistribution of upstream code or services remain subject to their respective terms and permissions.

## Development
This UI slice has no third-party runtime dependencies and can be served as static files. The foundation metadata check remains available with `npm ci --ignore-scripts` and `npm run check:foundation`.

## Roadmap
1. UI revamp and endpoint inventory normalization.
2. API Gateway Foundation with runtime validation and provider allowlists.
3. Dual Rate Limiter and abuse controls.
4. Sandbox boundary and execution isolation design.
5. Authentication, authorization, audit events, and operational hardening.
6. Provider migration, deployment, monitoring, and release readiness.

See [Phase 03 Foundation](docs/PHASE-03-FOUNDATION.md) and [Phase 04 UI Revamp](docs/PHASE-04-UI-REVAMP.md).

## License
This repository retains its existing MIT license. Upstream APIs, provider names, and third-party services remain the property of their respective owners and may have separate terms.
