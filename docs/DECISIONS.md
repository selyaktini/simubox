# Decision register

The owner delegated ordinary reversible technical decisions for Missions 002–005 and frontend decisions for Mission 007. Accepted means accepted for the local platform, not a public deployment authorization. Proposed items need further verification or owner action.

| ID | Choice | Rationale and evidence | Alternatives / trade-off | Status |
| --- | --- | --- | --- | --- |
| D-001 | Astro 7 + strict TypeScript static catalogue | Seven static pages build from manifests; no application server needed. | Plain HTML would need more generation code. | Accepted |
| D-002 | English content and Markdown notes | Portable prose with a single initial language. No user research validates language preference. | Localization later. | Accepted |
| D-003 | Validated YAML manifests | Zod schema and tests reject malformed/unsafe entries; metadata has one owner. | JSON is stricter but less editorial. | Accepted |
| D-004 | Independent external source repositories pinned to full commits | Candidate HEADs were resolved to full SHAs; publication requires further provenance checks. | Monorepo would couple releases. | Accepted |
| D-005 | Static browser apps | First-party Lorenz app builds as a static artifact. | Server execution expands security and cost. | Accepted |
| D-006 | Restricted iframe and separate origins for external apps | First-party dev uses separate port and opaque iframe. External origin and headers require deployment validation. | Same-origin unrestricted embedding is unsafe. | Accepted |
| D-007 | GitHub Actions for trusted CI only | CI runs checks without secrets. Untrusted external build pipeline remains unimplemented. | Dedicated build service later. | Superseded |
| D-008 | Cloudflare Pages as hosting candidate | No hosting experiment or deployment authorization yet. | Other static hosts may meet header/origin needs. | Proposed |
| D-009 | Reviewed pull requests, no backend/accounts | Static contribution path meets MVP with smaller attack surface. | Direct submission requires authentication and moderation. | Accepted |
| D-010 | Recommend MIT code and CC BY 4.0 original educational content | Clear split for future licensing; copyright owner must approve. | Other licenses possible. | Proposed |
| D-011 | Trusted platform CI only; no external builds | GitHub Actions workflow uses read-only token and platform checks. | Automated external pipeline deferred. | Accepted |
| D-012 | First-party classic-script bundle in opaque iframe | Browser can load script without module CORS under opaque origin; preserves model/rendering split. | Module worker architecture would require distinct-origin review. | Accepted |
| D-013 | Scientific Atlas visual system with self-hosted Fraunces and IBM Plex fonts | Editorial hierarchy, readable notes and numerical labels support scientific exploration; assets are local and OFL-1.1. | System fonts only would reduce assets but weaken the intended hierarchy. | Accepted |
| D-014 | Build-time KaTeX for trusted scientific Markdown | Inline and display equations render without a client mathematics runtime. Raw HTML is escaped, links restricted and KaTeX trust disabled. | Plain text equations were harder to scan; client rendering adds runtime cost. | Accepted |
| D-015 | Deterministic preview assets and URL-synchronized filters | Model-generated visuals are scientifically traceable; field/topic/status/search states are shareable and restore on navigation. | External screenshots need license review; static formula cards did not show phenomena. | Accepted |
