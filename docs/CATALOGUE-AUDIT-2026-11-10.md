# HyperGaruda API — Catalogue Audit (2026-11-10)

## Scope and method

This is a static repository audit of the active catalogue and the code paths that consume it. It does not send requests to BintangAPI or StarLabs, verify live availability, inspect private upstream implementation, or establish permission. No endpoint record has been silently corrected or removed.

Repository: `Hanzet22/hypergaruda-API`
Branch reviewed: `main`
Catalogue: `data/endpoints.json`
Snapshot date recorded by catalogue: `2026-11-10`

## Inventory integrity

- Active endpoint records: 77 (matches `sourceSnapshot.reportedEndpointCount`).
- Categories: 13.
- Every category's declared count matches the actual number of records in that category.
- Stable endpoint IDs: 77 unique; no duplicate IDs found.
- HTTP methods: 76 GET, 1 POST.
- Playground policy: 42 `preview-only`, 35 `review-required`.
- Verification state: all 77 are `documented-not-live-verified`.
- Source field: all 77 records use `bintangapi-docs`.
- Required top-level record fields are populated for all 77 records.
- Parameter names are unique within each endpoint.
- Parameter metadata types found: 66 `string`, 9 `select`, 1 `file`.
- No malformed route-path shapes were found in the catalogue's `/api/` paths.

Category counts:

| Category | Records |
| --- | ---: |
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

## Findings requiring resolution

### 1. Duplicate method + path

Two records share the exact `GET /api/aitools/ai-ppt` route:

- `ai-tools-ai-ppt-13` — title `AI PPT`, parameter `prompt`.
- `ai-tools-ppt-job-17` — title `PPT JOB`, parameter `job`.

The local Playground distinguishes these records by their unique IDs, but both previews resolve to the same upstream URL path. The Gateway registry currently enforces unique endpoint IDs, not unique provider + method + path tuples. Therefore both could be registered independently even though their upstream route identity collides.

Do not delete, rename, or merge either record without checking the upstream documentation semantics. Confirm whether this is one route with two query modes, an intentional overloaded route, or a catalogue transcription error. Until confirmed, both should remain unregistered for live routing.

### 2. Missing descriptions

32 records have an empty `description` string. Their IDs and titles remain available, but the catalogue lacks descriptive text for them. Do not invent descriptions; recover them from the source documentation or explicitly mark them as unavailable.

Affected IDs:

- `ai-chat-qwen3-coder-08`
- `info-google-news-30`
- `info-kompas-news-31`
- `info-liputan6-32`
- `info-sindo-news-33`
- `maker-brat-34`
- `maker-brat-video-35`
- `nonton-otakudesu-completed-36`
- `nonton-otakudesu-detail-37`
- `nonton-otakudesu-genre-38`
- `nonton-otakudesu-genre-list-39`
- `nonton-otakudesu-home-40`
- `nonton-otakudesu-ongoing-41`
- `nonton-otakudesu-schedule-42`
- `nonton-otakudesu-search-43`
- `nonton-otakudesu-stream-download-44`
- `scriptblox-scriptblox-home-45`
- `scriptblox-scriptblox-search-46`
- `scriptblox-scriptblox-trending-47`
- `search-ff-hero-50`
- `search-stikerly-search-53`
- `stalker-channel-wa-view-56`
- `stalker-chess-com-user-stalker-57`
- `stalker-free-fire-stalker-58`
- `stalker-instagram-stalker-60`
- `stalker-lahelu-stalker-61`
- `stalker-minecraft-user-stalk-62`
- `stalker-ml-check-63`
- `stalker-npm-stalk-64`
- `stalker-pinterest-user-stalker-65`
- `stalker-soundcloud-user-stalker-67`
- `stalker-telegram-stalk-68`
- `stalker-youtube-channel-stalker-70`

### 3. Provider provenance is not a provider mapping

The catalogue's base URL is `https://bintangapi.my.id/api`, while `sourceOrigin` is `StarLabs`. Its attribution text describes BintangAPI as a REST wrapper around scraper/script collections from StarLabs. All 77 records are sourced from the BintangAPI documentation snapshot.

This does not establish that the 77 routes are directly hosted by StarLabs, that StarLabs is the runtime origin, or that either party has granted permission. Keep BintangAPI documentation provenance, upstream attribution, actual runtime host, and permission status as separate facts.

### 4. Parameter contract is incomplete

The catalogue records names and basic UI types, but the Phase 06 documentation correctly notes that the source does not consistently state required/optional status and does not provide complete response schemas. The single `file` parameter also needs a dedicated upload contract before it can be represented by the current primitive-only Gateway parameter interface.

Do not infer requiredness, content types, file limits, response shapes, authentication, or idempotency from the current metadata.

## Existing implementation behavior

- The Playground selects records by unique endpoint ID and creates local previews only. It does not send upstream requests.
- The Playground uses the BintangAPI hostname for preview URL construction; this is preview generation, not proof that the route is live.
- The Gateway registry rejects duplicate endpoint IDs and missing provider adapters, but does not reject duplicate provider + method + path combinations.
- The Phase 08 mapping guard requires explicit `permissionStatus: "confirmed"`; the example mapping remains pending and empty.
- The 35 `review-required` records remain gated in the Playground.
- No provider is configured and no catalogue route is registered in the Gateway.

## Decision and remediation order

1. Resolve the duplicate AI PPT route against source documentation.
2. Recover or explicitly mark the 32 missing descriptions.
3. Record provider provenance per endpoint: documentation source, claimed upstream origin, actual confirmed runtime host, and permission evidence.
4. Complete parameter contracts, especially upload/file behavior and requiredness.
5. Add a route-collision guard keyed by provider ID + HTTP method + normalized provider path before live route registration.
6. Only then prepare an approval-gated mapping for a single provider and a small reviewed subset.

## Verification boundary

This report is based on static GitHub file inspection and structural analysis of the checked-in catalogue and implementation. No tests, builds, live endpoint requests, fuzzing, or active probing were run. It is not a claim that the upstream API is healthy, safe, authorized, or fully documented.
