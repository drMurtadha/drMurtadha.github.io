# Test report

Date: 14 October 2026
Environment: macOS (Darwin 25.6.0), Node v25.8.2, npm 11.12.1
Target: `feat/academic-portfolio-redesign` working tree, and `feat/academic-profile-redesign` README.

All results below were observed in this session. Where something was not tested, it says so.

## 1. Build and project validations — PASS

`npm run build` runs the full chain: `validate → astro build → validate:build → check:links →
check:budget`. Run twice, before and after the defect fixes. Both green.

```
Content validation passed (13 approved pages; legacy posts excluded).
14 page(s) built in 348ms
Validated 14 static outputs, metadata, landmarks and images.
Checked 14 HTML files; local links resolved.
Performance budget passed: 35.4 KiB CSS, 0.0 KiB external JS, 1.3 KiB maximum inline JS per page.
```

CSS grew from 35.1 KiB to 35.4 KiB across the fixes. External JavaScript stays at 0 KiB.

`git diff --check` is clean in both repositories (no whitespace errors, no conflict markers).

## 2. Responsive layout — PASS

48 probes: 12 routes × 4 viewport widths (390, 768, 1024, 1280 px), each page loaded in a sized
iframe and measured for horizontal overflow.

- Horizontal overflow: **0 of 48**. `scrollWidth` equals `clientWidth` at every width.
- Navigation toggle appears on 12/12 routes at 390, 768 and 1024 px, and on 0/12 at 1280 px,
  confirming the breakpoint move from 700px to 1100px works as intended.

Before the fix, the research-constellation heading overflowed the right edge at desktop widths
on both the local build and the deployed `main` site.

## 3. Colour contrast — PASS

Computed contrast ratios for every text-bearing element against its nearest opaque background,
across 13 routes × 2 widths (390 and 1280 px) = 26 page probes. Thresholds: 4.5:1 for body text,
3:1 for large text (≥24px, or ≥18.66px at weight ≥700).

- Failures before fix: 5 (ratios 1.50:1, 1.83:1 ×2, 3.95:1 ×2) on `/`, `/research/`, `/impact/`
  and `/cv/`.
- Failures after fix: **0**.

## 4. Tap targets — PASS

Measured every `a[href]`, `button`, `input`, `select` and `summary` at 390px across 8 routes,
excluding links sitting inline inside a sentence (WCAG 2.5.8 inline exception).

- Standalone controls under 24px before fix: 9 across 8 routes.
- After fix: **0**.

Remaining sub-24px links are inline prose links in the footer sentence and in body copy, which
are exempt.

## 5. Keyboard and mobile navigation — PASS

Functional test of the menu at 390px:

| Check | Result |
| --- | --- |
| Toggle visible at 390px | yes |
| Click opens menu (`aria-expanded=true`, panel height 218px) | pass |
| Escape while open closes menu and returns focus to toggle | pass |
| Escape while **closed** does not steal focus | pass |
| Clicking a nav link closes the menu | pass |

The last row is the audit finding "Escape moves focus even when the menu is closed", confirmed
fixed.

## 6. Semantics, metadata and privacy — PASS

Across all 13 routes:

- Exactly one `<h1>` per page; no skipped heading levels.
- Every `<img>` has an `alt` attribute and explicit `width`/`height` (no layout shift).
- Skip link to `#main` present; exactly one `<main>` landmark; `lang` set.
- Canonical URL present on every page.
- **`<meta name="robots" content="noindex,nofollow">` on all 13 routes.** The indexing
  safeguard is intact.
- Three `prefers-reduced-motion` blocks present in the shipped CSS.

Browser console across page loads and 70+ iframe probes: no errors, no warnings. Only Vite HMR
debug output from the dev server.

## 7. Publication explorer — PASS

| Case | Visible of 79 | Counter |
| --- | --- | --- |
| `/publications/` | 79 | 79 |
| `/publications/?q=underwater` | 7 | 7 |
| `/publications/?q=routing` | 11 | 11 |

The home-page story cards deep-link into these filtered views and resolve correctly.

## 8. External links

### Profile README — 18 links, all resolve

All six `drmurtadha.github.io` routes return 200 (the site is already live from `main`), all
seven GitHub repository links return 200, ORCID 200, `people.utm.my/murtadha/` 200, Web of
Science 200. LinkedIn returns 999 and Scopus returns a 307 to a bot gate; both are
bot-protection responses, not broken links, and both resolve in a normal browser.

### Portfolio site — 121 links swept

From `audit/generated/redesign-external-links.json` (scope: site, against `dist`):

| Classification | Count |
| --- | --- |
| reachable | 97 |
| timeout | 10 |
| access-controlled (403) | 8 |
| transport-error | 5 |
| broken (404) | 1 |

The ten timeouts and eight 403s are Scopus, Web of Science, LinkedIn and publisher DOI
resolvers refusing automated requests. They are not evidence of broken links.

**One genuine failure:** `https://doi.org/10.14257/ijseia.2014.8.2.31` returns 404. This is the
known legacy DOI already recorded in `AUDIT_REPORT.md`. It has **not** been replaced or removed,
because inventing a substitute DOI would be worse than leaving an honest broken reference. This
needs the owner to supply the correct identifier or confirm the record should be delisted.

## 9. Not tested

- **Real device testing.** Responsive behaviour was measured via sized iframes in desktop
  Chrome, not on physical phones or tablets. Touch behaviour, iOS Safari viewport quirks and
  real-device font rendering are unverified.
- **Screen reader.** No VoiceOver/NVDA pass was run. Semantic structure, landmarks, labels and
  focus order were verified programmatically, which is not the same thing.
- **Production deployment.** Nothing was deployed. The GitHub Pages workflow was not run.
- **Browsers other than Chrome.** No Safari or Firefox pass.
- **`npm ci`.** Not run; the existing `node_modules` was used, matching `package-lock.json`.
  Worth running once on a clean checkout before any deployment.
