# Redesign audit — 14 October 2026

Both repositories were inspected before edits and started clean. Separate branches: `feat/academic-profile-redesign` and `feat/academic-portfolio-redesign`. Neither contains graphify-out/graph.json or a wiki, so no existing graph was available to query.

## Architecture and reusable work

The profile is one README with externally hosted decorative images, template text and an unrelated donation link. The portfolio uses Astro 7.3.2 static output, native components and JSON datasets: 13 content routes plus a 404. Reuse BaseLayout, Hero, PublicationExplorer, ResearchConstellation, native teaching details, all datasets and approved photographs. No React or new runtime dependencies are needed.

Reviewed README, package/config, page structures and global CSS, navigation/research datasets, publication explorer, migration/implementation/privacy/asset documentation and Pages workflow. Preserve deterministic data builders, asset allowlist, source snapshots and validators. Strengths: editorial typography, publication filters, native accordions, skip link, active navigation, reduced motion, intrinsic image sizes, canonical/social/Person metadata, sitemap and manual-only deployment. Dated metrics remain historical snapshots.

## Usability findings

- Profile lacks accurate academic positioning, research/projects/teaching; contains unrelated template content.
- Homepage introduces an abstract concept before academic identity; lacks hero collaboration CTA, repository showcase and teaching/publication entry section.
- Eight navigation links remain expanded until 700px, crowding intermediate widths. Escape moves focus even when the menu is closed.
- Research highlights lack links to projects/publications; contact omits GitHub.
- Orange small text and tinted surfaces need stronger contrast. Publication record controls are small arrows and filters have no reset.

## Design and planned files

Preserve editorial serif and research-network motif. Use navy hero, approved office photograph, cool-white reading surfaces, blue links, teal accents and restrained institutional maroon. Left-aligned two-column hero, grouped project cards and publication/teaching pathways. Avoid a generic dashboard. Retain all content/routes and reduced-motion behavior.

Expected edits: profile README; portfolio global CSS, BaseLayout, Hero, index/research/teaching/connect pages and PublicationExplorer; new ProjectCard/ProjectShowcase and project dataset; documentation and regression validation. Public repository READMEs inform descriptions; utm-agentic-ai-training contains only a heading and is omitted pending substantive evidence.

## Deployment, privacy and SEO risks

No DNS, WordPress, redirect, domain, indexing, workflow or deployment changes. No legacy imports, new student data or unapproved assets. Existing approved supervision names/programmes/roles remain; no progress data added. Asset use remains page-specific. No project screenshots are approved.

The known legacy DOI 10.14257/ijseia.2014.8.2.31 remains unresolved; do not invent a replacement. Portfolio links may be unavailable until deployment is separately approved. Publisher and LinkedIn automated requests may be access-controlled. Preserve noindex,nofollow and disallow-all robots. Repository descriptions establish scope, not production status.
