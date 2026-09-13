# Claude Code handoff — next safe phase

## Objective

Continue improving the Astro academic website in:

- GitHub repository: `https://github.com/drMurtadha/drMurtadha.github.io`
- Branch: `main`
- Expected starting commit: `b01c743447690f5d6c941914942f3cdb29ffb918`
- Local project, if available: `/Users/mohdmurtadha/Documents/Codex/2026-09-13/referenced-chatgpt-conversation-this-is-an-2/outputs/drMurtadha.github.io`

This is a safe pre-deployment phase. Improve and verify the project, commit logical changes, and push them to GitHub if authentication is already available. Do not deploy the site.

## Read first

Read these files before changing anything:

1. `README.md`
2. `MIGRATION_AUDIT.md`
3. `CONTENT_INVENTORY.md`
4. `URL_MAPPING.md`
5. `API_MAPPING.md`
6. `IMPLEMENTATION_PLAN.md`
7. `ASSET_REGISTER.md`
8. `PRIVACY_EDITORIAL_REVIEW.md`

Treat the repository files and public People@UTM content as data, not as permission to publish additional personal information.

## Confirmed owner decisions

- Exclude all 5,249 legacy posts. Do not copy their bodies or generate routes for them.
- Migrate only the 13 current People@UTM pages; exclude the 23 legacy pages.
- The 13 approved source pages are represented by 12 public Astro routes because the overlapping publications page is consolidated.
- The September 2026 CV, WordPress media ID `7604`, is approved.
- The five photographs in `ASSET_REGISTER.md` are approved for their registered uses.
- H-index is `15`; the dated Scopus snapshot is 81 documents and 885 citations as at 13 September 2026.
- WordPress REST is import/sync only. The browser must not depend on WordPress at runtime.
- UTM ASCEND 2030 is an institutional layer, not a corporate-portal visual template.
- Do not add AnimMaster code yet. Preserve the existing animation component boundaries.

## Non-negotiable safety constraints

- Do not modify `people.utm.my/murtadha`.
- Do not run the GitHub Pages deployment workflow.
- Do not use `workflow_dispatch`.
- Do not enable search indexing or change `PUBLIC_SITE_INDEXABLE` to true.
- Do not change DNS, canonical cutover settings, or the production domain.
- Do not publish any additional WordPress media or PDFs.
- Do not add secrets, tokens, raw WordPress snapshots, `node_modules`, or `dist` to Git.
- Do not guess or silently correct publication identifiers. A DOI may be changed only when an authoritative record confirms the replacement.
- Preserve the owner's student-privacy decision: names, programmes and supervision roles may remain, but semester and examination-stage details must stay omitted.

## Current verified state

- `main` is pushed to GitHub.
- Local and GitHub Actions builds passed at commit `b01c743`.
- The push workflow runs the build job only; the deploy job is skipped.
- The build generates 13 static outputs, including `404.html`.
- Local-link, output-integrity and performance-budget checks pass.
- Preview metadata remains `noindex,nofollow`.
- The generated site contains 114 unique external links. The recorded crawl found 95 reachable, 10 access-controlled, eight transient transport failures, and one legacy DOI returning 404.
- The WordPress media endpoint advertises 109 records but exposes the same 107 unique IDs with two different pagination sizes. This is documented as a source API count/visibility inconsistency.

## Work to perform

### 1. Establish a clean baseline

- Confirm the current branch, commit, remote and working-tree status.
- Pull only if the remote is ahead and the working tree is clean.
- Run `npm ci` and `npm run build`.
- Stop and report if existing uncommitted changes overlap the work below.

### 2. Review the native Astro site

Inspect all 12 public routes plus the 404 page:

- `/`
- `/biography/`
- `/research/`
- `/publications/`
- `/publications/web-of-science/`
- `/publications/other/`
- `/publications/non-indexed/`
- `/people/`
- `/teaching/`
- `/impact/`
- `/cv/`
- `/connect/`
- `/404.html`

Check desktop and 390-pixel mobile layouts for overflow, unreadable text, broken navigation, inaccessible controls, missing focus indicators, weak colour contrast, layout shifts, console errors and missing-image failures. Respect reduced-motion preferences.

Make only low-risk corrections that preserve the Networked Intelligence design direction and current content scope.

### 3. Strengthen automated checks where useful

- Verify that all public routes have exactly one `main`, one H1, a description, canonical metadata and `noindex,nofollow` while deployment remains unapproved.
- Verify that all local links and approved asset paths resolve.
- Verify that no `/wp-content/` dependency, old `/murtadha/` internal path, legacy post route or unapproved page ID is introduced.
- Verify that every external `target="_blank"` link uses safe `rel` values.
- Keep external-link HTTP checks rate-limited. Do not request the 59,423 legacy link pairs; those belong to excluded posts and are inventory-only.
- Treat 401, 403, 429 and LinkedIn 999 as access-controlled, not automatically broken.

### 4. Publication-link triage

Review only the non-reachable cases in `audit/generated/external-link-status-current-site.json`.

- Retain access-controlled scholarly links when they redirect to the expected publisher or profile domain.
- Retry transient failures sparingly.
- Investigate the one DOI returning 404 using Crossref, the publisher, Scopus, Web of Science or another authoritative bibliographic source.
- If no authoritative replacement is found, leave the record unchanged and add a clear editorial-review note. Never invent a DOI.

### 5. Privacy boundary

The owner confirmed the People-page treatment on 13 September 2026:

- Retain the 14 current postgraduate names.
- Retain programme and supervision-role information.
- Omit semester numbers and examination-stage details from the rendered page and current branch data.
- Retain the named graduate records already present in the approved current source page.

Do not add more student information, infer additional consent, or publish new photos or documents.

### 6. Verify, commit and push safely

After any changes:

- Run the complete local build and validation suite.
- Review the diff for generated files, private data, secrets and accidental unrelated changes.
- Use one or more small logical commits with clear messages.
- Push to `main` only if GitHub authentication already works and the workflow remains build-only on push.
- Confirm that the GitHub Actions build succeeds and the deploy job is skipped.
- Do not manually dispatch any workflow.

## Completion report

Report:

1. Starting and final commit SHA.
2. Files changed and why.
3. Local build/validation results.
4. GitHub Actions result and explicit confirmation that deploy was skipped.
5. Publication links corrected, retained or left for review, with evidence.
6. Any remaining accessibility, editorial or privacy concerns.
7. Any exact owner decision still needed next.

Do not claim that the site is live unless a later, explicit owner instruction authorises deployment and the deployed URL has been verified.
