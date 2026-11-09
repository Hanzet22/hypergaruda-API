# Phase 04 — UI Revamp

Status: implemented as a dependency-free static dashboard refresh.

## Scope
- Replace the old light multi-page landing experience with a dark, responsive control-deck UI.
- Use restrained red, blue, and gold accents with compact technical typography.
- Add searchable endpoint inventory, category filtering, method labels, and copy-route controls.
- Support dark/light themes, keyboard focus, mobile navigation, and reduced-motion preferences.
- Preserve all 13 legacy module playground pages and the previous home page snapshot.
- Normalize the 74 endpoint cards into `data/endpoints.json`.

## Data integrity
All catalog entries are marked `unverified`. They are transcribed from legacy HTML markup, not proof that an upstream endpoint is live, approved, supported, or safe to invoke. The new UI does not call upstream services. Legacy pages remain available separately and retain their previous direct-request behavior.

The old home page displayed Berita as 9 although 8 cards exist. The new catalog derives counts from the actual 74 cards: 9, 3, 5, 4, 8, 2, 3, 9, 3, 8, 16, 3, and 1.

## Architecture
This UI slice uses HTML5, CSS3, and browser JavaScript. It avoids adding framework dependencies or changing the npm lockfile before the Next.js app is activated. The Phase 03 Next.js, Astro, Vite, and Rust boundaries remain unchanged and are not described as instantiated applications.

## Files
- `index.html`: new dashboard overview.
- `catalog.html`: searchable endpoint inventory.
- `legacy-index.html`: preserved previous homepage.
- `assets/dashboard.css`, `assets/dashboard.js`, `assets/catalog.js`: shared UI and interactions.
- `data/endpoints.json`: 74 records across 13 categories.

## Deferred work
API Gateway Foundation remains a separate step: runtime validation, endpoint allowlist, provider adapters, request IDs, safe error envelopes, timeout policy, outbound host restrictions, and sanitized logging. The redesigned catalog can later gain a controlled execution workflow through that gateway, rather than direct browser-to-provider requests.
