# Preliminary architecture

All choices here are proposals. See [the decision register](DECISIONS.md) for status; no platform stack or hosting model is approved.

## Proposed components

| Component | Possible responsibility |
| --- | --- |
| Catalogue | Static pages for discovery, simulation descriptions, explanations, equations, references, and source links. Astro and TypeScript are candidates. |
| Content and metadata | Markdown explanations and validated YAML manifests describing identity, topics, provenance, source revision, build artifact, and integration settings. English could be the first public language. |
| Simulation repositories | Independently maintained source repositories producing static, browser-compatible builds; published versions could be pinned to full Git commit hashes. |
| Integration pipeline | Fetch and build pinned revisions in isolation, validate metadata and artifacts, and publish approved outputs. GitHub Actions is a candidate, not a security boundary by itself. |
| Hosting | Serve the trusted catalogue and untrusted simulation artifacts from separate origins; Cloudflare Pages is one candidate. |

An initial MVP could use pull requests for review and avoid a database, authentication, and backend. This would constrain publishing to maintainers and reviewed contributors until a later contribution model is designed.

## Trust boundaries

The catalogue is trusted application content. External simulation source, dependencies, manifests, and generated files are untrusted. Builds must run without deployment secrets and with restricted credentials, network, and filesystem access. Review and validation must occur before artifacts cross into publication. A full commit hash identifies source but does not by itself make a build reproducible; build tooling and dependencies also need pinning or equivalent controls.

Published simulations should run on an origin separate from the catalogue, within a restrictive iframe and explicit permissions. Define and validate any cross-frame messages. Assess content security policy, permissions policy, storage and cookie behavior, navigation, resource limits, and artifact serving rules. Neither origin separation nor iframe sandboxing alone addresses build-time compromise or all browser risks.

## Questions to resolve

- Which user and contributor workflows should the first MVP support?
- Can the two candidate simulations be built as static browser artifacts, and under which licenses?
- What exact manifest schema, versioning, artifact checks, and review rules are needed?
- How will isolated builds be reproducible and kept separate from publishing credentials?
- What iframe capabilities and cross-frame communication do simulations actually need?
- Which hosting setup reliably provides separate origins and the required security headers?
- When, if ever, are backend services, accounts, and direct submissions justified?
