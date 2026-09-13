# Mohd Murtadha / Networked Intelligence

Astro static-site starter for the migration of `people.utm.my/murtadha`. WordPress is an import source only; the built site has no WordPress runtime dependency.

## Local use

```sh
npm install
npm run dev
npm run build
```

## Audit and import

```sh
npm run import:wordpress -- --out=audit/raw
npm run audit:wordpress -- audit/raw audit/generated
npm run import:pages -- audit/raw/pages.json src/data/imported-pages
npm run check:external -- --limit=25
```

The import is read-only. Raw snapshots are ignored by Git because they are large and can include material that requires privacy/copyright review. Generated inventories may be committed deliberately.

## Owner migration decisions

- All 5,249 legacy posts are excluded from the new site. They remain in the audit inventory only and must not generate Astro routes or be copied into the repository.
- Migrate only the 13 current/newly rebuilt pages; exclude the remaining 23 legacy pages.
- Five owner-provided photographs and the latest CV PDF are approved. All other media remains quarantined.

The approved-page importer strips WordPress headers/footers, scripts, post-query blocks and legacy archive sections. It rewrites internal routes, maps allowlisted assets to local static files, and replaces other media with review placeholders. Validation fails if an unapproved page ID, post block, asset, `/wp-content/` dependency or `/murtadha/` link is introduced. See [ASSET_REGISTER.md](ASSET_REGISTER.md).

## Deployment safety

- Pushes run the build job only.
- Deployment requires a manual `workflow_dispatch` run and GitHub Pages environment approval/configuration.
- Search indexing is disabled by default through `PUBLIC_SITE_INDEXABLE=false` and `robots.txt`.
- Do not enable indexing, change DNS, or alter People@UTM until the owner approves cutover.

See [MIGRATION_AUDIT.md](MIGRATION_AUDIT.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
