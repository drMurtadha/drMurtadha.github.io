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

- Owner reviews all 80 PDFs and any people/student content.
- Classify every item: migrate, archive privately, link to source, merge, or omit.
- Decide whether the 5,249-post social/news stream should be preserved publicly, kept only as URL stubs, or excluded with an archival record.
- Confirm current biography, position, contact details and navigation.

### 3. Structured import

- Add HTML-to-Markdown conversion with sanitisation and deterministic filenames.
- Reconcile Scopus/WoS/DOI records into one publication dataset; retain “as of” dates for mutable metrics.
- Download only approved first-party media, verify checksums and produce accessible alternatives.
- Generate all approved legacy routes and a redirect/canonical manifest.

### 4. Experience layer

- Implement research constellation progressively: semantic list first, enhancement second.
- Add publication filters without a heavy framework.
- Add project/people/impact relationships and reduced-motion support.
- Introduce AnimMaster only after content structure, performance budget and accessibility acceptance criteria are stable.

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
- [ ] Owner privacy/editorial decisions
- [ ] GitHub authentication/repository creation
