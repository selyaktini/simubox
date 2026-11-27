# Decision register

Statuses: **Proposed** (under consideration), **Accepted** (approved), **Rejected** (declined), **Superseded** (replaced by a later decision). The entries below are all proposals from the initial concept, not project owner approvals. Record the owner, date, and replacement ID when a status changes.

| ID | Description | Rationale | Alternatives | Status |
| --- | --- | --- | --- | --- |
| D-001 | Use Astro and TypeScript for a static catalogue. | Could support content-oriented pages with limited runtime infrastructure. | Another static generator; plain HTML; a different typed stack. | Proposed |
| D-002 | Start public content in English; write scientific explanations in Markdown. | One initial language and portable text may simplify editorial work. | Multilingual launch; structured content system. | Proposed |
| D-003 | Describe simulations with validated YAML manifests. | Human-readable metadata could support a catalogue and integration checks. | JSON; TOML; metadata in code. | Proposed |
| D-004 | Keep simulation source in independent GitHub repositories and pin published revisions to full commit hashes. | Separates ownership and identifies the source used for a release. | Monorepo; packaged submissions; signed release artifacts. | Proposed |
| D-005 | Require static browser-compatible simulation builds. | Could enable browser playback without a simulation backend. | Server-hosted simulations; container sessions; compiled packages. | Proposed |
| D-006 | Serve catalogue and simulations from separate origins using restricted iframes. | Limits direct access from untrusted simulation code to catalogue context. | Same-origin embedding; reviewed code bundled into catalogue; separate application windows. | Proposed |
| D-007 | Use GitHub Actions for integration CI/CD, with isolated untrusted builds and separate credentialed publishing. | May fit a pull-request workflow, subject to a verified security design. | Dedicated isolated build service; manual builds; another CI provider. | Proposed |
| D-008 | Consider Cloudflare Pages for hosting. | Candidate for static delivery; origin and header requirements need verification. | Other static hosts; self-hosting. | Proposed |
| D-009 | Begin with pull-request contributions and no database, authentication, or backend. | Keeps the first workflow small and reviewable. | Submission service and accounts from launch. | Proposed |
| D-010 | Consider MIT for original platform code and CC BY 4.0 for original scientific content. | Distinguishes software and educational content licensing. | Other permissive or copyleft licenses; a single license where appropriate. | Proposed |

Before any candidate simulation is imported or published, verify its license, dependencies, technical compatibility, and permitted attribution. Candidate repositories: [Mandelbrot Odyssey](https://github.com/yahyabmo/the-mandelbrot-set) and [Chaos Lab — Double Pendulum](https://github.com/yahyabmo/the-double-pendulum). Their suitability is unresolved.
