# Agent instructions

## Project context

SimuBox is an early-stage, open-source scientific simulation platform. Read the relevant files in `docs/` and this file before implementation. The roadmap is a proposal, not authorization to implement later phases.

## Engineering principles

- Prefer small, reviewable changes and simple, accessible browser experiences.
- Keep simulation-specific code and metadata separate from trusted catalogue code.
- Avoid dependencies, services, and persistent infrastructure without a clear need and an explicit decision.
- Preserve attribution and provenance for scientific content and contributed code.

## Security

- Treat every external simulation repository, manifest, dependency, and build artifact as untrusted input.
- Isolate external builds; never give untrusted builds deployment credentials or access to trusted infrastructure.
- Pin source revisions to full commit hashes, verify provenance, and validate manifests and generated artifacts before publication when an integration pipeline is built.
- Keep catalogue and simulation execution across a deliberate security boundary. Assess origin isolation, iframe permissions, browser messaging, content security policy, and hosting controls together; iframe sandboxing alone is insufficient.
- Do not publish candidate simulations before checking integration feasibility, license compatibility, and security.

## Quality and documentation

- Add tests appropriate to behavior and risk when implementing code; cover validation and security boundaries with focused tests. Document checks performed and gaps left open.
- Update relevant documentation when behavior, architecture, or decisions change. Keep claims traceable; do not invent sources or present historical research as current verification.
- Record consequential choices in `docs/DECISIONS.md` with rationale, alternatives, and one of: Proposed, Accepted, Rejected, Superseded.
- Distinguish approved decisions from proposals in code, documentation, and reports. Do not silently promote a proposal to Accepted; seek the project owner's decision.
- Report assumptions, limitations, and trade-offs in implementation summaries.

## Current mission boundary

Documentation foundations only. Do not initialize a framework, install dependencies, add application code or CI/CD, create license files, change remotes, or commit or push for Mission 001.
