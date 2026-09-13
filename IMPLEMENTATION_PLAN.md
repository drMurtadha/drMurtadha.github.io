# Implementation plan

## Architecture

Astro generates a static site from versioned Markdown/JSON. Vanilla CSS and narrowly scoped JavaScript provide interaction. Component boundaries (`AnimationSlot`, hero network, research constellation, publication explorer) are present, but no AnimMaster code has been imported.

The visual idea is an academic field guide to connected intelligence: warm paper, deep research green, restrained signal orange, generous typography and visible relationships between themes. UTM ASCEND 2030 appears as an institutional context and impact frame, not as a corporate portal template.

## Phases

### 1. Audit and safe foundation — substantially complete

- Capture public posts, pages, media metadata and taxonomies.
- Inventory canonicals, internal/external links and researcher identifiers.
- Reconstruct current navigation from fresh HTML.
- Establish static Astro starter, content schemas, scripts, validation and CI.
- Keep deployment manual and indexing disabled.

### 2. Privacy and editorial triage — required next

- Owner reviews the remaining PDFs and any people/student content; the latest CV is approved separately.
- Classify every item: migrate, archive privately, link to source, merge, or omit.
- Apply the confirmed decision to exclude all 5,249 legacy posts; keep only their audit records and add no replacement routes.
- Import the 13 current/newly rebuilt pages and exclude the 23 remaining legacy pages.
- Confirm current biography, position, contact details and navigation.

### 3. Structured import

- Add HTML-to-Markdown conversion with sanitisation and deterministic filenames.
- Reconcile Scopus/WoS/DOI records into one publication dataset; retain “as of” dates for mutable metrics.
- Download only approved first-party media, verify checksums and produce accessible alternatives.
- Generate all approved legacy routes and a redirect/canonical manifest.

Current progress: all 13 approved page records are now stored as static build data. Twelve routes are generated because the earlier 2026 `publications` page is consolidated into the newer Scopus route. WordPress wrappers/scripts and the homepage post feed are removed. Five owner-provided photographs and the latest 46-page CV are local static assets; unapproved media is represented by review placeholders.

### 4. Experience layer

- Implement research constellation progressively: semantic list first, enhancement second.
- Add publication filters without a heavy framework.
- Add project/people/impact relationships and reduced-motion support.
- Introduce AnimMaster only after content structure, performance budget and accessibility acceptance criteria are stable.

Current progress: the homepage is now a native Astro composition rather than imported WordPress HTML. It includes the approved office and supervision photographs, a static semantic research constellation inside the reserved animation boundary, selected research narratives, a people/supervision feature, and a restrained UTM ASCEND 2030 institutional layer. Scopus metrics are held centrally in `src/data/academic-profile.json`; the owner-verified snapshot is 81 documents, 885 citations and h-index 15 as at 13 September 2026.

Research, Publications, People and CV are now native Astro pages as well. The Publications explorer exposes 79 detailed records with title/venue search and year filtering while stating the separate 81-document live profile total. People data is generated from the approved current page into explicit current-PhD, current-Master's and graduate collections. All four pages have responsive, semantic layouts; the research visual remains static inside its future animation boundary.

The remaining Biography, Teaching, Impact, Connect and publication-collection routes have also been rebuilt as native Astro. Teaching exposes 12 course histories with accessible expandable tables. Web of Science, other verified and non-indexed collections contain 35, 40 and 5 structured records respectively. The catch-all imported-HTML renderer has been removed from public routing; imported records remain evidence and deterministic data sources only.

### 5. Verification and preview

- Run schema validation, static build, local link checks and sampled/rate-limited external checks.
- Test keyboard use, reduced motion, screen-reader landmarks, mobile layouts and Lighthouse budgets.
- Create/authenticate the GitHub repository only with explicit approval; publish a noindex preview by manual workflow.

### 6. Approved cutover

- Freeze/snapshot WordPress, rerun delta import and validate counts.
- Arrange old-host redirects/canonicals with UTM administrators.
- Set `PUBLIC_SITE_INDEXABLE=true`, change `robots.txt` to allow crawling, and submit the new sitemap.
- Keep People@UTM available until redirect and search-console evidence is satisfactory.

## Definition of done for Phase 1

- [x] Full REST enumeration of public content/taxonomies
- [x] Content, link, PDF and URL mapping inventories
- [x] Relevant API map and menu reconstruction
- [x] Astro starter and component boundaries
- [x] Import/audit, content validation and local link-check scripts
- [x] GitHub Pages build workflow with manual-only deploy
- [x] GitHub repository existence check
- [x] Rate-limited external-link checker and a small persistent-research-link sample
- [ ] Full external-link HTTP status crawl (deferred; 59k unique pairs require domain deduplication, exclusions and rate limits)
- [ ] Two missing media records reconciled
- [ ] Remaining owner privacy/editorial decisions for pages and media
- [x] Owner decision recorded: all 5,249 legacy posts excluded from publication
- [x] Owner decision recorded: migrate 13 current pages; exclude 23 legacy pages
- [x] Import and sanitise 13 approved page records into 12 static routes
- [x] Enforce build-time guards against posts, unapproved pages and WordPress media dependencies
- [x] Integrate five approved photographs and the latest CV through a strict asset allowlist
- [x] Desktop and 390 px mobile visual QA for Home and Publications; navigation wrap corrected; no browser console errors
- [x] Build native Astro homepage and verify it at desktop and 390 px widths with no horizontal overflow
- [x] Centralise owner-verified Scopus metrics (81 documents, 885 citations, h-index 15)
- [x] Convert Research, Publications, People and CV to native Astro pages
- [x] Add deterministic publication and supervision data builders with count validation
- [x] Verify publication search, year filtering and empty-result behaviour in the browser
- [x] Convert all remaining public routes to native Astro and remove the catch-all imported-HTML route
- [x] Structure 12 teaching subjects and the 35/40/5 secondary publication collections
- [x] Run desktop and 390 px browser QA across all 12 routes with no console errors or horizontal overflow
- [ ] GitHub authentication/repository creation
