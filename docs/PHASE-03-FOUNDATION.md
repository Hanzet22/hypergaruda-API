# Phase 03 — Foundation

**Status:** foundation committed; application runtimes are intentionally not
instantiated yet.

## 1. Goals

- Establish a small npm workspace with a committed lockfile.
- Define shared TypeScript transport contracts and non-secret runtime config.
- Reserve independent application boundaries for Next.js, Astro, and Vite.
- Prepare an isolated Rust workspace without exposing a production service.
- Add a minimal, read-only GitHub Actions foundation check.
- Preserve the existing root-level HTML dashboard throughout migration.

## 2. Repository layout

```text
.
├── apps/
│   ├── web/       # Next.js application boundary
│   ├── docs/      # Astro documentation boundary
│   └── ui-lab/    # Vite component/CSS laboratory
├── packages/
│   ├── config/    # non-secret runtime configuration parser
│   └── contracts/# shared API transport types
├── services/
│   ├── Cargo.toml
│   └── native/    # Rust library scaffold; no server or execution
├── docs/
├── scripts/
└── .github/workflows/
```

The legacy HTML pages remain at repository root. They are not silently
replaced, moved, or deleted by this phase.

## 3. Framework ownership

| Technology | Boundary | Rule |
| --- | --- | --- |
| Next.js | `apps/web` | Main interactive web application; no generic proxy |
| Astro | `apps/docs` | Documentation and static content; no API runtime |
| Vite | `apps/ui-lab` | Isolated component/CSS build surface; no production router |
| TypeScript | `packages/*` and future gateway | Shared contracts and server-side logic |
| Rust | `services/native` | Optional native library; only expand when measured need exists |
| HTML5/CSS3 | All web surfaces | Semantic HTML and progressive browser features |
| Tailwind CSS | Per-app integration | Do not create a global cross-framework CSS build |
| CSS Houdini | Optional enhancement | Feature detection and ordinary CSS fallback are mandatory |

No app package has been installed in this phase. This avoids installing three
framework stacks into a repository before the app boundaries and supported
versions are ready. Each app's dependencies must be added with exact versions
and a regenerated lockfile when that app is activated.

## 4. Runtime baseline

Node.js baseline is **22.23.4**. It satisfies the currently documented Astro
minimum and exceeds the current Next.js and Vite minimums.

- Next.js installation: https://nextjs.org/docs/app/getting-started/installation
- Astro installation: https://docs.astro.build/en/install-and-setup/
- Vite guide: https://vite.dev/guide/
- Tailwind CSS with Vite: https://tailwindcss.com/docs/installation/using-vite
- Rust Cargo workspaces: https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html
- GitHub Actions for Node.js: https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs

The framework version is not guessed or pinned in this phase. Version selection
happens when the corresponding app is instantiated, followed immediately by a
lockfile update and a single focused build check.

## 5. Workspace and dependency policy

- npm workspaces currently include only local packages under `packages/*`.
- `package-lock.json` is committed; `npm ci` is the CI installation path.
- No third-party npm runtime or development dependency is introduced yet.
- `.npmrc` enables strict engine checks, exact version saves, and audit metadata.
- Do not add packages without reviewing package ownership, provenance,
  install scripts, transitive dependencies, license, and advisory status.
- Do not use wildcard dependency versions.
- Do not commit `.env` files or credentials.

The empty dependency graph is intentional: this commit makes the workspace
reproducible without prematurely pulling framework dependency trees.

## 6. Shared contracts and configuration

`@hypergaruda/contracts` defines transport-neutral success/error envelopes,
request context, and health response types. These are compile-time contracts,
not runtime validation and not evidence that any endpoint is live.

`@hypergaruda/config` parses only non-secret settings. It accepts an explicit
environment object instead of reading global process state, so it can be
tested or used from a server-only entry point without coupling to a framework.
Never import server configuration into a browser bundle.

Runtime request validation, authentication, authorization, request IDs,
provider allowlists, and the Dual Rate Limiter belong to Phase 04.

## 7. Rust boundary

The Cargo workspace uses resolver 3 and edition 2024. The native crate forbids
unsafe Rust and contains no network listener, command execution, filesystem
access, or user-supplied code execution.

This is not the sandbox. A future sandbox must be a separately isolated
runtime with resource limits, no ambient credentials, and explicit network
policy. Do not treat a Rust crate boundary as an operating-system security
boundary.

## 8. CI boundary

`.github/workflows/foundation.yml` uses read-only repository permissions,
Node version from `.nvmrc`, `npm ci`, and one metadata/structure check.

This workflow does not claim to build Next.js, Astro, Vite, or Rust. Those build
jobs are added only after the corresponding app/service is activated and its
locked dependencies exist. No deployment is configured.

## 9. Phase 03 exit conditions

- [x] npm workspace and lockfile created.
- [x] Node baseline recorded.
- [x] TypeScript contracts package created.
- [x] Non-secret environment parser created.
- [x] Next.js, Astro, and Vite boundaries documented separately.
- [x] Rust workspace scaffold created with unsafe code forbidden.
- [x] Minimal read-only CI workflow added.
- [x] Existing HTML dashboard preserved.
- [ ] Framework apps instantiated with reviewed exact dependencies.
- [ ] Framework builds enabled in CI.
- [ ] Gateway implementation and runtime validation (Phase 04).
- [ ] Dual Rate Limiter and sandbox runtime (later phases).

## 10. Safety and completion statement

This phase creates structure and contracts only. It does not migrate endpoint
handlers, activate provider calls, expose a gateway, add authentication,
introduce database access, execute user code, deploy to Vercel, or claim
production readiness.

A clean foundation check is not a security certification. Zero risk cannot be
promised; later phases must add evidence-backed controls and explicit release
gates.
