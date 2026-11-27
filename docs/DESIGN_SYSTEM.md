# SimuBox design system — Scientific Atlas

Status: implemented for Mission 007, 2026-11-27. This is a frontend design decision under the owner's delegated authority. The visual system is original to SimuBox; the references below informed principles, not copied code or assets.

## Design philosophy and references

Treat the site as an atlas of inspectable models. Scientific figures occupy the visual center; labels, controls and source records explain what the figures are. Use editorial hierarchy, measured spacing and fine rules instead of decorative cards. The [Mandelbrot Odyssey stylesheet](https://github.com/yahyabmo/the-mandelbrot-set/blob/main/src/style.css) informed the atlas and instrument sensibility; the [Chaos Lab controls](https://github.com/yahyabmo/the-double-pendulum/blob/main/src/ui/controls.ts) informed compact transport and parameter grouping. SimuBox's layout, visual mark, previews and CSS are independently authored.

## Color and typography

| Token | Value | Role |
| --- | --- | --- |
| Night | `#0a0b0f` | Site and figure ground |
| Graphite | `#17191e` | Raised control surfaces |
| Hairline | `#3c3d42` | Editorial division |
| Warm ink | `#f6f3ea` | Main text |
| Muted ink | `#b9b6ad` | Secondary text |
| Brass | `#efc879` | Actions, figures and focus |
| Paper | `#f1eee7` | Scientific reading surface |
| Paper ink | `#292824` | Long-form text |
| Live | `#a9d8bd` | Playability status, also labeled in text |

Fraunces Variable provides editorial headings. IBM Plex Sans provides interface and article text. IBM Plex Mono provides numerical readouts, indices and provenance. Fontsource packages self-host Latin font assets; no runtime font CDN is used. The font families are distributed under OFL-1.1. KaTeX is used only at build time for inline and display equations; its CSS and font assets are local. Body text remains readable without web fonts through system fallbacks.

## Layout and components

The shell is at most 1320 px wide, with responsive side margins. The homepage uses a two-column introduction and a numbered collection index. Explore keeps the field index adjacent to search and result rows on desktop; the index becomes compact buttons on smaller screens. Collection entries have an image, scientific subject, status, concise summary and author. The detail page places the workspace immediately after a short title, then uses a light article surface for reading and a dark provenance record. Candidate pages replace the player with a labeled scientific figure and a source action.

The SimuBox mark combines registration corners with three converging curves. It is an editorial device rather than an atom or a claim about measured data. Controls use native buttons, inputs, selects and browser fullscreen. Active navigation uses `aria-current`; selected field buttons use `aria-pressed`. No custom dialog or runtime UI framework is required.

## Scientific visualization conventions

- The Lorenz preview is generated from the actual TypeScript RK4 model, with the documented default parameters and x–z projection.
- The Mandelbrot preview computes escape time for `zₙ₊₁ = zₙ² + c` up to 80 iterations. Its 360 × 220 PNG is 8 KB. It is a phenomenon preview, not a screenshot of Mandelbrot Odyssey.
- The double-pendulum preview is a geometric diagram of two arms at specified angles, not a trajectory or a screenshot of Chaos Lab.
- Each preview has manifest-provided alternative text and caption. `npm run generate:previews` regenerates the deterministic assets.
- The live Lorenz canvas retains the documented RK4 timestep. The UI reports model time and parameter values; it does not display invented physical measurements.

## Interaction and accessibility

Search, field, topic and availability filters compose. Shareable URL parameters update on changes and restore through browser history. Typing `/` focuses search when the user is not in a form control. The Lorenz player offers transport controls, parameter sets and a focusable plot; Space pauses, R resets when focus is outside form controls. Reduced-motion preference starts the model paused. Fullscreen keeps an exit control visible.

Focus is brass and visible. Buttons and form elements are keyboard operable. Status is communicated in words and color. Scientific notes use semantic headings and KaTeX with overflow handling. The site was checked at 320, 375, 390, 768, 1024, 1440 and 1920 px. Axe found no violations on the four primary page types in Chromium; automated checks do not establish full WCAG 2.2 AA compliance. Manual checks covered keyboard flow, mobile layout and visible focus.

## Dependencies and security

Fontsource packages provide local fonts; `katex` and `marked-katex-extension` render mathematics at build time; `@axe-core/playwright` runs accessibility checks in development tests. All were selected for a specific need and are open-source packages (fonts OFL-1.1, KaTeX and its Marked extension MIT, axe Playwright MPL-2.0). The existing Astro and TypeScript architecture remains static. Raw Markdown HTML is escaped, link destinations are restricted to HTTPS or anchors, and KaTeX runs with `trust: false`. The iframe retains `sandbox="allow-scripts"` and opaque origin. No external candidate artifact is published.
