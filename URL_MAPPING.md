# URL mapping

The row-level draft is in `audit/generated/url-mapping.csv` (5,285 mappings plus header).

## Mapping policy

The GitHub user site lives at the domain root. A legacy path such as:

`https://people.utm.my/murtadha/biography/`

maps initially to:

`https://drmurtadha.github.io/biography/`

This removes only the multisite prefix `/murtadha`. Existing dated post paths should be retained for archived posts unless an editorial merge has an explicit redirect target.

## Core curated mappings

| Legacy | Target | Treatment |
|---|---|---|
| `/murtadha/` | `/` | New Networked Intelligence homepage |
| `/murtadha/biography/` | `/biography/` | Curated biography |
| `/murtadha/cv/` | `/cv/` | Current CV landing page; PDF only after review |
| `/murtadha/research-areasinterest/` | `/research/` | Research constellation and themes |
| `/murtadha/scopus-indexed-publications/` | `/publications/` | Consolidated explorer |
| `/murtadha/web-of-science-indexed-publications/` | `/publications/?index=wos` | Filter/view, plus redirect where supported |
| `/murtadha/other-publications/` | `/publications/?index=other` | Filter/view |
| `/murtadha/verified-non-indexed-publications/` | `/publications/?index=non-indexed` | Filter/view |
| `/murtadha/phd-students/` | `/people/` | Reviewed people/supervision section |
| `/murtadha/teaching/` | `/teaching/` | Teaching section |
| `/murtadha/consultancy-industry-engagement/` | `/impact/` | Impact section |
| `/murtadha/social-media/` | `/connect/` | Current links only; remove dead embeds |

## Redirect limitation

GitHub Pages can publish target pages but cannot issue server-level HTTP redirects for the old `people.utm.my` host. True preservation requires one of:

1. redirects configured by the People@UTM administrator;
2. lightweight legacy pages with canonical links and client-side fallback; or
3. keeping legacy pages available and cross-linking to the new canonical site.

No redirect or canonical change has been made. Query-string filter targets above may be replaced by static routes for stronger crawlability during implementation.
