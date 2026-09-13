# Animation pilot: implementation notes

Branch: `claude/animation-pilot`. This is a restrained first motion phase for the homepage only. No other route was touched. Production was not deployed.

## Refinement pass (visual polish, no new concept)

The pilot was technically sound but read too much like a generic tech demo: the hero tiles were bright, pill-shaped, and scattered around the portrait; the constellation cards left a large empty centre and were tied together with a visually loud, crossing wireframe. This pass keeps the exact same mechanisms — CSS-only hero reveal, one-shot `IntersectionObserver` grid reveal, same four hero links, same five research cards — and only adjusts appearance, positioning, and timing.

**Hero tiles — visual weight and placement.** Replaced the dark pill/bubble treatment (`border-radius: 999px`, `backdrop-filter: blur`, opaque `rgba(10,31,27,.74)` fill, bold 700-weight caps) with a small, flat rectangular tag: `border-radius: 2px`, no blur, a lighter `rgba(10,31,27,.5)` fill so more of the photo shows through, 600-weight type, and a thin 2px gold left-border in place of a filled badge — closer to a caption/label than a floating UI chip. Repositioned the four tiles from an uneven scatter (`top:21/43/67/58%`) into a deliberate two-upper/two-lower, left/right-balanced arrangement (`top:12%`/`18%` for the upper pair, `bottom:26%`/`15%` for the lower pair), re-verified against the portrait's face region and the figcaption band by measuring `getBoundingClientRect()` in the browser (closest tile clears the figcaption by over 100px at 1440px width). No connecting lines were added over the portrait — a literal network graphic across a photograph of a person made the photo busier rather than more intentional, which the brief explicitly said to avoid; the shared left-border accent across all four tiles is the restrained substitute for a connecting motif.

**Hero timing.** Duration cut from 0.8s to 0.5s, stagger from 150ms to 110ms, delay-before-first-tile from 150ms to 50ms — total sequence now finishes at ~0.88s (was 1.4s). Removed the `scale(.4)` pop-in entirely; tiles now only fade and slide a short distance (14–18px, was 30–50px), removing the "app UI" pop feeling. Eased with `cubic-bezier(.16,1,.3,1)` (a standard no-overshoot "expo-out" curve) in place of the previous curve, for a smoother, less springy settle.

**Research constellation — compaction.** `.constellation-map` height reduced from `min-height: 38rem` to `32rem`; the SVG inset tightened from `4rem 5%` to `3rem 8%`. All five card positions were pulled inward from their previous edge-hugging placement (e.g. card 1 was `left:0`, now `left:6%`; card 3 was `right:0`, now `right:6%`; card 4 was `bottom:0`, now `bottom:6%`) so the five cards read as one cluster around a much smaller central gap rather than five blocks pinned to the section's corners. Verified with `getBoundingClientRect()` in the browser that no two cards overlap at 1440px width.

**Connector line.** Removed the second `<path>` entirely — it drew three crossing diagonals through the middle of the section (a "wireframe star" that was the single biggest contributor to the technical-demo feel). Kept only the outer path connecting the five cards in sequence, recomputed to match the tighter layout, and made it visually subordinate: `stroke-width` reduced from `1` to `.75` and `stroke-opacity` added at `.4` (was fully opaque). No glow, no animated tracing.

**Constellation reveal timing.** Duration cut from 0.7s/0.6s (transform/opacity) to 0.55s/0.5s, stagger from 100ms to 90ms — last card now settles at ~0.91s (was ~1.1s). Removed the `scale(.88)` on the pending state; the reveal is now opacity + translate only, matching "no scale bounce." Movement distance reduced from 1.6–3rem to 1–1.6rem. Same easing curve as the hero (`cubic-bezier(.16,1,.3,1)`) for a consistent, unified motion language across both components.

**Mobile.** No structural change was needed: the existing ≤700px breakpoint already switches the constellation to a static single-column stack with the SVG hidden (`display:none`) before this pass, so the now-smaller reveal offsets simply make that stack's entrance faster and less noticeable, exactly as asked. Re-verified no horizontal overflow at 390px and 768px after the change.

Final formation logic is a **compact asymmetric cluster** (tightened, unevenly spaced, matching the original diagonal relationship between themes) rather than a forced symmetric grid or a single "anchor" theme — imposing a centre/hierarchy on five research areas that aren't described anywhere in the site's data as unequal would have been an invented editorial claim, which was out of scope.

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

| Metric | Before pilot | After first pilot pass | After refinement pass | Budget |
|---|---:|---:|---:|---:|
| Total CSS | 28.6 KiB | 30.4 KiB | 30.3 KiB | 60 KiB |
| Total external JS | 0.0 KiB | 0.0 KiB | 0.0 KiB | 30 KiB |
| Max inline JS on any one page | 1.1 KiB | 1.1 KiB | 1.1 KiB | 10 KiB |

CSS dropped slightly in the refinement pass despite the extra rules (removing one of the two SVG `<path>` elements and its associated markup outweighed the new positioning/timing declarations). The maximum inline JS per page is unchanged and is still set by the pre-existing publication-search script on the four `/publications/*` routes (1106 bytes), not by anything added in this pilot — the `ResearchFormationGrid` controller (~470 bytes, untouched by this pass) only ever ships on the homepage. The performance budget checker (`scripts/check-performance-budget.mjs`) was not modified.

## Known limitations

- The hero tile labels ("Research", "Supervision", "Publications", "ASCEND 2030"), their positions, and the constellation's compacted layout are still an editorial/visual judgement call refined by eye against screenshots, not a client-tested design; the owner may want a further pass on exact wording, spacing, or the connector line's tone before this ships to `main`.
- The convergence/displacement offsets (`--tx`/`--ty` on the hero tiles, `--fx`/`--fy` on the constellation cards) are small, hand-picked values, not computed from actual on-screen geometry — if any tile/card position is edited later, its matching offset should be re-checked by eye.
- The constellation's connector-line coordinates are a decorative approximation of the card centres in the SVG's own 1000×560 space, not derived from the cards' real DOM positions; they were adjusted by eye to track the new tighter layout but will drift slightly if card positions are changed again without also touching the `<path>` in `ResearchConstellation.astro`.
- No automated visual-regression or animation test was added; verification was manual (build validation scripts, `getBoundingClientRect()` overlap/clearance checks, and browser screenshots at three viewport widths).
- `prefers-reduced-motion: reduce` was verified by static analysis of the CSS/JS gating logic, not by a live browser toggle — the browser automation available in this environment does not expose a reduced-motion emulation switch (only a light/dark colour-scheme switch was available).

## Deferred (explicitly out of scope for this pilot)

- Scroll Animation 8 — no matching source code was supplied.
- Grid Animation 2 — its 3D/WebGL approach is too heavy for this pilot's budget and scope.
- Any other hero/grid/scroll animation package.
- AnimMaster integration.
- Production deployment, search indexing, DNS, or WordPress cutover.
