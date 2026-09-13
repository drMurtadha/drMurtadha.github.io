# Claude Code Brief — Animation Pilot for Murtadha / Networked Intelligence

## Objective

Implement a restrained first animation phase for the existing Astro site in this repository. Adapt the visual mechanics of **Hero Animation 21** and **Grid Animation 7** to the site's own academic content and approved assets.

This is an enhancement of the current site, not a redesign and not a migration restart. The result must retain the identity **Murtadha / Networked Intelligence**, with UTM ASCEND 2030 present only as the institutional layer—not as a corporate portal treatment.

## Current state and non-negotiable facts

- Production site: `https://drmurtadha.github.io/`
- GitHub repository: `https://github.com/drMurtadha/drMurtadha.github.io`
- Framework: Astro static site with vanilla CSS/JavaScript.
- The WordPress site `https://people.utm.my/murtadha/` must not be changed.
- The WordPress REST API is import/sync-only and must not become a runtime dependency.
- The verified Scopus h-index is **15**. Do not revert it.
- The current People page intentionally contains concise, privacy-reviewed progress information. Do not restore detailed private progress data.
- Search-engine indexing is currently controlled by the existing site configuration. Do not change indexing, canonical, robots, sitemap or cutover behaviour in this phase.
- Do not deploy or merge directly to `main`. Work on a new branch and push that branch only after all checks pass.

## Source material

Use these local folders as design references:

- Hero reference: `/Users/mohdmurtadha/Documents/Hero Animations/21/`
  - Preview: `hero-21.mp4`
  - Source archive: `code.zip`
- Grid reference: `/Users/mohdmurtadha/Documents/Grid Animations/7/`
  - Preview: `grid-7.mp4`
  - Source archive: `code.zip`

Important findings already established:

- Hero 21 is a small standalone Vite/HTML/CSS demo with sample imagery.
- Grid 7 is based on an on-scroll layout formation and includes bundled GSAP, ScrollTrigger, `imagesloaded`, and 42 sample images.
- The preview videos are reference material only. Do not place MP4 previews in the site or Git repository.
- Do not import the demo images, fonts, branding or editorial copy.
- The archives identify packages as ISC but do not provide sufficiently clear provenance for every visual asset and source file. Inspect the archives yourself. If reuse rights are not explicit, reproduce only the general interaction behaviour with fresh code; do not copy ambiguous third-party source wholesale.

Extract archives into a temporary directory outside the repository, inspect them, and remove the temporary extraction when finished. Never commit extracted demos, `.DS_Store`, `node_modules`, videos, lockfiles from the demos, or unused assets.

## Required implementation

### 1. Preserve and assess the current baseline

Before editing:

1. Read `README.md`, `IMPLEMENTATION_PLAN.md`, `ASSET_REGISTER.md`, `PRIVACY_EDITORIAL_REVIEW.md`, `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/ResearchConstellation.astro`, `src/components/AnimationSlot.astro`, `src/styles/global.css`, and `scripts/check-performance-budget.mjs`.
2. Confirm the working tree state and current branch.
3. Pull/fetch safely if a remote exists. Do not discard local changes.
4. Run `npm ci` and `npm run build` to record the passing baseline.
5. Create a branch named `claude/animation-pilot` from the latest safe `main`. If that branch already exists, inspect it before deciding whether to continue it; do not overwrite it.

If the baseline is already broken or there are unexpected uncommitted changes overlapping this work, stop and report the exact issue instead of forcing changes.

### 2. Hero 21 adaptation

Implement a component such as `src/components/NetworkHeroMotion.astro` and mount it inside the existing `hero-network` animation boundary.

Design intent:

- Retain the existing headline, lede, buttons and primary portrait.
- Translate Hero 21's expanding editorial collage into a restrained **research network reveal**.
- Begin with the current principal portrait as a stable focal node.
- Reveal a small number of secondary tiles or fragments that represent research, supervision, publications and institutional context.
- Use only approved site-owned assets already under `public/assets/` unless another local image has an explicit entry and approval in `ASSET_REGISTER.md`.
- Keep the text legible throughout. The animation must never cover navigation, calls to action or essential content.
- The final static state should still look intentional when JavaScript is unavailable.

Do not create a full-screen intro, loading gate or splash screen. Visitors must be able to read and navigate immediately.

### 3. Grid 7 adaptation

Implement a component such as `src/components/ResearchFormationGrid.astro` inside the existing `research-constellation` boundary, or immediately adjacent to it if this produces cleaner semantics.

Adapt the mechanics to the site's actual research themes:

1. Network resilience
2. Underwater sensing
3. Autonomous systems
4. Indoor positioning
5. Heritage intelligence

The animation should transition a scattered set of research cards/nodes into a coherent formation as the section enters the viewport. It must support the existing narrative that separate research environments are part of one connected inquiry.

Requirements:

- Reuse real titles and descriptions from existing site data/components.
- Cards and links must remain real HTML, readable by assistive technology and usable by keyboard.
- Do not paste Grid 7's 42-image layout or reuse its sample photographs.
- Do not import the bundled GSAP, ScrollTrigger or `imagesloaded` files.
- Prefer CSS transforms, CSS custom properties and a small vanilla JavaScript controller using `IntersectionObserver` or scroll progress.
- Do not hijack scrolling, add a custom cursor, or use global `overflow: hidden`.
- Scope all styles to the component so other routes remain unaffected.

### 4. Motion and accessibility behaviour

Both components must:

- Honour `@media (prefers-reduced-motion: reduce)` by presenting the finished static layout with no non-essential movement.
- Avoid meaningful information that is available only through animation or hover.
- Preserve visible keyboard focus.
- Avoid flashes, rapid oscillation, parallax sickness and unnecessary continuous animation.
- Pause or stop work when the relevant section is off-screen.
- Clean up observers and event listeners during Astro page lifecycle events where applicable.
- Work with touch input and without hover.
- Prevent layout shift by reserving dimensions before images load.

### 5. Responsive behaviour

Test at least these viewport classes:

- Small mobile: approximately 360 px wide
- Large mobile/tablet: approximately 768 px wide
- Desktop: approximately 1440 px wide

On constrained or low-capability devices, reduce the number of animated tiles and simplify transforms. A clean static composition is preferable to dropped frames.

### 6. Performance constraints

Preserve the spirit of the current strict budget. The existing checker allows approximately:

- 60 KiB total CSS
- 30 KiB total external JavaScript
- 10 KiB inline JavaScript per page
- 250 KiB per raster image

Do not simply weaken or remove the performance checker to make the implementation pass. If the requested motion cannot fit the present thresholds:

1. Optimise and simplify first.
2. Keep dependencies out and write focused vanilla JavaScript.
3. If a small, justified adjustment remains necessary, document exact before/after byte totals and stop for owner approval before modifying the budget.

Animation should progressively enhance the server-rendered page. Do not introduce React, Vue, Svelte, Three.js, GSAP or another runtime in this pilot.

### 7. Content and visual rules

- Preserve the current editorial typography, spacing system and colour palette.
- Keep the treatment academic, contemporary and calm—not fashion advertising, a technology product landing page or a generic university portal.
- Use animation to explain relationships, not merely decorate the page.
- Do not invent publications, metrics, collaborators, project outcomes or institutional claims.
- Do not modify the current CV PDF.
- Do not pull content or assets from WordPress at runtime.
- Do not add tracking, analytics, external font services, CDNs or third-party embeds.

## Validation and review

Run all of the following before committing:

```sh
npm ci
npm run build
```

The build must retain all existing routes and pass content validation, internal link checks and the performance budget.

Also perform a visual review of the home page at the three viewport sizes above and verify:

- initial state before motion;
- motion in progress;
- finished state;
- reduced-motion state;
- keyboard navigation and focus;
- no-JavaScript/static fallback;
- image loading and layout stability;
- no console errors;
- direct navigation and browser back/forward behaviour.

If browser automation or screenshot tooling is available, save comparison screenshots as temporary review artifacts. Do not commit large review videos.

## Documentation

Add `ANIMATION_IMPLEMENTATION.md` summarising:

- what was implemented;
- which interaction ideas came from Hero 21 and Grid 7;
- what was independently rewritten;
- assets used and their provenance;
- dependencies added, ideally none;
- accessibility behaviour;
- mobile fallback;
- exact built CSS and JavaScript sizes;
- known limitations;
- items deliberately deferred, especially Scroll Animation 8 and Grid Animation 2.

Update `ASSET_REGISTER.md` only if an approved new asset is actually added. Do not mark an asset approved yourself when its status is uncertain.

## Git and delivery

Use logical commits, for example:

1. `feat: add lightweight network hero motion`
2. `feat: animate research formation grid`
3. `docs: document animation pilot and validation`

Before pushing, confirm:

- only intended files are changed;
- no videos, demo assets, credentials, caches, build output or `node_modules` are staged;
- `npm run build` passes from a clean dependency installation;
- the h-index remains 15;
- privacy-reviewed People content is unchanged;
- WordPress has not been modified.

Push only the branch `claude/animation-pilot`. Do not merge, force-push, run the production deployment workflow, change GitHub Pages settings, enable indexing, modify DNS, or alter `people.utm.my`.

Finish with a concise report containing:

- branch name and commit hashes;
- files changed;
- tests and visual checks performed;
- final asset/CSS/JavaScript sizes;
- screenshots or preview instructions;
- anything requiring the owner's decision;
- an explicit statement that production was not deployed.

## Deferred work — do not implement in this phase

- Scroll Animation 8: the supplied folder contains a preview but no matching source code.
- Grid Animation 2: promising for the Networked Intelligence concept, but its 3D/WebGL implementation is too heavy for this pilot.
- Other hero, grid and scroll animation packages.
- AnimMaster integration.
- Production deployment, indexing, DNS or WordPress cutover.

## Definition of done

This pilot is complete only when the home page has:

- a polished, lightweight Hero 21-inspired research-network reveal;
- a Grid 7-inspired research-theme formation;
- meaningful static fallbacks;
- reduced-motion and responsive behaviour;
- no regression to navigation, accessibility, content, privacy or existing routes;
- a passing production build within the approved performance budget;
- documentation sufficient for the owner to review before any merge or deployment.
