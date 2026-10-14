# Implementation report

Date: 14 October 2026
Branches: `feat/academic-profile-redesign` (profile), `feat/academic-portfolio-redesign` (portfolio)
State: implemented and verified locally, **uncommitted and unpushed**.

Work was carried out in two sessions. GPT Astra/Codex produced the audit and the bulk of the
implementation; Claude Code resumed from the uncommitted working tree, verified it, fixed three
defects found during verification, and wrote the Phase 8 documentation. Nothing from the earlier
session was reverted or rewritten.

## Profile — `drMurtadha/drMurtadha`

`README.md` replaced the Profilinator template with an academic identity document.

Removed: the hotlinked greeting GIF, the sample Spotify artwork, the four `shields.io` social
badges, the blog-post placeholder, the page-view counter, the Buy Me a Coffee link that pointed
at `rishavanand` rather than the owner, and the template attribution footer.

Added: academic identity (Associate Professor, Faculty of Computing, UTM), the seven stated
research interests, a two-row research-project table, selected technical projects, teaching and
learning resources, publication and research-profile links, professional engagement, and contact
routes. The README is plain Markdown with no HTML, no images and no external badge services, so
it does not depend on third-party uptime.

Net change: 38 insertions, 48 deletions. All 18 external links verified reachable (see
`TEST_REPORT.md`).

A closing note states that institutional affiliation does not imply endorsement of individual
projects.

## Portfolio — `drMurtadha/drMurtadha.github.io`

Enhancement of the existing Astro 7.3.2 site. No framework migration, no new dependencies, no
route changes. All 13 approved routes plus the 404 still build.

### New files
- `src/components/ProjectCard.astro` — reusable repository card.
- `src/components/ProjectShowcase.astro` — grouped card section, filtered by `group`.
- `src/data/projects.json` — six repositories with status, summary, technologies, URL, and a
  `source`/`verifiedAt` pair recording where each description came from.
- `AUDIT_REPORT.md` — Phase 0 deliverable.
- `audit/generated/redesign-external-links.json` — external link sweep output.

`utm-agentic-ai-training` was deliberately omitted: the repository currently contains only a
heading, and there is no substantive content to describe honestly.

### Modified files
- `src/components/Hero.astro` — academic positioning first. The abstract line "Intelligence is
  not isolated. It is connected." was replaced by the role eyebrow, "Research for a connected
  world.", the owner's name, and a concrete research summary. A second "Discuss a collaboration"
  CTA was added next to "Explore the research". The approved office photograph is reused
  unchanged.
- `src/components/PublicationExplorer.astro` — "Clear filters" reset, linked record titles,
  `?q=` deep-link support, improved empty state.
- `src/components/ResearchConstellation.astro` — eyebrow and heading wrapped in a `<div>` so the
  heading occupies the wide grid column (defect fix, below).
- `src/layouts/BaseLayout.astro` — GitHub and LinkedIn added to the `Person` `sameAs` array;
  theme colour updated to the new navy; footer institutional line rewritten to state that this
  is a personal portfolio and that affiliation does not imply endorsement; Escape key no longer
  moves focus when the mobile menu is already closed.
- `src/pages/index.astro` — `ProjectShowcase` added, an in-page section nav, a publications and
  teaching pathway section, and the three story cards linked to their related research and
  pre-filtered publication views.
- `src/pages/research.astro`, `src/pages/teaching.astro` — `ProjectShowcase` added, filtered to
  `Research` and `Learning` respectively.
- `src/pages/connect.astro` — GitHub added as a contact route.
- `src/styles/global.css` — palette retune, typography adjustments, responsive breakpoint move,
  and the new component and accessibility rules. See `DESIGN_SYSTEM.md`.
- `.gitignore` — `graphify-out/` added. This is a local code-graph tool artifact (43 files,
  664 KB) that was never project content and should not enter the repository.

## Defects found and fixed during verification

Three issues were found by inspecting the running site rather than by reading the diff.

**1. Section heading overflowed the viewport.** `.section-heading` is a two-column grid.
`ResearchConstellation.astro` passed three direct children, so auto-placement put the `<h2>` in
the narrow right column, where "environments." ran past the right edge and was clipped by
`main { overflow: clip }`. Confirmed **pre-existing on the deployed `main` site**, not a
redesign regression. Fixed by wrapping eyebrow and heading in a `<div>`, matching the pattern
already used by `index.astro` and `ProjectShowcase.astro`.

**2. Accent text failed contrast on five dark and blue surfaces.** This one *was* a regression.
The original palette used orange `--signal` and muted gold `--gold`, both readable on dark
forest green. Retuning `--signal` to a mid blue and `--gold` to a light teal left accent spans
at 1.50:1 to 3.95:1 against navy, blue and paper backgrounds — on the home, research, impact and
CV pages. Fixed with three scoped rules implementing the accent-on-surface policy now documented
in `DESIGN_SYSTEM.md`.

**3. Standalone links below minimum tap-target size.** `.text-link`, `.cv-links a`,
`.record-note a` and the home-page email CTA rendered 19–22px tall. These are standalone
controls, not inline prose links, so the WCAG 2.5.8 inline exception does not apply. Given a
44px policy was already being applied to navigation links, buttons and the filter reset, the
same minimum was extended to these four selectors for consistency.

## Safeguards confirmed intact

No change to the domain, routes, redirect policy, deployment workflow, DNS or WordPress. No
legacy posts imported, no quarantined images reintroduced, no student data added. `noindex,
nofollow` verified present on all 13 routes in the built output, and the robots disallow is
unchanged. All validation scripts remain in `package.json` and all of them pass. No deployment
was triggered.

## Open item for the owner

The home page `<title>` is still "Networked Intelligence", while the redesigned hero now leads
with academic identity. This is a positioning decision, not a defect, so it was left alone. If
you want the browser tab and search snippet to match the new hero, say so and it is a one-line
change in `src/pages/index.astro`.
