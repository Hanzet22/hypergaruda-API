# HyperGaruda API — Catalogue Audit (2026-11-10)

## Scope and method

Static inspection of the latest `main` branch, including the active and legacy catalogues, Phase 06–08 documentation, Playground code, Gateway registry, and provider mapping guard. Public documentation was read as documentation only. No upstream endpoint was called, no user content was submitted, and no active probing was performed.

Repository: `Hanzet22/hypergaruda-API`  
Branch: `main`  
Active catalogue: `data/endpoints.json`  
Recorded source snapshot: `2026-11-10`

## Inventory integrity

- Active endpoint records: 77; matches `sourceSnapshot.reportedEndpointCount`.
- Categories: 13; every declared category count matches the actual records.
- Endpoint IDs: 77 unique.
- Methods: 76 GET, 1 POST.
- Playground policy: 42 `preview-only`, 35 `review-required`.
- Verification: all 77 are `documented-not-live-verified`.
- Every record has its required top-level catalogue fields populated.
- Parameter names are unique within each endpoint.
- Parameter metadata types: 66 `string`, 9 `select`, 1 `file`.
- No malformed `/api/` path shapes were found.
- Exactly one duplicate method + path tuple was found; see Finding 1.

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

### 1. Duplicate method + path — unresolved

Two records share the exact `GET /api/aitools/ai-ppt` route:

- `ai-tools-ai-ppt-13` — title `AI PPT`, parameter `prompt`.
- `ai-tools-ppt-job-17` — title `PPT JOB`, parameter `job`.

The public BintangAPI documentation page currently exposes the overall endpoint count, category labels/counts, a generic description of the service, and the published base URL in its accessible rendered/static representation. It did not expose either endpoint's detail-level contract in the retrieved page content. Search did not locate authoritative public detail documentation for these two records. The repository history preserves the same two records but does not resolve their semantics.

Therefore it is not established whether this is one route with different query modes, an intentional overloaded route, or a transcription error. Preserve both IDs and route records unchanged. Do not register either route until the provider documents the distinction. The Gateway registry currently enforces unique endpoint IDs, not unique provider + method + normalized path tuples.

### 2. Missing descriptions — 33, not 32

A fresh count of the current `data/endpoints.json` finds **33** empty description strings. The previous audit's summary count of 32 was incorrect; its affected-ID list already contained 33 entries.

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

No descriptions were filled from endpoint names, category labels, unrelated third-party projects, or assumptions. The public documentation content retrievable in this run did not expose endpoint-level descriptions for these records. Keep the descriptions empty until authoritative BintangAPI detail documentation or a provider-supplied export is available.

### 3. Provenance, runtime host, and permission are distinct

The current catalogue has a single documentation source for all 77 records: the BintangAPI public documentation snapshot. Each record's `source` and `sourceUrl` identify that documentation provenance.

BintangAPI's own homepage describes the service as a collection of scraping code used internally at StarLabs, packaged as REST endpoints. The documentation publishes `https://bintangapi.my.id/api` as its base URL. These statements establish the provider's public attribution and documented base URL; they do **not** independently confirm the runtime host or live behavior of each individual route.

Keep the following concepts separate:

| Concept | Evidence-backed status |
| --- | --- |
| Documentation source | BintangAPI public API documentation; applies to all 77 catalogue records |
| Claimed upstream attribution | StarLabs, as stated by BintangAPI |
| Published documentation base URL | `https://bintangapi.my.id/api` |
| Confirmed runtime host per endpoint | Unknown; no live requests or endpoint-level host evidence |
| Permission evidence | Pending confirmation; no written approval recorded in this repository |

The existing `sourceSnapshot.sourceOrigin` value must not be interpreted as a confirmed runtime origin. The current record set does not contain endpoint-specific runtime-host or permission evidence. Do not infer either from the documentation URL, attribution statement, or route path.

### 4. Parameter contracts remain partial

The catalogue stores parameter names, UI metadata types, options, and placeholders. It does not consistently provide authoritative required/optional declarations or complete parameter semantics. The single `file` parameter has no complete upload contract in the Gateway's primitive query-parameter interface.

Do not infer requiredness, data formats beyond the documented metadata, authentication, content types, file limits, response schemas, idempotency, or validation rules. Do not promote placeholder values into contract constraints. A parameter contract may be expanded only from endpoint-level source documentation or written provider confirmation.

### 5. Other consistency and implementation observations

- Category totals, unique IDs, top-level fields, parameter-name uniqueness, method totals, policy totals, and path shapes are structurally consistent on current `main`.
- No other method + path collision was found in the active catalogue.
- The duplicate AI PPT path is not rejected by `packages/gateway/src/registry.ts`, which checks endpoint ID uniqueness only. A future registration guard should use provider ID + method + normalized provider path, but no runtime registration change is made in this reconciliation.
- `assets/playground.js` constructs local preview URLs using the documented BintangAPI base host. It explicitly labels the preview as simulation and does not send a request. This is not runtime-host verification.
- `packages/providers/src/mapping.ts` requires `permissionStatus: "confirmed"` before a mapping passes the approval guard. The current Phase 08 example remains pending and empty.
- All 35 `review-required` records remain gated. No policy values were changed.

## Evidence reviewed

- [BintangAPI homepage](https://bintangapi.my.id/) — public description and attribution.
- [BintangAPI API documentation](https://bintangapi.my.id/api) — public catalogue index and published base URL; endpoint detail records were not exposed in the retrieved page content.
- [StarLabs public site](https://starlabs.biz.id/) — attribution reference only; it does not establish BintangAPI route hosting or permission.
- [Phase 06 notes](PHASE-06-ENDPOINT-PLAYGROUND.md)
- [Phase 07 notes](PHASE-07-GATEWAY-RUNTIME.md)
- [Phase 08 notes](PHASE-08-PROVIDER-ADAPTERS.md)
- [Phase 06 catalogue import commit](https://github.com/Hanzet22/hypergaruda-API/commit/b1f314705ac5f2f2eb0591356561bce1e5c89b70)
- [Gateway registry](../packages/gateway/src/registry.ts)
- [Provider mapping guard](../packages/providers/src/mapping.ts)

## Follow-up public-documentation pass

A second static source pass was performed against the public documentation page and its discoverable page index:

- The [BintangAPI documentation page](https://bintangapi.my.id/api/) returned its overview HTML with the reported total of 77 endpoints, all 13 category labels/counts, and the published base URL `https://bintangapi.my.id/api`.
- The returned page content exposes generic category summaries (for example, “Explore AI tools related endpoints and features”), but not individual endpoint detail records, route-specific descriptions, or parameter contracts. The site map did not return separate endpoint-detail URLs, and domain-restricted searches on BintangAPI and StarLabs returned no indexed detail pages for the duplicate or sampled blank-description IDs. This is a search/index limitation, not proof that no private, dynamically loaded, or otherwise undiscovered documentation exists.
- The page displays an “OPERATIONAL” badge. It is a page-level UI label only; it does not verify any individual route's runtime host, uptime, availability, or response behavior.
- Broad searches also surfaced documentation hosted at `developer.ppt.ai`. No link or attribution in the BintangAPI/StarLabs materials connects that separate domain to either HyperGaruda AI PPT record, so it was excluded as non-authoritative for this reconciliation: [PPT.AI documentation](https://developer.ppt.ai/id/doc/).
- A second collision pass normalized route paths by removing query components, collapsing repeated slashes, trimming trailing slashes, and comparing case-insensitively. The only active collision remains `GET /api/aitools/ai-ppt`; no cross-method path overlap was found. The preserved 74-record legacy inventory has 74 unique IDs and no normalized method + path collision. Legacy records remain historical and `unverified`.
- All active parameter objects still contain only `name`, `type`, `options`, and `placeholder`. There is no source-backed requiredness, request-body schema, upload MIME/size limit, authentication contract, or response schema to add. The sole `file` parameter belongs to the existing review-required Uguu POST record; its policy remains unchanged.

No catalogue field was corrected in this pass because the retrieved public evidence does not establish the missing endpoint-level facts. Both AI PPT records, all 33 blank descriptions, the documentation-only verification state, unknown per-endpoint runtime host, pending permission, and all 35 review-required restrictions remain unchanged.

## Decision and next evidence required

1. Obtain authoritative BintangAPI endpoint detail documentation or written provider confirmation for the AI PPT duplicate.
2. Obtain the official endpoint detail export/page content for the 33 blank descriptions.
3. Obtain written, endpoint-scoped confirmation of runtime routing and permission before adding runtime-host or permission claims.
4. Obtain source-backed parameter contracts, especially requiredness and the upload/file contract.
5. Add a provider + method + normalized-path collision guard before any future route registration; this is a code follow-up, not permission to register routes.

Until that evidence exists, preserve both AI PPT records, leave the 33 descriptions empty, retain runtime host as unknown and permission as pending, keep all 35 review-required records gated, and register zero catalogue routes.

## Verification boundary

This is a static repository and public-documentation review. No live upstream API requests, endpoint execution, active probing, fuzzing, tests, or builds were run. No endpoint is claimed live-verified, available, authorized, or approved.
