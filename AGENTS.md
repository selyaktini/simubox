# Agent instructions

Read this file, README and relevant `docs/` before implementation. The roadmap proposes future work; it is not authorization for later phases.

## Engineering

Prefer small, reviewable, accessible changes. Keep scientific models separate from rendering and from trusted catalogue code. Avoid unnecessary dependencies or infrastructure. Preserve author attribution, scientific references and code provenance. Use manifest YAML as the single source for shared metadata. Add focused tests and update documentation when behavior changes. Record consequential choices in `docs/DECISIONS.md` as Proposed, Accepted, Rejected or Superseded; do not promote proposals without owner authority.

## Security

Treat external repositories, manifests, dependencies and artifacts as untrusted. Do not execute external builds with access to host secrets, home, SSH agent or deployment credentials. Pin full source commits and review licenses, dependencies, build scripts, artifacts and browser behavior before publication. Maintain distinct catalogue, player, external build and credentialed publication trust zones. Opaque iframe sandboxing is one control, not a full security boundary. Never combine `allow-scripts` and `allow-same-origin` for same-origin untrusted content. Do not publish candidate simulations without feasibility, license and security checks.

## Current boundary

Missions 002–005 and Mission 007 authorize the initial static platform, original reference simulation and Scientific Atlas frontend redesign. External candidate publication, automatic third-party builds and public deployment remain out of scope. Keep licensing declaration pending the owner's explicit decision. Do not commit or push unless instructed or useful for local review; never push directly to main.
