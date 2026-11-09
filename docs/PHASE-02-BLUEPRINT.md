# Phase 02 — Endpoint Reconciliation & Architecture Blueprint

**Project:** HyperGaruda API Dashboard  
**Repository:** `Hanzet22/hypergaruda-API`  
**Branch baseline:** `main`  
**Baseline commit:** `465ec84e5f8e9ef74b486c7ee821dc1695d088d9`  
**Prepared:** 2026-11-09  
**Phase status:** Design and documentation only

## 1. Scope and evidence

Phase 02 records the current dashboard inventory and proposes a target architecture. It does not implement application code, change endpoint behavior, deploy services, or assert that an upstream endpoint is healthy.

Evidence reviewed:
- Repository README and the 13 category HTML pages in `main`.
- The public BintangAPI landing page and its linked documentation entry point.
- Static endpoint cards and route strings embedded in the repository.

The public BintangAPI landing page describes BintangAPI as a REST API hub based on scraping code used by StarLabs, with a live documentation interface. The documentation page is dynamically rendered and the available text extraction did not expose a complete machine-readable endpoint catalogue. Therefore, this phase does **not** claim a full route-by-route match against the provider's live documentation.

Sources:
- https://bintangapi.my.id/
- https://bintangapi.my.id/api/

### Evidence labels

| Label | Meaning |
|---|---|
| `listed-in-dashboard` | Route/card was found in the repository HTML |
| `documented-upstream` | Matching route was independently visible in provider documentation |
| `health-unverified` | No live request was made; availability is unknown |
| `permission-unverified` | Scope of permission for reuse/redistribution is not independently verified |
| `restricted-review` | Must not be re-enabled or migrated until safety, privacy, and permission review is complete |

A route being listed in HTML is not proof that it exists upstream, works, is supported, or is licensed for redistribution.

## 2. Repository inventory and reconciliation

The repository is a static HTML/CSS/JavaScript dashboard. The reviewed root contains 14 HTML pages plus README and LICENSE. The reviewed repository has no application package manifest, lockfile, backend source tree, database configuration, automated test suite, CI workflow, or Vercel deployment configuration.

### 2.1 Dashboard card counts

| Category page | Cards found in HTML | README count | Reconciled count |
|---|---:|---:|---:|
| AI Chat | 9 | 9 | 9 |
| AI Image | 3 | 3 | 3 |
| AI Tools | 5 | 5 | 5 |
| Baca | 4 | 4 | 4 |
| Berita | 8 | 9 | 8 |
| Brat Maker | 2 | 2 | 2 |
| Downloader | 3 | 3 | 3 |
| Nonton | 9 | 9 | 9 |
| ScriptBlox | 3 | 3 | 3 |
| Search | 8 | 8 | 8 |
| Stalker | 16 | 16 | 16 |
| Tools | 3 | 3 | 3 |
| Uploader | 1 | 1 | 1 |
| **Total** | **74** | **75 by category sum** | **74** |

The README headline says 74, while its category rows add up to 75 because Berita is overstated by one. The HTML source contains eight Berita cards. This blueprint treats 74 as the **number of visible dashboard cards**, not as 74 verified or live services.

A previous provider documentation snapshot reported 77 endpoints. That is a separate snapshot and is not evidence of current availability. A reliable reconciliation requires an export or complete route listing from the provider's current documentation.

### 2.2 Endpoint inventory

All entries below are discovered in the repository HTML unless otherwise stated. Query names shown are the visible UI's route templates, not a guarantee of upstream validation or exact parameter requirements.

| Page | Card / route template | Visible method | Evidence / disposition |
|---|---|---|---|
| AI Chat | AI Prompt — `/api/aichat/aiprompt?prompt=…&text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | AI Research — `/api/aichat/research?q=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | CoPilot — `/api/aichat/copilot?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | DeepSeek V3 — `/api/aichat/deep-v3?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | DeepSeek V4 Flash — `/api/aichat/deep-v4?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | GITA AI — `/api/aichat/gita?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | Llama Scout 4 — `/api/aichat/llama-4?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | Qwen3 Coder — `/api/aichat/qwen-coder?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Chat | One legacy chatbot card | GET | restricted-review; omitted from route-level migration pending safety and provider review |
| AI Image | AIFlux — `/api/aiimg/flux?prompt=…` | GET | listed-in-dashboard; health-unverified |
| AI Image | WhiteCream AI — `/api/aiimg/writecream?prompt=…` | GET | listed-in-dashboard; health-unverified |
| AI Image | ZImage — `/api/aiimg/zimage?prompt=…` | GET | listed-in-dashboard; health-unverified |
| AI Tools | Generator Prompt — `/api/aitools/gen-prompt?q=…` | GET | listed-in-dashboard; health-unverified |
| AI Tools | Humanizer AI — `/api/aitools/humanizer?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Tools | Rewrite AI — `/api/aitools/rewrite?text=…` | GET | listed-in-dashboard; mode unresolved |
| AI Tools | Google TTS — `/api/aitools/tts/googletts?text=…` | GET | listed-in-dashboard; health-unverified |
| AI Tools | QwenTTS — `/api/aitools/tts/qwentts?text=…` | GET | listed-in-dashboard; voice parameter unresolved |
| Baca | WattPad BACA — `/api/baca/wattpad-baca?url=…` | GET | listed-in-dashboard; health-unverified |
| Baca | WattPad DETAIL — `/api/baca/wattpad-det?url=…` | GET | listed-in-dashboard; health-unverified |
| Baca | WattPad HOME — `/api/baca/wattpad-home` | GET | listed-in-dashboard; health-unverified |
| Baca | WattPad SEARCH — `/api/baca/wattpad-searc?q=…` | GET | listed-in-dashboard; health-unverified |
| Berita | AntaraNews — `/api/info/berita/antara` | GET | listed-in-dashboard; health-unverified |
| Berita | CNBCIndonesia — `/api/info/berita/cnbc` | GET | listed-in-dashboard; health-unverified |
| Berita | CNN — `/api/info/berita/cnn` | GET | listed-in-dashboard; health-unverified |
| Berita | GoogleNews — `/api/info/berita/google` | GET | listed-in-dashboard; health-unverified |
| Berita | KompasTV — `/api/info/berita/kompas` | GET | listed-in-dashboard; health-unverified |
| Berita | Liputan6 — `/api/info/berita/liputan6` | GET | listed-in-dashboard; health-unverified |
| Berita | SindoNews — `/api/info/berita/sindo` | GET | listed-in-dashboard; health-unverified |
| Berita | Grow A Garden Stock — `/api/info/gagstock` | GET | listed-in-dashboard; health-unverified |
| Brat Maker | Brat image — `/api/maker/brat?text=…` | GET | listed-in-dashboard; health-unverified |
| Brat Maker | Brat video — `/api/maker/bratvid?text=…` | GET | listed-in-dashboard; health-unverified |
| Downloader | CapCut — `/api/downloader/capcut?url=…` | GET | listed-in-dashboard; rights and provider policy review required |
| Downloader | Spotify — `/api/downloader/spotify?url=…` | GET | listed-in-dashboard; rights and provider policy review required |
| Downloader | TikTok — `/api/downloader/tiktok?url=…` | GET | listed-in-dashboard; rights and provider policy review required |
| Nonton | Completed — `/api/nonton/otakudesu/completed?page=…` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Detail — `/api/nonton/otakudesu/detail?id=…` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Genre — `/api/nonton/otakudesu/genre?gen=…` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Genre List — `/api/nonton/otakudesu/genre-list` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Home — `/api/nonton/otakudesu/home` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Ongoing — `/api/nonton/otakudesu/ongoing?page=…` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Schedule — `/api/nonton/otakudesu/schedule` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Search — `/api/nonton/otakudesu/search?q=…` | GET | listed-in-dashboard; source/content rights review required |
| Nonton | Stream — `/api/nonton/otakudesu/stream?id=…` | GET | restricted pending explicit content-rights review |
| ScriptBlox | Home — `/api/scriptblox/bloxhome` | GET | listed-in-dashboard; health-unverified |
| ScriptBlox | Search — `/api/scriptblox/bloxsearch?q=…` | GET | listed-in-dashboard; health-unverified |
| ScriptBlox | Trending — `/api/scriptblox/bloxtrend` | GET | listed-in-dashboard; health-unverified |
| Search | AN1 — `/api/search/an1?q=…&page=…` | GET | listed-in-dashboard; health-unverified |
| Search | Brainly — `/api/search/brainly?q=…&limit=…` | GET | listed-in-dashboard; health-unverified |
| Search | Freefire Hero — `/api/search/ff-hero?text=…` | GET | listed-in-dashboard; health-unverified |
| Search | Pinterest — `/api/search/pinterest?q=…` | GET | listed-in-dashboard; health-unverified |
| Search | Reuters — `/api/search/reuters?q=…` | GET | listed-in-dashboard; health-unverified |
| Search | StickerLY — `/api/search/stikerly?q=…` | GET | listed-in-dashboard; health-unverified |
| Search | Wikipedia — `/api/search/wikipedia?q=…` | GET | listed-in-dashboard; health-unverified |
| Search | Zodiak — `/api/search/zodiak-check?q=…` | GET | listed-in-dashboard; health-unverified |
| Stalker | 16 social/profile lookup cards | mixed / not consistently labelled | restricted-review; no route-level migration until privacy, consent, abuse-prevention, and provider-policy review |
| Tools | Bypass Web — `/api/tools/bypassurl?url=…` | GET | restricted-review; URL validation and SSRF/open-redirect threat review required |
| Tools | Bypass V2 — `/api/tools/bypassurl2?url=…` | GET | restricted-review; URL validation and SSRF/open-redirect threat review required |
| Tools | Web Screenshot — `/api/tools/ssweb?url=…&device=…` | GET | restricted-review; SSRF and private-network blocking required |
| Uploader | Uguu upload — `/api/uploader/uguu` | POST multipart/form-data | listed-in-dashboard; upstream size/type/retention rules unverified |

**Important inventory note:** the restricted groups above preserve the dashboard-card count without publishing operational route details for high-risk, privacy-sensitive, or rights-sensitive functions. The full 74-card count is a UI inventory, not an approved production allowlist.

### 2.3 Required endpoint metadata before implementation

Each endpoint promoted to the production allowlist must have:
- Stable internal endpoint ID and category.
- Provider owner and official documentation URL.
- HTTP method, exact path, required/optional query parameters, body schema, content type.
- Authentication and authorization requirements.
- Data classification, privacy purpose, retention, and consent basis.
- Provider terms, permission scope, attribution requirement, redistribution rights, and commercial-use status.
- Request/response examples that contain no real personal data or secrets.
- Last verified date, verification method, status, owner, and deprecation policy.

No endpoint is marked `active` until it has been checked against current provider documentation and a permitted, non-sensitive health verification. No real person's social account, private identifier, or personal content may be used as test input.

## 3. Target architecture decision record

### 3.1 Architecture direction

Adopt a separated frontend, gateway, and service architecture. Keep the current static dashboard as the migration baseline until the new frontend is ready; do not mix several competing build systems in one deployable unit.

| Technology | Proposed responsibility | Decision |
|---|---|---|
| Next.js | Main interactive application and server-side routes where needed | Candidate primary application shell |
| Astro | Documentation, changelog, public content, and lightweight landing pages | Separate content surface; not a second app router |
| Vite | Build tooling for standalone packages, UI components, or isolated tools | Use only where a separate Vite package has a clear boundary |
| TypeScript | Gateway, validation, orchestration, shared contracts | Default backend language for first implementation |
| Rust | Narrow, measured services that need native performance or strong process boundaries | Optional later service; not a rewrite requirement |
| HTML5 / CSS3 | Semantic structure and browser presentation | Baseline web platform |
| Tailwind CSS | Utility styling and design consistency | Adopt within the chosen frontend only |
| CSS Houdini | Optional progressive visual enhancement | Non-critical; feature-detect and provide CSS fallback |

### 3.2 Logical request path

`Browser → Next.js frontend/server boundary → API gateway → policy and validation → rate limiter → approved adapter → upstream provider`

The gateway must not become a generic open proxy. It only exposes explicitly registered provider adapters. The browser must never receive provider secrets or privileged credentials.

### 3.3 Service boundaries

- **Web app:** presentation, user interaction, accessibility, and non-sensitive client state.
- **Docs site:** versioned endpoint contracts, examples, policies, and changelog.
- **API gateway:** authentication, authorization, schema validation, quota checks, rate limiting, request IDs, and response normalization.
- **Provider adapters:** allowlisted outbound destinations and per-provider timeout/retry rules.
- **Execution sandbox:** isolated worker only for a documented feature that genuinely needs untrusted code or file processing. Do not add arbitrary shell execution.
- **Data layer:** minimal operational metadata only. Do not store prompts, uploaded files, or personal data by default.
- **Observability:** structured operational logs, metrics, alerting, and audit events with secrets and personal data redacted.

## 4. Dual Rate Limiter design

Use two independent controls, with a shared decision point:

1. **Layer A — identity / account / API-key quota:** per account or key, with endpoint-specific cost weights and plan quotas.
2. **Layer B — network / abuse guard:** per IP or privacy-preserving network bucket, plus global and provider-level concurrency ceilings.

Requirements:
- Apply both layers before upstream work begins.
- Use atomic counters or a documented token-bucket/sliding-window implementation.
- Define burst, sustained rate, daily/monthly quota, and concurrency separately.
- Return HTTP 429 with a stable error envelope and `Retry-After` when applicable.
- Avoid trusting client-supplied identity headers.
- Support IPv4 and IPv6 consistently; avoid treating a shared NAT as proof of a single user.
- Use Redis only as a coordination store if the chosen deployment architecture requires it; define outage behavior and bounded local fallback.
- Do not silently fail open when the limiter store is unavailable for expensive or abuse-sensitive endpoints.

Initial values must be set after workload and provider limits are known; no arbitrary production quota is hardcoded in this blueprint.

## 5. Sandboxing and RCE mitigation

The system must not execute arbitrary user-supplied code in the web process or API gateway.

Required controls:
- No shell interpolation or dynamic command construction from request input.
- Prefer fixed operations and typed arguments over arbitrary commands.
- If execution is essential, use a separate short-lived worker with non-root identity, read-only base filesystem, isolated temporary workspace, strict CPU/memory/time/process limits, and no host socket access.
- Deny outbound network by default; permit only explicit destinations when a feature requires network access.
- Never mount host credentials, repository write tokens, or deployment secrets into the worker.
- Validate file type by content and policy, not filename alone; enforce size and decompression limits.
- Treat uploaded files, remote URLs, model output, and provider responses as untrusted.
- Destroy worker state and temporary artifacts after each job.
- Log policy decisions without recording sensitive payloads.

Sandboxing is defense-in-depth, not a guarantee that RCE is impossible.

## 6. Security control matrix

| Area | Required control / design decision |
|---|---|
| Dependency risk | Add lockfile, automated advisory review, pinned direct dependencies, and provenance checks when a package system is introduced |
| Malicious packages | Review maintainer, package source, install scripts, release history, and transitive dependency tree |
| Prompt injection | Treat retrieved pages and provider output as untrusted data; separate instructions from data; use tool allowlists and explicit user authorization for side effects |
| AI permissions | No model receives ambient repository, filesystem, database, or network privileges |
| Database permissions | Least-privilege service roles, row-level policies where applicable, and separate migration credentials |
| Audit logs | Record auth, permission changes, admin actions, quota decisions, and security events; redact secrets and sensitive payloads |
| Monitoring | Error-rate, latency, quota abuse, auth anomalies, provider failure, and sandbox policy alerts |
| Backups | Encrypted backups, defined retention, documented restore owner, and periodic restore verification |
| Admin surfaces | No public admin dashboard; enforce server-side authorization and MFA for privileged operators |
| Security headers | Configure CSP, HSTS, frame protections, MIME sniffing protections, and referrer policy at the deployment edge |
| Cookies | Secure, HttpOnly, SameSite, narrow domain/path, and short session lifetime where cookies are used |
| Transport/storage encryption | TLS in transit; encrypt sensitive stored data and backups; document key rotation |
| Tenant isolation | If accounts/tenants are introduced, scope every read/write by server-derived tenant identity |
| Code review | Require review for security-sensitive changes and protect release branches |
| Mass assignment | Explicitly map accepted fields; never bind request bodies directly to privileged models |
| Command injection | Avoid shell execution; fixed argument arrays and allowlisted operations if unavoidable |
| Deserialization | Use schema-validated parsers; reject unsafe polymorphic/native object deserialization |
| OAuth | Validate state, nonce, issuer, audience, redirect URI, PKCE, and token storage; request minimum scopes |
| Secrets | Environment/secret manager only; no secrets in browser bundles, source files, logs, or examples |
| CORS | Explicit origin allowlist; never combine wildcard origins with credentials |

### Existing source observations to carry into implementation

- Browser code calls the provider directly; there is no owned gateway or owned rate limiter in the current repository.
- Fetch handlers generally do not check `response.ok` and do not define request timeouts.
- Brat Maker creates a Blob URL and inserts markup with `innerHTML`; replace with safe DOM construction, validate the response content type, and revoke old object URLs.
- Uploader source does not show client-side file size/type checks. Server-side enforcement must be confirmed with the provider.
- External links using `target="_blank"` should include safe `rel` values.
- Most displayed JSON uses `textContent`, which is preferable to HTML insertion.
- No auth, database, OAuth, admin, or password implementation was found in the reviewed frontend.
- No package manifest exists, so dependency vulnerability and malicious-package scanning cannot yet be meaningfully completed.
- A complete automated historical secret scan was not completed. Treat historical secret verification as pending; do not claim the repository history is clean.

## 7. Privacy, legal, and accessibility matrix

| Requirement | Current evidence / next decision |
|---|---|
| Privacy policy | Not found; required before collecting user data |
| Terms of service | Not found; required before public service launch |
| Refund policy | Conditional; only applicable if payment or paid plans are introduced |
| Cookie policy / banner | No cookie use was found in reviewed source; reassess if analytics, auth, or non-essential cookies are added |
| Form consent | Add only where data collection requires consent; explain purpose and retention |
| Data minimization | Do not collect accounts, prompts, or uploads unless necessary |
| Third-party SDK / asset review | Google Fonts is loaded externally; document the request and privacy implications |
| Dark patterns / hidden fees / fake reviews | Prohibit; no payment or review flow was found |
| Unsupported claims | Replace “74 Live Endpoints” with “74 dashboard cards listed” until verified |
| Alt text | Most pages need a semantic image audit; source inspection found very limited alt text |
| Color contrast | Requires rendered UI audit; not established by source inspection |
| Keyboard navigation | Requires interaction audit; add visible focus states and semantic controls |
| Business details | Publish only if an actual operator/business exists and the service requires it |
| Age-appropriate access | Define content and feature restrictions before launch; do not collect age data without a justified need |
| Unsubscribe | Conditional on introducing email subscriptions |
| Stock/image licenses | Record provenance and licenses for any third-party visual assets |
| Data deletion | Required if accounts or personal data storage are introduced |

### Privacy-sensitive feature gate

Social/profile lookup features must remain excluded from the production allowlist until the team documents a legitimate purpose, lawful access, provider terms, user consent expectations, data minimization, abuse reporting, and retention limits. Do not use private identifiers or real individuals as test fixtures.

Downloader and streaming features require a separate review of copyright, platform terms, and provider permission. A technically reachable endpoint is not proof that the content may be downloaded, redistributed, or publicly rehosted.

## 8. Attribution and permission record

The repository credits BintangAPI and StarLabs. The public BintangAPI landing page describes the service as a collection of scraping code used by StarLabs, wrapped as REST endpoints.

Permission is currently **user-reported, not independently verified**. Before reusing or redistributing source code, snippets, scraping logic, or provider assets, retain written evidence that clearly states the scope:
- calling the hosted API;
- using endpoint names and documentation;
- copying or adapting source code;
- redistributing modified source;
- commercial use;
- public hosting and derivative works;
- required attribution and notice text.

Permission to call a hosted API does not automatically grant permission to copy or redistribute its implementation. The repository's MIT license applies only to material the repository owner has rights to license; it must not be treated as overriding upstream terms.

## 9. Deployment blueprint

Target deployment:
- Next.js app deployed as the main interactive web application.
- Astro documentation deployed separately or as a distinct build output.
- API gateway deployed as server-side functions or a dedicated service depending on runtime, connection, and workload needs.
- Rust workers, if justified, deployed separately from the frontend.
- Secrets configured in the deployment platform's environment/secret settings, never committed.
- Preview deployments use non-production credentials and provider sandboxes where available.
- Production deployment requires protected branch, reviewed change, and explicit release approval.

Vercel is a candidate host for the web app and compatible gateway routes. Do not assume it is suitable for long-running, privileged, or resource-heavy sandbox workers; those require a separate runtime assessment.

## 10. Migration roadmap

| Phase | Scope | Exit condition |
|---|---|---|
| 01 — Reconnaissance | Repository and static security inventory | Baseline findings recorded |
| 02 — Blueprint | Endpoint inventory, architecture, security, privacy, deployment decisions | Blueprint reviewed and accepted |
| 03 — Foundation | Repository structure, contracts, lint/build setup, CI, environment schema | Reproducible build and protected configuration |
| 04 — Gateway | Auth, validation, dual rate limiter, request IDs, normalized errors | Only allowlisted adapters can be called |
| 05 — Provider adapters | Migrate approved endpoints in small groups | Contract and permission evidence per adapter |
| 06 — Frontend migration | Next.js application and Astro docs | Feature parity for approved functions |
| 07 — Hardening | Sandbox where needed, headers, logging, monitoring, backups | Security and privacy release gates met |
| 08 — Deployment | Vercel web deployment and separately assessed worker runtime | Rollback and operational ownership documented |

## 11. Release gates

A public release is blocked until:
- every exposed endpoint has provider documentation and permission scope recorded;
- restricted or privacy-sensitive features are disabled unless separately approved;
- no provider secret is present in client code or repository history;
- auth, authorization, validation, rate limits, and CORS are enforced server-side;
- upload and remote-URL handling have size, type, destination, and timeout limits;
- privacy, terms, data retention, and deletion notices are published where applicable;
- accessibility review is completed;
- monitoring, backup, restore, and rollback ownership are documented;
- deployment environment variables and production secrets are reviewed.

Zero risk cannot be promised. The goal is measurable risk reduction, evidence-backed controls, and an explicit release decision.

## 12. Phase 02 completion note

This document records the design and static inventory only. No endpoint health probes, real-person lookups, package installations, application changes, automated tests, or deployments are part of this phase. The endpoint registry is a dashboard-source inventory and must not be represented as a live-service status report.
