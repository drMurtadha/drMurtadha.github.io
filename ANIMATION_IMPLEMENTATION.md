# Animation pilot: implementation notes

Branch: `claude/animation-pilot`. This is a restrained first motion phase for the homepage only. No other route was touched. Production was not deployed.

## What was implemented

### 1. `src/components/NetworkHeroMotion.astro` — hero network reveal

Mounted inside the existing `hero-network` `AnimationSlot`, alongside the unchanged principal portrait. Renders four small, real, keyboard-focusable links layered over the photo:

- `01 Research` → `/research/`
- `02 Supervision` → `/people/`
- `03 Publications` → `/publications/`
- `04 ASCEND 2030` → `/impact/`

On first paint (motion allowed), each tile animates in from a short inward offset near the portrait's centre to its fixed resting position, staggered ~150 ms apart, via a single CSS `@keyframes` animation with `animation-fill-mode: both`. There is no JavaScript in this component at all — the whole effect, including the reduced-motion fallback, is pure CSS.

### 2. `src/components/ResearchFormationGrid.astro` — research formation reveal

Mounted immediately after the existing `research-constellation` `AnimationSlot` in `ResearchConstellation.astro`. It adds no visible markup of its own — it is a small controller that, when the section scrolls into view, flips `data-formation="active"` on the slot, which every one of the five existing `.constellation-map li` cards transitions into from a slightly displaced, faded starting position back to the exact same absolute position the static layout already used. The five real research themes (Network resilience, Underwater sensing, Autonomous systems, Indoor positioning, Heritage intelligence) and their existing copy are untouched — only their entrance is animated.

## Interaction ideas taken from the references, and what was rewritten

- **Hero 21** (`/Users/mohdmurtadha/Documents/Hero Animations/21/`): the interaction idea taken was the shape of the motion — a set of small tiles beginning near a central point and settling outward into fixed final positions, staggered. Everything else was rewritten: Hero 21's demo used GSAP, a full-viewport gallery of 14 stock/sample images, a headline wipe-reveal, and a stock/demo colour system. None of that markup, styling, imagery, headline copy, or its GSAP timeline code was copied. The final component uses four real links to existing site routes, the site's own colour tokens, and no animation library.
- **Grid 7 / "On-Scroll Layout Formations"** (`/Users/mohdmurtadha/Documents/Grid Animations/7/`, a GSAP + ScrollTrigger demo with nine numbered grid variations and 42 sample images): the folder is literally numbered "7", corresponding to the seventh variation in `js/index.js` (`animateSeventhGrid`), whose distinguishing idea is a staggered, scroll-pinned reveal of image tiles. The interaction idea taken was narrower still: a one-shot, staggered reveal of a set of cards as the section enters view. Rewritten from scratch: no GSAP, no ScrollTrigger, no `imagesloaded`, no scroll-scrubbed pinning, no 3D transforms, and none of the 42 sample images. The five research cards, their text, and their existing "constellation" final layout (including the connecting SVG lines) are the site's own pre-existing content, unchanged.

Both reference packages are marked `"license": "ISC"` in their own `package.json` but neither ships a file-level licence header or copyright notice for the bundled images or code, so, per the brief, only the general interaction behaviour was reproduced in fresh code — no source files, assets, fonts, or editorial copy from either archive were copied, viewed side-by-side while typing, or pasted.

## Assets used

No new assets. Both components reuse existing site assets and data only:

- The hero portrait (`murtadha-office-desk.jpg`) is unchanged; no new image was added.
- The four hero tile labels/routes and five research theme cards all reuse content and routes that already existed in the codebase (`ResearchConstellation.astro`'s own `themes` array, and the site's existing `/research/`, `/people/`, `/publications/`, `/impact/` routes).

`ASSET_REGISTER.md` was not modified — no asset was added, replaced, or newly approved.

## Dependencies added

None. No package was added to `package.json`. No GSAP, ScrollTrigger, React, Vue, Svelte, or Three.js. No external font service, CDN, analytics, or third-party embed.

## Accessibility behaviour

- Both components honour `@media (prefers-reduced-motion: reduce)`: the hero's `animation` declaration is scoped inside `@media (prefers-reduced-motion: no-preference)`, so a reduced-motion user's tiles render directly in their final position with no animation at all; the grid's controller script checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before ever applying a "pending" (hidden) state, so a reduced-motion user sees the five cards in their finished layout immediately.
- The four hero tiles are real `<a>` elements, reachable and activatable by keyboard, with a visible `:focus-visible` state (background changes to the site's signal colour, in addition to the browser's own default focus outline, which is never suppressed anywhere in the stylesheet).
- The five research cards were already real, screen-reader-readable HTML (`<li>` with `<h3>`/`<p>`); the reveal only animates `opacity`/`transform` on already-present content — no information is available only through the animation or only on hover.
- Nothing hijacks scroll, adds a custom cursor, or sets `overflow: hidden` at the page level (the existing `.hero-portrait { overflow: hidden }` predates this pilot and only clips the photo card itself).
- The `IntersectionObserver` in `ResearchFormationGrid.astro` fires once and immediately calls `.disconnect()` — there is no continuous work before, during, or after the reveal, so there is nothing to "pause" separately when the section is off-screen and nothing left to clean up on navigation (this site has no client-side router/View Transitions; every navigation is a full page load, so no cross-page listener leak is possible).
- Both components work identically with touch and with no hover available, since neither behaviour depends on `:hover`.
- No image dimensions changed and no new images were introduced, so there is no additional layout-shift risk beyond what already existed.

## Mobile fallback

At 390 px and 768 px, both components render with no horizontal overflow (verified with the browser's `scrollWidth`/`clientWidth` check on every affected route). The hero tiles keep their percentage-based positions over the photo and stay clear of the existing figcaption band at all three tested widths (360/390, 768, 1440 px). The research cards already collapse to a static single-column stack below 800 px (pre-existing CSS); the reveal transform applies just as well to that stacked layout and still finishes within about one second of the container entering the viewport.

## Exact built sizes (clean `npm ci` + `npm run build`)

| Metric | Before this pilot | After this pilot | Budget |
|---|---:|---:|---:|
| Total CSS | 28.6 KiB | 30.4 KiB | 60 KiB |
| Total external JS | 0.0 KiB | 0.0 KiB | 30 KiB |
| Max inline JS on any one page | 1.1 KiB | 1.1 KiB | 10 KiB |

The maximum inline JS per page is unchanged and is still set by the pre-existing publication-search script on the four `/publications/*` routes (1106 bytes), not by anything added in this pilot — the new `ResearchFormationGrid` controller (~470 bytes) only ever ships on the homepage, where total inline JS is 1008 bytes, still below the publications pages' figure. The performance budget checker (`scripts/check-performance-budget.mjs`) was not modified.

## Known limitations

- The hero tile labels ("Research", "Supervision", "Publications", "ASCEND 2030") and their four anchor positions over the photo are a first-pass editorial judgement call, not a client-tested design; the owner may want to adjust wording, order, or exact placement before this ships to `main`.
- The convergence offsets (`--tx`/`--ty` custom properties) for the hero tiles are small, hand-picked pixel values chosen to look like they originate near the portrait's centre — they are not computed from the tiles' actual on-screen geometry, so if the four tiles' positions are ever edited, their matching offsets should be re-checked by eye.
- No automated visual-regression or animation test was added; verification for this pilot was manual (build validation scripts + browser checks at three viewport widths), as scoped.
- `prefers-reduced-motion: reduce` was verified by static analysis of the CSS/JS gating logic, not by a live browser toggle — the browser automation available in this environment does not expose a reduced-motion emulation switch (only a light/dark colour-scheme switch was available).

## Deferred (explicitly out of scope for this pilot)

- Scroll Animation 8 — no matching source code was supplied.
- Grid Animation 2 — its 3D/WebGL approach is too heavy for this pilot's budget and scope.
- Any other hero/grid/scroll animation package.
- AnimMaster integration.
- Production deployment, search indexing, DNS, or WordPress cutover.
