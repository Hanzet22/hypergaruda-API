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
- `packages/providers/src/mapping.ts` requires `permissionStatus: "confirmed"` and at least one endpoint mapping before a manifest passes the approval guard. A generic pending/empty placeholder template exists at `examples/provider-mapping.template.json`; it is not a concrete provider configuration or permission record. The 2026-11-18 correction below supersedes the earlier inventory statement that no examples directory or template file was present.
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

## Follow-up public-documentation pass — 2026-11-11

A deeper static inspection of the current public documentation HTML corrected the limitation recorded in the previous pass. The rendered-text extraction omitted an inline script, but the page's raw HTML contains an embedded `window.__RAW_TREE` JSON tree.

- The [BintangAPI API documentation](https://bintangapi.my.id/api/) embeds **77 endpoint records across 13 categories**, including each record's display name, method, relative route, endpoint description, and parameter metadata. This was read from the documentation page source only; no endpoint URL was executed.
- All 77 current catalogue records match the embedded source by title, method, and route. Existing endpoint descriptions and parameter names, types, options, and placeholders also match the source. All 13 category counts match.
- The source tree itself has **33 empty endpoint descriptions**, exactly matching the 33 empty descriptions in the active catalogue. The documentation therefore does not currently provide replacement text for those records. No endpoint descriptions were invented or filled.
- The embedded source contains two separate records named **AI PPT** and **PPT JOB**, both with `GET /api/aitools/ai-ppt`. Their source descriptions and parameter names differ (`prompt` versus `job`). This confirms the collision exists in the public source tree, not merely in the local transcription. It does not establish whether the provider intends an overloaded route or has a documentation error; preserve both IDs and route records pending written clarification.
- Ten non-empty parameter-level `description` notes in the source tree are now preserved verbatim as `params[].description` in the active catalogue. The explicit `OPSIONAL` note remains literal text; it was not converted into a boolean requiredness rule. Source `default_value` entries are prefilled examples, not validation contracts, and were not imported as defaults.
- The page's `OPERATIONAL` badge is page-level presentation only. The published base URL `https://bintangapi.my.id/api` is documented provenance, not independent confirmation of each endpoint's runtime host or availability.
- Repository history was checked: the earlier 74-record catalogue commit did not contain alternate endpoint descriptions; the 77-record import commit already contains the same AI PPT/PPT JOB collision and 33 blank descriptions. No historical source in this repository resolves the missing text or route semantics.
- A normalized method + path pass still finds only the AI PPT/PPT JOB collision in the active catalogue. The 74-record legacy inventory has 74 unique IDs and no normalized method + path collision.

The `sourceSnapshot.provenance` block now explicitly separates documentation source, claimed upstream attribution, published base URL, unknown confirmed runtime host, pending permission, and absent recorded permission evidence. It applies uniformly to the 77 endpoint records, each of which retains its own `source`, `sourceUrl`, and `verification` fields. No endpoint-specific runtime-host or permission evidence was found.

The Gateway registry still checks endpoint ID uniqueness but does not reject duplicate provider + method + normalized provider-path tuples. No registry behavior or route registration was changed. The provider mapping approval guard remains in place, its example remains pending with no endpoints, and all 35 `review-required` records remain gated.

## Follow-up public-documentation contract and provenance pass — 2026-11-12

A fresh static read of the current BintangAPI documentation page and its public documentation UI assets was completed. The site map exposes the homepage and the single API documentation page; targeted public search did not locate separate endpoint-detail pages for AI PPT or PPT JOB. No endpoint URL was executed.

### Parameter metadata semantics

- The embedded source tree contains 76 parameter objects. Its documented parameter keys are `default_value`, `description`, `name`, `options`, `placeholder`, and `type`; the retrieved endpoint records do not provide a `required` flag, response schema, authentication contract, or file MIME/size limits.
- The public form renderer [`85444744script.js`](https://bintangapi.my.id/api/assets/85444744script.js) assigns `default_value` to the documentation form input. The public snippet generator [`94407567script.js`](https://bintangapi.my.id/api/assets/94407567script.js) also uses it as a fallback while assembling example URLs and generated request snippets. These are documentation UI prefill/example values; they do not establish a server-side API default and are not promoted to a request contract field.
- The source's ten non-empty parameter description notes, parameter names, types, options, and placeholders remain matched by the active catalogue. No new requiredness or validation constraints are justified.
- The sole `file` parameter belongs to `Uguu` (`POST`) and remains `review-required`. No MIME types, maximum upload size, body schema, or other upload constraints are documented. The Gateway's `GatewayRequest.params` and `ProviderCall.params` accept only primitive values; `FetchProviderAdapter` appends those values to the URL query and has no request-body contract. Therefore the current Gateway cannot represent the documented file field as a verified upload contract. Do not activate or reclassify this route.

### Provenance scope per endpoint

Each active endpoint retains its own `source`, `sourceUrl`, and `verification`. The remaining provenance facts are shared snapshot-level evidence, not endpoint-specific confirmations. The active catalogue now makes that inheritance explicit: every endpoint has `provenanceRef: "#/sourceSnapshot/provenance"`, and the referenced object declares its scope as all endpoint records in this snapshot. The shared values remain: BintangAPI documentation source; StarLabs as claimed attribution by BintangAPI; published documentation base URL only; confirmed runtime host `null` / `unknown`; permission `pending-confirmation`; permission evidence `not-recorded`. No endpoint-scoped runtime-host or permission approval was discovered.

### History and route-collision guard

- The [74-record historical snapshot](https://github.com/Hanzet22/hypergaruda-API/commit/d14274c41e0d2551fdbab6ae1fa088f570aaf12c) has no normalized method + path collision and contains no endpoint descriptions; it does not supply alternate text for the active records.
- The [77-record import commit](https://github.com/Hanzet22/hypergaruda-API/commit/b1f314705ac5f2f2eb0591356561bce1e5c89b70) already contains the same AI PPT/PPT JOB collision and 33 blank descriptions. Repository history therefore does not resolve either issue.
- The current [Gateway registry](../packages/gateway/src/registry.ts) rejects duplicate endpoint IDs but does not reject duplicate provider + method + normalized provider-path tuples. The active catalogue still has only the known AI PPT/PPT JOB collision; the legacy inventory has none. No generic collision guard or route behavior was changed because provider confirmation is still needed to distinguish intentional multiplexing from a documentation error.

No README link change was required. This pass changed metadata/documentation only; it did not register routes or change endpoint semantics.

## Follow-up public-source refresh — 2026-11-13

A fresh static fetch of the public BintangAPI documentation page returned HTTP 200 on 2026-11-13. The page source's embedded `window.__RAW_TREE` was parsed as documentation data only; no endpoint URL or Execute control was used.

- The embedded tree still contains **77 endpoint records across 13 category folders**. All 77 match the active catalogue by title, HTTP method, and route. Endpoint descriptions and the parameter fields `name`, `type`, `options`, `placeholder`, and `description` match exactly; no source/catalogue metadata mismatch was found.
- The source still contains **33 empty endpoint descriptions**, matching the 33 empty catalogue descriptions. No authoritative replacement text was found. The request's reference to 32 missing descriptions remains a stale count; the current evidence supports 33.
- The source still lists **AI PPT** and **PPT JOB** separately at `GET /api/aitools/ai-ppt`, with distinct descriptions and parameter names (`prompt` and `job`). This confirms the collision in the public documentation, but does not clarify whether the provider intends one overloaded route or has published an incorrect path. Both catalogue records remain unchanged.
- The source contains 76 parameter objects: 66 `string`, 9 `select`, and 1 `file`. The ten non-empty parameter description notes remain the only parameter descriptions. No `required` field, response schema, endpoint-specific authentication contract, or file MIME/size limit was present. Documentation `default_value` entries remain examples/prefills, not API validation defaults.
- The documentation site's current map surfaced the homepage, the API documentation page, and its documentation UI assets; it did not surface separate endpoint-detail pages for the unresolved records.
- The current [BintangAPI homepage](https://bintangapi.my.id/) says users do not need to register or supply their own API key and describes server-side proxying. These are general service-level statements, not endpoint-specific authentication contracts, confirmed runtime-host evidence, or permission approval. No authentication field was added to endpoint records.
- The current [StarLabs homepage](https://starlabs.biz.id/) rendered a snippet count of **0** and a 404 panel; its linked [/ai page](https://starlabs.biz.id/ai) is an assistant interface, not endpoint-detail documentation or written permission evidence. The catalogue's `starLabsSnippetCount: 159` remains a value recorded in the 2026-11-10 source snapshot; it was not overwritten with a current homepage display or reinterpreted as current availability.
- The Playground's `fetch("./data/endpoints.json")` reads the repository's local static catalogue. It is not an upstream API request. The Gateway registry still checks endpoint ID uniqueness only and does not reject duplicate provider + method + normalized path tuples.

No catalogue record, endpoint ID, route, parameter contract, provenance status, or review policy was changed in this pass. All 35 `review-required` entries remain gated, permission remains pending, and runtime host remains unknown.

## Decision and next evidence required

1. Obtain written provider clarification for whether AI PPT and PPT JOB are intentionally multiplexed on the same `GET /api/aitools/ai-ppt` path or whether one source record has an incorrect route. The public documentation confirms the collision but not its runtime semantics.
2. Obtain provider-supplied descriptions or an updated documentation export for the 33 records whose descriptions are blank in the current embedded source tree.
3. Obtain endpoint-scoped written confirmation of runtime routing and permission before recording any confirmed runtime host or approval. The published documentation base URL and claimed StarLabs attribution are not substitutes for this evidence.
4. Obtain source-backed requiredness, request-body, authentication, response-schema, and upload MIME/size details before extending those contract fields. Keep the ten literal parameter notes as notes only; do not infer validation rules from them.
5. Add a provider + method + normalized provider-path collision guard before any future route registration. This is a separate implementation follow-up, not permission to register either colliding route.

Until those confirmations exist, preserve both AI PPT records, keep all 33 endpoint descriptions empty, retain runtime host as unknown and permission as pending, keep all 35 review-required records gated, and register zero catalogue routes.

## Verification boundary

This is a static repository and public-documentation review. No live upstream API requests, endpoint execution, active probing, fuzzing, tests, or builds were run. No endpoint is claimed live-verified, available, authorized, or approved.

## Follow-up legacy cross-snapshot route check — 2026-11-14

A static comparison of [the active catalogue](../data/endpoints.json) and [the preserved Phase 04 snapshot](../data/legacy-endpoints.json) found **14 exact method + path pairs** represented in both files. The overlaps are historical continuity, not collisions within either catalogue: they are stored in separate snapshots and must not be combined into a runtime registration set.

Overlap counts by legacy category:

- `baca`: 1
- `berita`: 8
- `nonton`: 3
- `scriptblox`: 2

Each file was checked independently:
- Active catalogue: 77 records, 77 unique IDs; its only within-file method + path collision remains the documented AI PPT / PPT JOB pair.
- Legacy catalogue: 74 records, 74 unique IDs, no within-file method + path collision.

No historical record was deleted, merged, renamed, or promoted. The cross-snapshot overlaps do not resolve the AI PPT/PPT JOB ambiguity and do not authorize route registration.

## Correction — legacy path-field normalization — 2026-11-15

A closer static comparison found that the legacy catalogue's `path` field is a historical display string rather than a route-only field for many records: **59 of 74** values include query examples, and **3** include explanatory suffixes (some values have both). The prior **14** cross-snapshot count measured literal full-field method + path equality only; it was not the total route-prefix overlap.

For a route-prefix comparison only, the leading `/api/...` token was extracted up to the first query marker or whitespace annotation, then compared together with the HTTP method. This yields:

- **71** method + route-prefix pairs represented in both snapshots.
- **3** legacy route prefixes not represented in the active snapshot.
- **5** active route prefixes not represented in the legacy snapshot.
- Active catalogue: 77 records but 76 unique method + route-prefix pairs because the AI PPT / PPT JOB collision remains.
- Legacy catalogue: 74 records and 74 unique method + route-prefix pairs, with no within-file collision.

The 14 literal full-field matches remain a valid count of exact stored-string matches, but should not be interpreted as the complete route-level overlap. Route-prefix overlap is a syntactic comparison only; it does not prove semantic equivalence, identical parameter contracts, provider behavior, or permission. The legacy `path` strings remain unchanged to preserve the historical snapshot. No records were deleted, merged, renamed, or registered.


## Follow-up provider-manifest and parameter-prefill source check — 2026-11-17

A fresh recursive repository-tree inspection at the current `main` commit (`3b28b38886108a937fa40a22bfaa10bd88e9e57c`) found only the provider package manifest and these implementation files: `packages/providers/src/index.ts`, `fetch-adapter.ts`, and `mapping.ts`. The tree is complete (not truncated); there is no `examples` directory, concrete `ProviderMappingManifest` object, or checked-in provider mapping instance. `src/index.ts` only re-exports the adapter and mapping modules, while `src/mapping.ts` defines the manifest types and approval guard. The Phase 08 wording has been corrected to distinguish this type/guard foundation from a shipped manifest example.

The public documentation form renderer at [`85444744script.js`](https://bintangapi.my.id/api/assets/85444744script.js) assigns each parameter's `default_value` to the generated HTML input's `value`. This confirms it is a documentation-form prefill. It is not evidence of a server-side API default or a validation rule. The embedded source parameter records do not contain a `required` field; no requiredness has been inferred or added. The active catalogue intentionally continues to preserve only the documented parameter names, UI types, options, placeholders, and ten non-empty parameter-description notes.

A fresh static comparison of the embedded `window.__RAW_TREE` against the active catalogue still matches all 77 records for title, method, normalized route, description, category, and the parameter fields represented in the catalogue. Both source and catalogue contain 33 empty endpoint descriptions. The site map returned the homepage and the API documentation page only; no separate endpoint-detail pages were discovered.

No endpoint records, route semantics, IDs, parameter contracts, provenance values, or review policies were changed. No provider manifest or route was created, and all 35 `review-required` entries remain gated.


## Correction — provider mapping template inventory — 2026-11-18

A fresh inspection of the complete recursive tree at the current `main` commit found `examples/provider-mapping.template.json` (275 bytes). The file was introduced in [`8d14b3b`](https://github.com/Hanzet22/hypergaruda-API/commit/8d14b3bfc03e35a94cf4c9d64b42bad109c7dbc9), which added the Phase 08 provider foundation on 2026-11-09. The earlier 2026-11-17 statement that no `examples` directory or checked-in mapping template existed was incorrect and is superseded by this correction.

The checked-in file is a **generic placeholder template**, not a concrete provider manifest instance. Its `providerId`, `origin`, `allowedHosts`, and `sourceReference` use example placeholders; `permissionStatus` is `pending-confirmation`; and `endpoints` is empty. It does not identify BintangAPI, StarLabs, or any confirmed provider origin, and it supplies no endpoint mapping or permission evidence. The Phase 08 document now describes this distinction accurately.

The implementation in [`packages/providers/src/mapping.ts`](../packages/providers/src/mapping.ts) rejects a manifest unless permission is explicitly `confirmed`, its provider/source/origin/host fields pass validation, endpoint IDs and paths are valid, and at least one endpoint mapping exists. The placeholder template therefore cannot pass the approval guard as checked in. This guard does not itself establish written permission.

No provider origin was configured, no route was registered, and no catalogue record, endpoint ID, route, parameter contract, provenance status, or review policy was changed. All 35 `review-required` entries remain gated and permission remains pending.

## Follow-up static source metadata and documentation UI contract inspection — 2026-11-20

A fresh static fetch of the [BintangAPI API documentation](https://bintangapi.my.id/api/) returned HTTP 200. Its raw HTML still embeds `window.__RAW_TREE`. The embedded tree was parsed as documentation data only; no script was executed and no endpoint URL was requested.

### Current source-to-catalogue reconciliation

- The embedded tree contains **77 endpoint records across 13 categories**. All 77 match the active catalogue by source name/title, category, method, normalized route, endpoint description, and the parameter fields currently represented by the catalogue. No metadata mismatch was found.
- The source still has **33 empty endpoint descriptions**, matching the active catalogue's 33 empty descriptions. The source itself does not supply replacement text.
- The only active method + normalized-path collision remains **AI PPT** and **PPT JOB**, both `GET /api/aitools/ai-ppt`. Both source records also carry the same presentation group label, `ai ppt`. The [documentation UI renderer](https://bintangapi.my.id/api/assets/86124835script.js) uses the source `group` field to arrange records under display headings. Shared display grouping is not evidence that the route is intentionally multiplexed or that either path is correct; written provider clarification is still required.
- The current source records have a `group` field on all 77 records; 23 have a non-empty display group: `ai ppt` (2), `TTS` (1), `WATTPAD` (4), `BERITA` (7), and `OTAKUDESU` (9). The active catalogue does not currently preserve this optional presentation-only grouping field. This is recorded as a display-metadata omission, not an endpoint-contract or route-semantic mismatch; no `sourceGroup` field was added in this pass.
- No `fixed_params` field or other additional endpoint-level contract field was present in the current embedded records. The 76 parameter objects still contain no `required` flag. The 33 blank descriptions remain unresolved.

### Documentation UI request construction and Uguu upload boundary

The public [documentation execution script](https://bintangapi.my.id/api/assets/37238647script.js) contains an `execAPI` function that constructs a request from the selected documentation record. In that UI code, parameters typed `file` or `image` are appended to a `FormData` object; when the selected method is `POST` and form data is present, that object is assigned as the fetch request body. The public homepage also describes an Execute control for testing from the documentation page ([BintangAPI homepage](https://bintangapi.my.id/)).

This is evidence of **the documentation UI's request-construction behavior only**. It does not establish server-side requiredness, accepted MIME types, file-size limits, validation behavior, response schema, or whether the Uguu route currently accepts the request. The script was read as static text; `execAPI` was not invoked. No request was sent.

The active Uguu record remains `POST /api/uploader/uguu` with the documented `file` parameter and remains `review-required`. The HyperGaruda Gateway still cannot represent this request body: `GatewayRequest.params` and `ProviderCall.params` accept primitive values only, and `FetchProviderAdapter` appends those values to the URL query. No upload contract or adapter change is made.

### Additional source and repository search

- The current documentation site's map still exposes only the homepage and the API documentation page; no separate endpoint-detail pages were located.
- Targeted public searches did not locate BintangAPI- or StarLabs-authored detail documentation resolving the AI PPT/PPT JOB route or supplying the 33 missing descriptions. Unrelated PPT API documentation from other providers was excluded because no source relationship to BintangAPI or StarLabs was established.
- GitHub issue and pull-request searches for the repository returned no clarification. The statement that `30ac7f4dc7f517bdca9df7842f9704dab9bb5c24` remains the current `main` HEAD is stale: the 2026-11-20 audit follow-up was committed as [`957d9d6fe46d03c5779e5fb58e93fff65b86cfe5`](https://github.com/Hanzet22/hypergaruda-API/commit/957d9d6fe46d03c5779e5fb58e93fff65b86cfe5), which was the latest `main` commit found immediately before the 2026-11-21 pass. The repository's recorded import history still contains the same duplicate route and blank descriptions.

### Status retained

No endpoint ID, method, path, description, parameter contract, provenance value, or review policy was changed. The shared provenance reference still distinguishes BintangAPI documentation, StarLabs as claimed attribution by BintangAPI, the published documentation base URL, unknown confirmed runtime host, and pending permission with no recorded endpoint-specific approval. All 35 `review-required` records remain gated; all 77 records remain `documented-not-live-verified`; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API requests, endpoint execution, active probing, fuzzing, tests, or builds were run.


## Follow-up current-source and UI required-marker review — 2026-11-21

The current `main` branch was reread from GitHub, including the README, active and legacy catalogues, this audit, Phase 06–08 notes, Playground code, Gateway registry/validation/types/runtime, provider mapping/adapter, and the placeholder mapping template. The latest commit found on `main` at the start of this pass was [`957d9d6fe46d03c5779e5fb58e93fff65b86cfe5`](https://github.com/Hanzet22/hypergaruda-API/commit/957d9d6fe46d03c5779e5fb58e93fff65b86cfe5).

A fresh static fetch of the [BintangAPI API documentation](https://bintangapi.my.id/api/) returned its raw HTML, including the embedded `window.__RAW_TREE`. The JSON tree was parsed as documentation data only; no JavaScript was executed and no endpoint URL was requested.

### Reconciliation and route inventory

- The source tree and active catalogue each contain **77 records across 13 categories**. Matching by source name/title, method, normalized `/api/` route, endpoint description, and the catalogue's parameter fields produced **77/77 matches with no metadata mismatch**.
- Both source and catalogue contain **33 empty endpoint descriptions**; the affected title lists match. No replacement description was supplied by the source.
- The source tree and active catalogue each contain the same single method + normalized-path collision: **AI PPT** and **PPT JOB**, both `GET /api/aitools/ai-ppt`. The legacy catalogue has no within-file method + normalized-path collision. No additional active collision was found.
- The source parameter objects still expose no `required` property or `fixed_params` entries. The existing 76-parameter distribution and the 35 `review-required` policies remain unchanged.

### Documentation form's visual required marker

The public [parameter form renderer](https://bintangapi.my.id/api/assets/85444744script.js) displays a visual asterisk (`*`) beside each rendered parameter. Static inspection of that renderer found no `required` attribute on its generated text, select, or file controls and no `required` token in the asset. The embedded source parameter objects likewise have no `required` field.

The asterisk is therefore recorded only as a documentation UI presentation marker. It is not sufficient evidence of an API requiredness contract or server-side validation. Requiredness remains **unknown** and no `required` field or validation rule was added to the catalogue or Gateway.

### Additional public-source search

A current site map returned the BintangAPI homepage, the single API documentation page, and its documentation UI assets; it did not reveal separate endpoint-detail pages. Targeted searches for the AI PPT/PPT JOB distinction and selected non-sensitive blank-description records did not locate BintangAPI- or StarLabs-authored detail documentation. No unrelated provider documentation was used as a substitute.

### Status retained

No endpoint ID, method, path, description, parameter contract, provenance value, or review policy was changed. The existing shared provenance reference continues to distinguish BintangAPI as documentation source, StarLabs as claimed attribution by BintangAPI, the published documentation base URL, unknown confirmed runtime host, and pending permission with no recorded endpoint-specific approval. All 35 `review-required` records remain gated; all 77 records remain `documented-not-live-verified`; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API request, endpoint execution, active probing, fuzzing, tests, or builds were run.

## Follow-up current public UI contract boundary — 2026-11-23

The latest `main` HEAD at the start of this pass was [`e116f02e6df677fe272d0f680e904649119e1b4e`](https://github.com/Hanzet22/hypergaruda-API/commit/e116f02e6df677fe272d0f680e904649119e1b4e). The README, active and legacy catalogues, this audit, Phase 06–08 notes, Playground code, Gateway registry/validation/types/runtime, provider mapping/adapter, and placeholder mapping template were reread from `main`.

A fresh static fetch of the [BintangAPI API documentation](https://bintangapi.my.id/api/) returned HTTP 200 on 2026-11-23. The embedded `window.__RAW_TREE` was parsed as documentation data only. The source tree contains 77 records across 13 categories. A field-level comparison against the active catalogue matched **77/77** records by title, mapped category, method, normalized route, endpoint description, and the parameter fields represented locally (`name`, `type`, `options`, `placeholder`, and `description`). The source and catalogue still contain the same **33 empty endpoint descriptions** and the same **AI PPT / PPT JOB** collision at `GET /api/aitools/ai-ppt`. No source/catalogue mismatch was found.

### Current documentation UI asset review

The following public assets were fetched as static text; no JavaScript was executed:

- [Category renderer](https://bintangapi.my.id/api/assets/86124835script.js) uses the source `group` value to place records under visual subheadings. This remains display metadata, not route or endpoint semantics.
- [Snippet generator](https://bintangapi.my.id/api/assets/94407567script.js) uses `default_value` and placeholders to prefill example URLs and generated snippets. This remains documentation-example behavior, not a server-side API default.
- [Parameter form renderer](https://bintangapi.my.id/api/assets/85444744script.js) displays a visual asterisk. Its generated text, select, and file controls do not carry an HTML `required` attribute. The generic file control has no `accept` restriction and displays the UI label `Pilih file (semua format)`; that label and client-side input configuration do not establish which file types the server accepts.
- [Documentation execution script](https://bintangapi.my.id/api/assets/37238647script.js) contains an `execAPI` function that would construct a request and invoke `fetch` when a user activates Execute. It was read only and was not invoked. Its use of `FormData` for file/image parameters on POST describes the documentation UI's request construction, not a verified server upload contract.

For Uguu, the only supported catalogue facts remain the documented `POST` route and the `file` parameter. Server acceptance, requiredness, MIME types, file-size limits, response schema, and storage behavior remain unknown. The endpoint stays `review-required`; no upload contract or Gateway adapter change is justified.

### Additional source and history search

The current site map returned the BintangAPI homepage, API documentation page, and documentation UI assets; it did not reveal separate endpoint-detail pages. Targeted searches restricted to BintangAPI and StarLabs for the AI PPT/PPT JOB distinction and selected blank-description records returned no public web results. Repository issue and pull-request searches returned no clarification. The repository commit listing still identifies this pass's starting HEAD as the latest commit; the original catalogue import and later audit history do not resolve the route semantics or the blank descriptions.

### Status retained

No catalogue fields, endpoint IDs, route semantics, parameter contracts, provenance values, or review policies were changed. The shared provenance block continues to distinguish BintangAPI documentation, StarLabs as claimed attribution by BintangAPI, the published documentation base URL, unknown confirmed runtime host, and pending permission with no recorded endpoint-specific approval. All 35 `review-required` entries remain gated; all 77 records remain `documented-not-live-verified`; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API requests, endpoint execution, active probing, fuzzing, tests, or builds were run.



## Follow-up current page bootstrap and legacy route normalization — 2026-11-24

The latest `main` HEAD at the start of this pass was [`f2387346ee78c6c1f29f2124e2f008af9d8057c1`](https://github.com/Hanzet22/hypergaruda-API/commit/f2387346ee78c6c1f29f2124e2f008af9d8057c1). The README, active and legacy catalogues, this audit, Phase 06–08 notes, Playground code, Gateway registry/validation/types/runtime, provider mapping/adapter, and placeholder mapping template were reread from `main`.

A fresh static fetch of the [BintangAPI API documentation](https://bintangapi.my.id/api/) returned HTTP 200 on 2026-11-24. Its embedded `window.__RAW_TREE` was parsed as data only. The current tree contains 77 endpoint records across 13 category folders. A compound comparison using title, method, normalized route, mapped category, endpoint description, and the locally represented parameter fields (`name`, `type`, `options`, `placeholder`, and `description`) matched **77/77** active records with no mismatch. The source still has **33 empty endpoint descriptions** and the same single **AI PPT / PPT JOB** collision at `GET /api/aitools/ai-ppt`. No endpoint-level detail page or provider clarification was found.

### Additional documentation bootstrap asset

The current documentation HTML references five external JavaScript assets. The four contract/UI assets reviewed in the previous follow-up remain present. The additional [`09027848script.js`](https://bintangapi.my.id/api/assets/09027848script.js) was fetched and read as static text only. It reads the embedded `window.__RAW_TREE`, normalizes the tree for rendering, and declares the documentation UI base constant `https://bintangapi.my.id/api`. The asset contains no `fetch` call, `FormData`, or `required` marker. This is evidence about documentation-page rendering only; the UI base constant does not independently confirm a runtime host for any endpoint. No script was executed.

### Historical route comparison

The preserved [74-record legacy catalogue](../data/legacy-endpoints.json) has 74 unique IDs and no duplicate method + normalized-path tuple. However, **60 of its 74 `path` strings include query examples and/or parenthetical annotations** (for example, a multipart-form note). For comparison only, extracting the leading `/api/...` route before the query or annotation yields 74 unique legacy method/path tuples.

Compared with the active catalogue's 76 unique method/path tuples (77 records, with the one already documented collision), the normalized route sets have:

- **71 shared** method/path tuples.
- **5 active-only** tuples: `GET /api/aiimg/grok`, `GET /api/aitools/ai-ppt`, `GET /api/tools/animetts`, `GET /api/tools/tts`, and `GET /api/tools/ytsummary`.
- **3 legacy-only** tuples: `GET /api/aiimg/flux`, `GET /api/aitools/tts/qwentts`, and `GET /api/stalker/tiktok`.

This normalization is solely for historical route-set comparison. The legacy path strings are preserved verbatim and were not rewritten or promoted into active route contracts. The only active method + normalized-path collision remains AI PPT/PPT JOB; no additional collision was found.

### History and status

The current active catalogue's 77 endpoint ID/title/method/path tuples are unchanged relative to the original 77-record import at [commit `b1f314705ac5f2f2eb0591356561bce1e5c89b70`](https://github.com/Hanzet22/hypergaruda-API/commit/b1f314705ac5f2f2eb0591356561bce1e5c89b70). Repository history still does not resolve the AI PPT/PPT JOB semantics or supply descriptions for the 33 blank records.

No catalogue values, endpoint IDs, historical path strings, route semantics, parameter contracts, provenance values, or review policies were changed. The existing shared provenance reference continues to distinguish BintangAPI as documentation source, StarLabs as claimed attribution by BintangAPI, the published documentation base URL, unknown confirmed runtime host, and pending permission with no recorded endpoint-specific approval. All 35 `review-required` entries remain gated; all 77 active records remain `documented-not-live-verified`; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API requests, endpoint execution, active probing, fuzzing, tests, or builds were run.


## Follow-up current documentation claim boundary and registry collision review — 2026-11-25

The latest `main` HEAD at the start of this pass was [`8568547709c77b588e8568876f741710a89f6d40`](https://github.com/Hanzet22/hypergaruda-API/commit/8568547709c77b588e8568876f741710a89f6d40). The README, active and legacy catalogues, this audit, Phase 06–08 notes, Playground code, Gateway registry/validation/types/runtime, provider mapping/adapter, and placeholder mapping template were reread from `main`.

### Current repository consistency

The active catalogue currently contains 77 records across 13 categories. Static structural checks found:

- 77 unique endpoint IDs and category counts matching the records.
- 33 records with an explicitly present but empty `description`; no description property is absent.
- 76 parameters: 66 `string`, 9 `select`, and 1 `file`; no duplicate parameter names within an endpoint and no additional parameter types.
- 42 `preview-only` and 35 `review-required` records. Every review-required record has a non-empty review reason.
- All 77 records use `source: bintangapi-docs`, have source URL, documentation-only verification status, and point to the shared `#/sourceSnapshot/provenance` object.
- All 77 remain `documented-not-live-verified`. No active route path contains a query string or parenthetical annotation.
- The only active method + normalized-path collision remains AI PPT and PPT JOB at `GET /api/aitools/ai-ppt`.

The legacy inventory still contains 74 unique IDs and no within-file method + normalized-path collision. Its 60 annotated path strings remain historical text. The 71 shared, 5 active-only, and 3 legacy-only normalized method/path counts recorded in the 2026-11-24 review remain unchanged. No historical path was rewritten.

### Current public-page claims and evidence boundary

The current [BintangAPI homepage](https://bintangapi.my.id/) describes BintangAPI as a REST wrapper around scraper code used internally at StarLabs, says requests are proxied server-side, and states that documentation includes an Execute control. The linked [BintangAPI documentation page](https://bintangapi.my.id/api/) currently displays an `OPERATIONAL` page-level label, describes its collection as scraper and script material from StarLabs, and publishes `https://bintangapi.my.id/api` as its base URL.

These are BintangAPI's service-level and page-level statements. They do not independently establish an endpoint-specific runtime host, live health, authentication contract, or written permission. The `OPERATIONAL` label is not treated as a live check of each documented route. The published documentation/API base URL is not copied into `confirmedRuntimeHost`.

The browser-readable documentation extract currently exposes only the page introduction and base URL, not the embedded endpoint tree. Searches for the exact AI PPT/PPT JOB names and selected blank-description titles did not expose endpoint-detail text. Therefore this pass does **not** claim a fresh 2026-11-25 77/77 raw-tree comparison; the last complete field-level raw-tree comparison remains the one recorded in the 2026-11-24 follow-up. A separately indexed PPT.AI documentation site was excluded: its published `/api/ppt/...` paths and lack of an evidenced BintangAPI/StarLabs relationship do not resolve HyperGaruda's `/api/aitools/ai-ppt` records.

### Gateway route-collision guard

The current [ProviderRegistry implementation](https://github.com/Hanzet22/hypergaruda-API/blob/main/packages/gateway/src/registry.ts#L12-L26) rejects duplicate adapter IDs, duplicate `endpointId` values, and routes that reference a missing adapter. It does not currently reject duplicate `providerId + method + providerPath` tuples across different endpoint IDs.

This is a potential integration-time collision guard gap, not evidence of an active runtime collision: Phase 07 still documents zero configured adapters and zero routes. No registry change is made while provider routes remain unapproved and the AI PPT/PPT JOB route semantics remain unresolved. Before any future route registration, the project needs an explicit policy for same-provider, same-method, same-path mappings, including whether a documented multiplexer is permitted.

### Provenance and approval status retained

The active catalogue's shared provenance object continues to distinguish:
- documentation source: BintangAPI public API documentation;
- claimed upstream attribution: StarLabs, as stated by BintangAPI;
- published API/documentation base URL: `https://bintangapi.my.id/api`, documented but not live-verified;
- confirmed runtime host: `null`, status `unknown`;
- permission: `pending-confirmation`, evidence `not-recorded`;
- endpoint-specific evidence: `not-recorded`.

All 77 endpoint records reference this shared snapshot-level object; this is not 77 independent runtime-host or permission confirmations. No endpoint-specific values were inferred or added.

### Status retained

No endpoint ID, method, path, description, parameter contract, provenance value, historical record, or review policy was changed. All 35 `review-required` records remain gated; all 77 records remain `documented-not-live-verified`; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API requests, documentation Execute actions, endpoint execution, active probing, fuzzing, tests, or builds were run.


## Follow-up current raw-tree reconciliation — 2026-11-26

The latest `main` HEAD at the start of this pass was [`d8fbd5bd289a6f3186bec56a15f3f4e5fd298cbf`](https://github.com/Hanzet22/hypergaruda-API/commit/d8fbd5bd289a6f3186bec56a15f3f4e5fd298cbf). The README, active and legacy catalogues, this audit, Phase 06–08 notes, Playground code, Gateway Registry/validation/types/runtime, provider mapping/adapter, and placeholder mapping template were reread from `main`.

### Fresh public source extraction

A fresh static HTTP fetch of the [BintangAPI documentation page](https://bintangapi.my.id/api/) returned status 200 on 2026-11-26. The page's embedded `window.__RAW_TREE` was parsed as JSON data only; no page JavaScript was executed and no API endpoint was called. The current tree contains **77 file records across 13 category folders**. The page metadata identifies `StarLabs` as its author, and the page text describes the collection as scraper and script material from StarLabs. The [BintangAPI homepage](https://bintangapi.my.id/) separately claims that BintangAPI wraps scraping code used internally at StarLabs and proxies requests server-side. These are publisher claims/metadata, not independent runtime-host or permission evidence.

### Full catalogue comparison

The current source tree was compared against [`data/endpoints.json`](../data/endpoints.json). All **77/77** records matched by title, HTTP method, route path, endpoint description, and category-folder mapping. All represented parameter fields also matched: parameter count, name, type, options, placeholder, and parameter description. No mismatch was found.

The source and active catalogue contain **33 empty endpoint descriptions**, not 32. All 33 descriptions are explicitly empty in the current public source tree; the original 77-record import at [commit `b1f314705ac5f2f2eb0591356561bce1e5c89b70`](https://github.com/Hanzet22/hypergaruda-API/commit/b1f314705ac5f2f2eb0591356561bce1e5c89b70) already contains the same 33 empty values. Repository history therefore does not recover them. No descriptions were inferred or added.

The exact affected local records are:

- `ai-chat-qwen3-coder-08` — QWEN3-CODER: `GET /api/aichat/qwen-coder`
- `info-google-news-30` — GOOGLE NEWS: `GET /api/info/berita/google`
- `info-kompas-news-31` — KOMPAS NEWS: `GET /api/info/berita/kompas`
- `info-liputan6-32` — LIPUTAN6: `GET /api/info/berita/liputan6`
- `info-sindo-news-33` — SINDO NEWS: `GET /api/info/berita/sindo`
- `maker-brat-34` — BRAT: `GET /api/maker/brat`
- `maker-brat-video-35` — BRAT VIDEO: `GET /api/maker/bratvid`
- `nonton-otakudesu-completed-36` — OTAKUDESU COMPLETED: `GET /api/nonton/otakudesu/completed`
- `nonton-otakudesu-detail-37` — OTAKUDESU DETAIL: `GET /api/nonton/otakudesu/detail`
- `nonton-otakudesu-genre-38` — OTAKUDESU GENRE: `GET /api/nonton/otakudesu/genre`
- `nonton-otakudesu-genre-list-39` — OTAKUDESU GENRE LIST: `GET /api/nonton/otakudesu/genre-list`
- `nonton-otakudesu-home-40` — OTAKUDESU HOME: `GET /api/nonton/otakudesu/home`
- `nonton-otakudesu-ongoing-41` — OTAKUDESU ONGOING: `GET /api/nonton/otakudesu/ongoing`
- `nonton-otakudesu-schedule-42` — OTAKUDESU SCHEDULE: `GET /api/nonton/otakudesu/schedule`
- `nonton-otakudesu-search-43` — OTAKUDESU SEARCH: `GET /api/nonton/otakudesu/search`
- `nonton-otakudesu-stream-download-44` — OTAKUDESU STREAM + DOWNLOAD: `GET /api/nonton/otakudesu/stream`
- `scriptblox-scriptblox-home-45` — SCRIPTBLOX HOME: `GET /api/scriptblox/bloxhome`
- `scriptblox-scriptblox-search-46` — SCRIPTBLOX SEARCH: `GET /api/scriptblox/bloxsearch`
- `scriptblox-scriptblox-trending-47` — SCRIPTBLOX TRENDING: `GET /api/scriptblox/bloxtrend`
- `search-ff-hero-50` — FF HERO: `GET /api/search/ff-hero`
- `search-stikerly-search-53` — STIKERLY SEARCH: `GET /api/search/stikerly`
- `stalker-channel-wa-view-56` — CHANNEL WA VIEW: `GET /api/stalker/channelwa`
- `stalker-chess-com-user-stalker-57` — CHESS.COM USER STALKER: `GET /api/stalker/chess`
- `stalker-free-fire-stalker-58` — FREE FIRE STALKER: `GET /api/stalker/ff`
- `stalker-instagram-stalker-60` — INSTAGRAM STALKER: `GET /api/stalker/instagram`
- `stalker-lahelu-stalker-61` — LAHELU STALKER: `GET /api/stalker/lahelu`
- `stalker-minecraft-user-stalk-62` — MINECRAFT USER STALK: `GET /api/stalker/minecraft`
- `stalker-ml-check-63` — ML CHECK: `GET /api/stalker/ml`
- `stalker-npm-stalk-64` — NPM STALK: `GET /api/stalker/npm`
- `stalker-pinterest-user-stalker-65` — PINTEREST USER STALKER: `GET /api/stalker/pinterest`
- `stalker-soundcloud-user-stalker-67` — SOUNDCLOUD USER STALKER: `GET /api/stalker/soundcloud`
- `stalker-telegram-stalk-68` — TELEGRAM STALK: `GET /api/stalker/telegram`
- `stalker-youtube-channel-stalker-70` — YOUTUBE CHANNEL STALKER: `GET /api/stalker/youtube`

### AI PPT / PPT JOB source records

The current public tree confirms two distinct source records in the `AI tools` folder, both assigned the display group `ai ppt`:

| Source record ID | Title | Method + path | Parameter |
|---|---|---|---|
| `-P52B3udPIwq2udquL3L` | AI PPT | `GET /api/aitools/ai-ppt` | `prompt` |
| `-P52BW4mIavsE5RTAUqM` | PPT JOB | `GET /api/aitools/ai-ppt` | `job` |

The source describes AI PPT as generating presentation structure from a prompt. PPT JOB is described as checking the status of a presentation-generation request. Both source records nevertheless publish the same method and path. The shared `group` is display grouping, not proof of route semantics. The descriptions suggest different operations but do not establish whether the source intentionally multiplexes them or contains a documentation error. Targeted public searches and repository issue/PR/commit searches found no independent clarification. A separate PPT.AI documentation site was excluded because it belongs to a different service and documents different paths.

The collision is confirmed as a documentation/catalogue collision; its intended server semantics remain unknown. Both local endpoint IDs and all route/parameter fields are preserved. No merge, rename, deletion, or route change is justified.

### Parameter contract boundary

The current source tree contains **76 parameters**: 66 `string`, 9 `select`, and 1 `file`. It has 10 non-empty parameter descriptions, 9 option lists, 4 non-empty placeholders, and 67 non-empty `default_value` entries. The active catalogue matches the source for all represented parameter fields.

The source's `default_value` is used by the documentation UI to prefill examples/snippets; it is not evidence of a server-side default. It is not promoted into the API contract. The source does not declare required/optional status or response schemas. Authentication, upload acceptance, MIME restrictions, file limits, and provider-specific response behavior remain unknown unless separately documented. No parameter contract was expanded.

### Provenance and permission boundary

The catalogue still distinguishes the following dimensions through its shared `sourceSnapshot.provenance` object:

- Documentation source: BintangAPI public API documentation.
- Documentation-page author metadata: StarLabs.
- Claimed upstream attribution: StarLabs, as stated by BintangAPI.
- Published API/documentation base URL: `https://bintangapi.my.id/api`, documented but not live-verified.
- Confirmed runtime host: `null`, status `unknown`.
- Permission: `pending-confirmation`; permission evidence `not-recorded`.
- Endpoint-specific runtime/permission evidence: `not-recorded`.

All 77 endpoint records reference this shared snapshot-level object. It is not 77 independent confirmations. No endpoint-specific runtime host, permission, availability, or authentication claim was inferred.

### Additional consistency and route review

- Active catalogue: 77 unique IDs, 13 categories, category counts consistent, 42 `preview-only`, 35 `review-required`; every review-required record retains its reason.
- Active method + normalized-path tuples: 76 unique tuples for 77 records; the only duplicate tuple is `GET /api/aitools/ai-ppt`.
- Legacy catalogue: 74 records and 74 unique IDs; no duplicate method + normalized-path tuple. Its annotated historical path strings remain untouched.
- Active/legacy normalized route-set comparison: 71 shared, 5 active-only, and 3 legacy-only tuples. This comparison does not promote legacy-only routes.
- Gateway Registry still rejects duplicate adapter IDs, duplicate endpoint IDs, and missing adapters, but does not guard duplicate `providerId + method + providerPath` tuples. This remains a future integration guard gap, not an active runtime collision: Phase 07 documents zero registered routes and zero configured provider adapters. No code change is made while permission and route semantics remain unresolved.

### Status retained

No endpoint ID, title, method, path, description, parameter, provenance value, historical record, or review policy was changed. All 35 `review-required` records remain gated; all 77 active records remain `documented-not-live-verified`; permission remains pending; zero provider routes are registered.

This pass was static repository and public-documentation research only. No live upstream API requests, documentation Execute actions, endpoint execution, active probing, fuzzing, tests, or builds were run.
