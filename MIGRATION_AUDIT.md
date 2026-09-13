# Migration audit

Audit date: 13 September 2026 (Asia/Kuala_Lumpur)  
Source: `https://people.utm.my/murtadha`  
Method: public HTML, response headers, WordPress REST API and robots/sitemap discovery. No source changes were made.

## Executive findings

The WordPress subsite is reachable and its public REST API is suitable as an **import/sync source**, but not as a runtime dependency. The snapshot contains 5,249 published posts and 36 published pages. Most posts are concentrated in 2016–2017 and appear to be social/news imports rather than core academic material. A faithful archive and a curated public academic experience should therefore be treated as separate layers.

The strongest migration risk is not technical. The media library includes PDFs whose titles suggest student marks, forms, certificates, viva records and administrative material. Nothing in the media library should be bulk-published to GitHub until privacy, ownership and copyright checks are complete.

**Owner decision, 13 September 2026:** all 5,249 legacy posts are excluded from publication on the new site. They remain in the inventory only. This removes the social/news corpus from the implementation scope, including its category and tag archive pages.

**Owner decision, 13 September 2026:** migrate only the current People@UTM pages. The working set contains eight pages created in August–September 2026 plus five older-ID pages substantially refreshed in September 2026 and used by the current navigation. Thirteen pages are retained and 23 legacy pages are excluded. The retained `publications` page is flagged for consolidation because newer dedicated Scopus/WoS pages overlap it.

## Approved-page import status

The 13 approved source pages have been imported into static local JSON records. They generate 12 routes: Home plus Biography, Research, People, Teaching, Impact, CV, Connect, Scopus publications, Web of Science publications, Other publications and Non-indexed publications. The older overlapping 2026 `publications` source is retained for reconciliation but does not create a duplicate route.

The importer removes WordPress/theme wrappers, scripts, the homepage post-query block and preserved legacy-overview sections. Five owner-provided photographs and the newest audited CV (media ID 7604) are mapped to local allowlisted files. All other image and download references become review placeholders, leaving no runtime `/wp-content/` dependency. The source-note link back to People@UTM remains a normal external citation, not a content/API dependency.

## Counts captured

| Object | REST total | Retrieved | Notes |
|---|---:|---:|---|
| Posts | 5,249 | 5,249 | All returned as `publish` |
| Pages | 36 | 36 | All returned as `publish` |
| Media | 109 advertised | 107 visible | Repeated with page sizes 100 and 50; both return the same 107 unique IDs. This is a source-side count/visibility inconsistency, not migration pagination loss. |
| PDFs | — | 80 | Subset of retrieved media; privacy review required |
| Categories | 713 | 713 | `Other` contains 5,244 posts |
| Tags | 3,377 | 3,377 | High-cardinality social/news taxonomy |
| Unique content links | — | 59,423 | Inventory, not a claim that all destinations are healthy |
| Research/profile links | — | 217 | DOI, ORCID, Scopus, ResearcherID/WoS patterns |

Post date range: 4 October 2012 to 23 August 2026. Year distribution is dominated by 4,367 posts in 2016 and 802 in 2017. At least 4,441 posts contain Twitter/IFTTT-related patterns.

## Current information architecture

The fresh homepage HTML exposes a custom navigation even though the authenticated WordPress menu endpoints return `401`:

- Research → `/research-areasinterest/`
- Publications → `/scopus-indexed-publications/`
- People → `/phd-students/`
- Teaching → `/teaching/`
- Impact → `/consultancy-industry-engagement/`
- About → `/biography/`
- Secondary: CV, social/connect, ORCID `0000-0002-1478-0138`, Scopus author `16033644000`

The public API reports relevant menu routes, but `/wp/v2/menus`, `/wp/v2/menu-items` and `/wp/v2/menu-locations` require authentication. The reconstructed menu is stored in `src/data/navigation.json` and must be confirmed by the owner.

## Metadata and canonical behaviour

- Homepage responds HTTP 200 and advertises the REST API and page JSON alternate.
- Current homepage canonical is `https://people.utm.my/murtadha/`.
- Open Graph and Twitter metadata are present, but the generated description includes navigation/skip-link text and should be replaced with editorial metadata.
- Page/post inventory records Yoast canonical values when exposed, falling back to the WordPress permalink.
- The root WordPress sitemap is network-wide (`people.utm.my`), not a clean subsite-only inventory. REST enumeration is the more reliable source for this migration.
- `robots.txt` allows public content, blocks `/wp-admin/`, permits `admin-ajax.php`, and points to the network sitemap.

## Risks and controls

| Risk | Impact | Control |
|---|---|---|
| Sensitive or student-related PDFs | Privacy/data exposure | Quarantine all unapproved media; owner review before copying |
| Republishing third-party news/social content | Copyright and relevance | Archive inventory; do not feature by default; review retention policy |
| 59k links include stale shorteners/embeds | Broken experience/security | Deduplicate, classify, then rate-limited status validation |
| Canonical duplication during parallel run | SEO dilution | Preview stays `noindex`; switch canonicals only at approved cutover |
| WordPress menu API requires auth | Incomplete hierarchy | Reconstruct from live HTML and confirm manually |
| REST total/retrieval media mismatch | Missing two records | Retry snapshot and compare IDs before media freeze |

## External-link sample

A deliberately small, rate-limited check covered the first 15 unique research/profile destinations. ORCID and several Springer/PLOS DOI resolutions returned `200`; IEEE DOI resolutions returned `202` with valid IEEE Xplore destinations. Scopus and several publisher sites returned `403` after redirecting to their expected domains, which indicates bot/access control rather than a proven broken link. One DOI request failed at transport level and needs a later retry. Results are stored in `audit/generated/external-link-status.json`; HTTP status alone must not be used to delete scholarly links.

## Generated-site external-link crawl

After the native Astro routes were built, every unique external anchor in the generated site was checked with a rate limit. The run covered all 114 links: 95 were reachable, 10 were access-controlled (including LinkedIn's bot-blocking status `999`), eight had transient transport failures, and one old DOI returned `404`. Access controls and transport failures are review states rather than proof of a broken scholarly record. The complete dated evidence is stored in `audit/generated/external-link-status-current-site.json`.

The 59,423 legacy source/link pairs remain inventoried rather than requested over HTTP. They belong overwhelmingly to the 5,249 excluded posts; issuing tens of thousands of requests would add load without affecting the approved static site.

### Broken-DOI investigation (13 September 2026)

The one `broken` result, `https://doi.org/10.14257/ijseia.2014.8.2.31` ("Wireless LAN/FM radio-based robust mobile indoor positioning: An initial outcome", *International Journal of Software Engineering and Its Applications*, 2014), was checked against Crossref: a direct lookup of the DOI returns `404` (not registered with Crossref), and a Crossref bibliographic search on the exact title returns no matching record under any DOI. This pattern is consistent with a known publisher-side (SERSC) DOI registration/resolution gap rather than a transcription error in this repository. No authoritative replacement DOI was found, so the record in `src/data/publications.json` is left unchanged; the title/venue/year citation remains the public record of the work. This stays an open editorial-review item for the owner, not an automatically "fixed" link.

## GitHub status

The public repository `drMurtadha/drMurtadha.github.io` was created and `main` was pushed at commit `9f226eab252f399939c01bdcbdcff09844bf9739`. GitHub Actions completed the build successfully and skipped deployment as designed. The special repository name causes GitHub to attach a Pages source configuration automatically, but no Pages artifact has been deployed and the site remains unavailable. Indexing, DNS and People@UTM are unchanged.

## Evidence files

- `audit/generated/content-inventory.csv` — every retrieved post/page with metadata and link counts
- `audit/generated/url-mapping.csv` — initial legacy-to-target path mapping
- `audit/generated/links.csv` — deduplicated source/link pairs
- `audit/generated/pages.json` — page-focused inventory
- `audit/generated/pdfs.json` — PDF media list
- `audit/generated/audit-summary.json` — machine-readable aggregate and research links
- `audit/generated/external-link-status.json` — rate-limited 15-link research/profile sample
- `audit/generated/external-link-status-current-site.json` — all external links rendered by the generated site
- `audit/generated/media-reconciliation.json` — repeated pagination evidence for the 109-versus-107 media discrepancy

The raw 35 MB API snapshot is kept outside the deliverable repo under the local `work/wordpress-snapshot` directory and is intentionally excluded from deployment.
