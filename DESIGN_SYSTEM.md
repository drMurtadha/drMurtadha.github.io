# Design system — Academic Intelligence

Status: implemented, uncommitted on `feat/academic-portfolio-redesign`. Last verified 14 October 2026.

This records the design decisions actually present in `src/styles/global.css`. It documents the
system as built, not an aspiration. The redesign layers an enhancement block at the end of
`global.css` over the original editorial stylesheet rather than rewriting it, so the existing
cascade, component classes and reduced-motion behaviour stay intact.

## Palette

The original forest-green and orange palette was retuned to the navy and blue direction set in
`CODEX_INSTRUCTIONS.md`, keeping the same token names so every existing rule continues to work.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#142338` | Primary text |
| `--muted` | `#526277` | Secondary text |
| `--paper` | `#f5f7fa` | Page background |
| `--surface` | `#ffffff` | Card and panel surfaces |
| `--forest` | `#183b59` | Mid navy panels |
| `--forest-deep` | `#0b1220` | Hero and deep navy sections |
| `--signal` | `#175eb5` | Links, accents on light surfaces |
| `--gold` | `#70ded0` | Accents on dark surfaces |
| `--line` | `#cbd5e1` | Borders and rules |
| `--accent` | `#147d75` | Project-card top rule, hover borders |
| `--focus` | `#175eb5` | Focus ring |

Tinted surfaces moved from `#dce2db` to `#e7edf4` so tint panels sit in the same cool family.
The top page rule uses institutional maroon `#6b233d` and teal `#147d75` at either end of a deep
navy bar, a restrained nod to UTM branding without implying endorsement.

### Accent-on-surface rule

Accent text must be chosen for the surface it sits on. This is enforced explicitly because the
palette change silently broke it in five places:

- On paper or white surfaces, use `--signal` (blue).
- On navy surfaces (`--forest`, `--forest-deep`), use `--gold` (teal).
- On a `--signal` blue surface, use white.

All text in the shipped build meets WCAG AA (4.5:1 body, 3:1 large). See `TEST_REPORT.md`.

## Typography

- Body: `"Avenir Next"`, then `ui-sans-serif`/system stack. No web fonts are loaded, so there is
  no font-loading cost or layout shift.
- Headings: Georgia serif, retained from the original editorial voice.
- Heading line-height relaxed from `.98` to `1.08`. The original setting clipped descenders on
  multi-line serif headings.
- Scale: `h1` `clamp(3.3rem, 7.5vw, 7.2rem)`, `h2` `clamp(2.65rem, 5.8vw, 5.5rem)`,
  `h3` `clamp(1.55rem, 2.4vw, 2.35rem)`. The home hero overrides `h1` to
  `clamp(3rem, 5.2vw, 5.5rem)` so the academic positioning line fits two lines at desktop.
- Eyebrows are no longer uppercased with wide tracking. Uppercase plus `.16em` tracking hurt
  legibility at 11px; sentence case at `.04em` reads better and keeps proper nouns correct
  ("Associate Professor · Faculty of Computing, UTM").

## Spacing and layout

- Spacing tokens: `--space-1` `.5rem` through `--space-6` `3rem`; `--radius` `.6rem`.
- Page width: `--page` `82rem`.
- Section rhythm: `clamp(5rem, 10vw, 9rem)` vertical, `2rem` horizontal gutter.
- `.section-heading` is a two-column grid: the left column carries the eyebrow and heading
  **wrapped in a single `<div>`**, the right column carries the supporting paragraph. Passing
  three direct children places the heading into the narrow right column, where long words
  overflow the viewport. Always wrap eyebrow + heading together.

## Components

### Buttons
`.button` is the primary action: 48px minimum height, `.35rem` radius, solid `--signal` fill on
dark surfaces. `.button--secondary` is an outlined variant used for the second hero CTA.

### Project card (new)
`ProjectCard.astro` renders one repository: status line, linked title, summary, topic/technology
tags and a "View repository" link. A 3px `--accent` top rule distinguishes it from the existing
editorial story cards. `ProjectShowcase.astro` groups cards by the `group` field in
`src/data/projects.json` (`Research`, `Technical`, `Learning`) and is reused on the home,
research and teaching pages.

Every card states its actual scope ("Research documents", "Research framework", "Interactive
manual") rather than implying a deployed product. Descriptions are drawn from each repository's
own README and carry a `source` and `verifiedAt` field in the dataset.

### Publication explorer
Adds a "Clear filters" reset, linked record titles, a `?q=` deep-link parameter so other pages
can route into a pre-filtered view, and a more helpful empty state. The circular 44px open-record
control replaces a bare arrow glyph.

### Section nav
A light in-page jump bar on the home page linking the three main sections. Plain links, no
scroll-spy JavaScript.

## Interaction and motion

- `:focus-visible` shows a 3px `--focus` outline at 5px offset; on dark surfaces it switches to
  `--gold` for contrast.
- All interactive targets that are not inline links in a sentence are at least 44px in the
  smaller dimension. Inline prose links are exempt under WCAG 2.5.8.
- Transitions are limited to background and border colour at `.18s`, wrapped in
  `@media (prefers-reduced-motion: no-preference)`.
- The pre-existing hero network motion and research formation grid are untouched, including
  their reduced-motion guards. Three `prefers-reduced-motion` blocks remain in the build.

## Responsive behaviour

The primary navigation breakpoint moved from 700px to 1100px. Eight navigation links stayed
expanded down to 700px and crowded the header at tablet and small-laptop widths; the toggle now
appears at or below 1100px.

At 700px and below: project grid and academic pathways collapse to one column, publication tools
become static two-column, and the publication list drops its index column.

Verified at 390px, 768px, 1024px and 1280px across all 13 routes with no horizontal overflow.

## Constraints kept

No React, no new runtime dependencies, no web fonts. External JavaScript stays at 0 KiB and
inline JavaScript at a maximum of 1.3 KiB per page. Total CSS is 35.4 KiB, within the existing
performance budget.
