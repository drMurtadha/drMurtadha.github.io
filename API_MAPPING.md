# WordPress API mapping

Base: `https://people.utm.my/murtadha/wp-json`

## Import endpoints

| Endpoint | Use | Runtime? | Audit result |
|---|---|---|---|
| `/` | API discovery, namespaces and routes | No | Public |
| `/wp/v2/posts?per_page=100&page=N&context=view` | Posts and rendered content | No | 5,249 retrieved |
| `/wp/v2/pages?per_page=100&page=N&context=view` | Pages and rendered content | No | 36 retrieved |
| `/wp/v2/media?per_page=N&page=N&context=view` | Attachment metadata/source URLs | No | Header claims 109; repeated page sizes of 100 and 50 both expose the same 107 unique IDs, confirming a source count/visibility inconsistency |
| `/wp/v2/categories` | Legacy taxonomy | No | 713 retrieved |
| `/wp/v2/tags` | Legacy taxonomy | No | 3,377 retrieved |
| `/wp/v2/users` | Public author attribution | No | 1 retrieved |
| `/wp/v2/menus` | Registered menus | No | `401 rest_cannot_view` |
| `/wp/v2/menu-items` | Menu structure | No | `401 rest_cannot_view` |
| `/wp/v2/menu-locations` | Theme locations | No | Authentication required |
| `/wp/v2/search` | Discovery cross-check | No | Public route; not required for primary enumeration |
| `/oembed/1.0/embed` | Legacy embeds | No | Discovery only; avoid runtime embeds by default |

The API also advertises Jetpack, wp.com, block editor, Site Kit and site-health namespaces. They are outside the minimum migration surface and must not be called merely because they are discoverable.

## Field mapping

| WordPress | Static model |
|---|---|
| `id` | `legacyId` |
| `slug` | route segment / stable identifier |
| `date`, `modified` | `publishedAt`, `updatedAt` |
| `link` | `legacyUrl` |
| `title.rendered` | sanitised `title` |
| `content.rendered` | converted Markdown/MDX or approved HTML |
| `excerpt.rendered` | editorial `description` |
| `featured_media` | reviewed local asset reference |
| `categories`, `tags` | legacy taxonomy IDs, then curated taxonomy |
| `yoast_head_json.canonical` | migration canonical evidence |

## Sync contract

`scripts/import-wordpress.mjs` creates a local JSON snapshot. `scripts/audit-content.mjs` derives inventories from that snapshot. A future converter will transform approved records into Astro content/data. The built site must never call WordPress from client-side JavaScript.
