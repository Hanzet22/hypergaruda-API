# Application boundaries

This directory reserves independent deployable surfaces. The legacy root-level
HTML dashboard remains available during migration and is not moved or deleted
in this foundation commit.

| Path | Framework | Owns | Does not own |
| --- | --- | --- | --- |
| `web/` | Next.js | Interactive application and server-rendered UI | Generic open-proxy behavior or provider secrets in browser code |
| `docs/` | Astro | Public documentation, endpoint references, changelog, policies | API gateway runtime |
| `ui-lab/` | Vite | Isolated component and CSS experiments | Production routing or provider calls |

Framework dependencies and lockfile entries for these applications are added
when each app is instantiated in its migration phase. Do not install all
frameworks into one deployable app.

Tailwind CSS is configured at the app boundary. CSS Houdini is optional and
must always have a standard CSS fallback.
