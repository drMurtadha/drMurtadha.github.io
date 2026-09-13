# Content inventory

The detailed inventory is in `audit/generated/content-inventory.csv` (5,285 content rows plus header). It is generated from a point-in-time public WordPress REST snapshot.

## Editorial groups

| Group | Source examples | Proposed treatment |
|---|---|---|
| Identity | Home, Biography, CV | Curate into About/Profile; verify current titles and dates |
| Research | Research areas, current/completed projects, consultancies | Structured project/theme data with narrative pages |
| Publications | Scopus, Web of Science, journals, proceedings, books, technical reports | Reconcile into one publication dataset; preserve source/index provenance |
| People | PhD, master and undergraduate students | Consent/current-status review before publishing profiles |
| Teaching | Teaching, classes, current semester, course pages | Curate current material; archive old resources separately |
| Impact | Consultancy and industry engagement, intellectual property | Structured case studies/evidence |
| Media | 107 retrieved attachments, including 80 PDFs | Quarantine; privacy/copyright/accessibility review |
| Legacy stream | 5,249 posts, mostly 2016–2017 social/news imports | **Owner decision: do not publish; retain inventory only** |
| Events | Events and child pages | Confirm whether plugin data is still meaningful; export separately if needed |

## Key observations

- 5,244 of 5,249 posts are assigned to the generic `Other` category.
- The 713 categories and 3,377 tags primarily reflect imported social/news material and should not define the new site taxonomy.
- The current homepage already expresses “Murtadha / Networked Intelligence”; the Astro concept continues this direction instead of imitating a corporate portal.
- The 80 PDFs are not approved migration assets. Filenames/titles include material that may be confidential or inappropriate for public Git history.

## Confirmed owner decision

All 5,249 legacy posts are excluded from the new site. No post body, dated post route, category archive or tag archive will be generated. Their inventory is retained solely as migration evidence and to prevent accidental reintroduction.

## Proposed core data model

- `profile`: identity, roles, contacts, persistent researcher identifiers
- `researchThemes`: theme, summary, related projects, people, publications
- `publications`: DOI, title, year, venue, type, index sources, citations-as-of date
- `people`: name, role, supervision status, consent/public visibility
- `projects`: title, period, funder, status, theme, outputs, impact
- `teaching`: course, session, visibility and approved resources
- `legacyContent`: old permalink, target, preservation status, review reason

No API call is required by the browser at runtime. All structured data is generated during import/build.
