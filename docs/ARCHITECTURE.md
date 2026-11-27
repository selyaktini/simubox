# Architecture

Status: accepted for the current bootstrap under the owner's delegated technical authority. Public deployment remains unapproved.

## Components

- `site/`: Astro 7 static site, CSS tokens, reusable pages and client-side catalogue filtering. The catalogue imports validated YAML; scientific Markdown supplies prose only, avoiding duplicate metadata.
- `simulations/manifests/`: the authoritative catalogue metadata. `simulations/lorenz/`: original TypeScript model and Canvas renderer. esbuild emits a classic-script static bundle into `site/public/lab/`.
- `scripts/validate.ts`: rejects malformed manifests, duplicate IDs and missing notes/entry points. `scripts/serve-sim.mjs`: separate local origin for the first-party player during development.
- `tests/`: Vitest model/schema tests and Playwright end-to-end tests.

## Execution boundary

The trusted catalogue is at `127.0.0.1:4321` in development. The first-party player is at `127.0.0.1:4322` and runs in an iframe with `sandbox="allow-scripts"`, yielding an opaque origin. The production static build carries the first-party artifact under `/lab/` but retains the opaque iframe origin. This is suitable for the reviewed first-party example, not a future external publication arrangement. Future external artifacts require a distinct registered origin and restrictive response headers, with credential-free build and separate publication jobs. A one-way first-party ready signal clears the loading state; the catalogue verifies frame window, opaque origin, type and ID.

Classic script bundling avoids module-fetch CORS failure under an opaque sandbox origin. It does not establish compatibility for external apps that rely on module workers, storage, downloads or same-origin APIs. See SECURITY and FEASIBILITY.
