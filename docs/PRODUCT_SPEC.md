# Product specification — initial foundation

Status: implemented MVP specification, 2026-11-27. Audience needs remain assumptions pending user research.

## Prioritized journeys

1. **Run and understand:** A visitor opens Lorenz Attractor, changes σ, ρ or β, pauses/resumes, resets, and reads the equations, RK4 method, assumptions and citation.
2. **Discover:** A visitor browses available fields, searches titles/summaries/tags, filters by category, and clears an empty result.
3. **Inspect provenance:** A visitor sees author, source, revision when external, license status, required browser capability and publication status.
4. **Contribute:** A developer finds a reviewed pull-request path and understands that external builds are not automatic.

## Functional requirements

- Static pages: home, catalogue, about, contribute and one detail page per valid manifest.
- Catalogue entries derive from validated YAML; search and category filtering work in the browser, with visible result count and empty state.
- Playable entries provide a restricted iframe player with loading/error feedback and fullscreen control.
- Candidate entries show source and integration status without a player.
- Scientific notes are Markdown and include experiment guidance, model, limitations and references.
- First-party Lorenz simulation uses typed numerical code, Canvas 2D, parameter controls, pause/resume and reset.

## Non-functional requirements

- Keyboard-operable controls, visible focus, readable contrast, semantic navigation and mobile layout.
- Static output; no backend, account or persistent state.
- External manifests are validated and never contain shell commands. Candidate code is never fetched or executed by the site.
- Source and attribution visible. No final platform license declaration before owner approval.
- Reproducible project installation through a committed npm lockfile; automated checks in trusted CI.

## Acceptance evidence

`npm ci`, `npm run validate`, `npm run check`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e` are the gates. Browser tests exercise discovery, navigation, candidate status, player controls, iframe sandbox and mobile layout. Manual review checks console, network, responsiveness and security headers. See FEASIBILITY for observed results and unresolved integration questions.
