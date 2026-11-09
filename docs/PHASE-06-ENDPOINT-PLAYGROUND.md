# Phase 06 — Endpoint Expansion & API Playground

Status: implemented as a documentation catalogue and local-only request simulation. No upstream requests are executed.

## Source snapshot
- BintangAPI homepage: https://bintangapi.my.id/
- BintangAPI API documentation: https://bintangapi.my.id/api
- StarLabs Code Snippet Library: https://starlabs.biz.id/
- Snapshot date: 2026-11-10.
- BintangAPI's embedded documentation tree exposes 77 endpoint records across 13 categories, including route paths, HTTP methods, descriptions and parameter metadata.
- The public StarLabs library displayed 159 code snippets. Snippets are not API endpoint records and were not copied.
- BintangAPI describes itself as a REST API wrapper around scraper/script collections from StarLabs.
- The former 74-record Phase 04 inventory is preserved in data/legacy-endpoints.json.

## Catalogue
The active data/endpoints.json follows the 77 documented BintangAPI records. Each record includes:
- stable local ID, category, title, HTTP method and exact route path;
- description and parameter names/types/options where supplied by the docs;
- source URL and documentation-only verification status;
- a Playground policy and review reason for restricted routes.

The source does not consistently declare required/optional status. Requiredness is not inferred. The catalogue does not invent response schemas. A documented route is not a live health check.

## Playground
- playground.html provides endpoint selection, parameter entry, route preview, local simulation response and cURL/Node.js examples.
- assets/playground.js builds request previews locally from the static catalogue.
- Preview output explicitly marks simulation mode and networkRequestSent=false.
- No request is sent to BintangAPI, StarLabs or any other upstream host.
- Live execution remains disabled until a gateway exists with runtime validation, provider allowlists, timeouts, payload limits, outbound controls and Phase 05 rate-limit integration.
- The interface does not accept an arbitrary destination host.

## Restricted routes
Profile lookup, media retrieval, script discovery, link-bypass, selected AI-labelled routes, third-party app discovery and file upload are marked review-required. They remain visible in the documentation catalogue for provenance, but request simulation and code snippet generation are disabled for them. This is a conservative local review gate, not a claim that the upstream provider has declared these routes unsafe.

## Attribution and permissions
- Public route metadata is attributed to BintangAPI and StarLabs with source links.
- No upstream scraper source code, scripts, credentials, assets or implementation logic were copied.
- The user previously stated that a permission request had been sent to the upstream developer. Approval is not assumed; permission status remains pending confirmation.
- HyperGaruda-API is an independent catalogue/playground project and does not claim to be an official StarLabs or BintangAPI product.

## Not included
- No live API gateway or provider adapter.
- No authentication, API-key issuance, production quotas, Redis connection or deployment.
- No upstream endpoint health checks.
- No source-code redistribution.
- No tests were run for this phase, per the project's no-test implementation preference. GitHub commit/readback is the repository confirmation.
