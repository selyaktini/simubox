# Technical feasibility — 2026-11-27

## Environment and selected versions

The local host ran Node.js 26.13.1, npm 12.2.2 and Docker 29.9.3. The project uses Astro 7.4.13, TypeScript 5.9.3, Zod 4.6.7, YAML 2.9.1, esbuild 0.28.2, Vitest 5.1.2 and Playwright 1.65.1 in the lockfile. The static site needs Node 22.23.4 or newer per [Astro installation docs](https://docs.astro.build/en/install-and-setup/). CI selects Node 24.

## Experiments and findings

- Static Astro pages generated from validated YAML and Markdown; build emits seven routes. Scientific prose is rendered from trusted local Markdown using `marked`, while all metadata lives in YAML. No server runtime is required.
- Original TypeScript Lorenz model builds into a classic script, necessary because opaque iframe origins can block same-origin ES module fetches under CORS. The local player uses port 4322, separate from Astro at 4321. The iframe grants only `allow-scripts`. See [MDN iframe sandbox guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).
- Manifest schema rejects unsafe paths, unsupported statuses, unapproved license identifiers, unknown keys and invalid source commits; catalogue validation rejects duplicates and missing notes.
- Browser and numerical tests cover the implemented first-party path. Current results are in the final mission report; rerun checks after changes.

## External candidates

Public GitHub HEADs resolved to full commits on this date: Mandelbrot Odyssey `4bb036e3edc7e86ba54f959637c7a76cd48ec3bb`; Chaos Lab `1947ade448fc8dd07f21256a3387000e01a2e7af`. Source tarballs for these exact commits were inspected without executing scripts. Both roots declare MIT, have npm lockfiles, `tsc --noEmit && vite build`, and Vite `base: "./"`. Chaos Lab uses Canvas 2D. Mandelbrot Odyssey uses WebGL2 and module workers, and depends on `mediabunny`. Repository license inspection does not establish rights for every transitive dependency or asset. Both remain candidates.

The source packages contain desktop installer scripts, which were not run. Both were built in a disposable `node:24-bookworm` container with a read-only source mount, no host home or credentials, dropped capabilities, `no-new-privileges`, CPU/memory/PID limits and `npm ci --ignore-scripts`. Chaos Lab built three files (52 KB). Mandelbrot Odyssey built eight files (888 KB) including four worker bundles; Vite warned about a 754 KB JavaScript chunk. These builds demonstrate static artifact generation under Node 24, not license clearance. The artifacts were served at `/candidates/chaos/` and `/candidates/mandelbrot/` from a local static server. Chromium loaded each directly at the nested path with HTTP 200 and no observed console errors or failed requests during the short probe. Both failed inside a same-server `sandbox="allow-scripts"` iframe: their stylesheet and ES module requests were blocked by CORS from the opaque `null` origin. Browser behavior was not tested across all interactions or browsers. Resolving this requires deliberate separate-origin hosting and CORS/CSP review, not broadening the iframe permissions. No candidate artifact is published in this repository.

## Security and remaining uncertainty

The development player server sends a restrictive CSP. Production static hosting must add and verify equivalent headers and a distinct origin for any external artifacts. Opaque iframe origins limit storage and may affect module workers and WebGL behavior. A separate origin plus iframe and CSP is still not a complete sandbox. External dependency lifecycle scripts, asset notices, runtime network requests, browser compatibility, performance and provenance require review before promotion.
