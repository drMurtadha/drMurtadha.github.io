# Deployment guide

Date: 14 October 2026

**Nothing in this redesign has been pushed or deployed.** A passing build is not permission to
deploy. Every command below is for the owner to run deliberately.

## Current state

| | Profile | Portfolio |
| --- | --- | --- |
| Repository | `drMurtadha/drMurtadha` | `drMurtadha/drMurtadha.github.io` |
| Branch checked out | `feat/academic-profile-redesign` | `feat/academic-portfolio-redesign` |
| Commits ahead of `main` | 0 | 0 |
| Work state | uncommitted in working tree | uncommitted in working tree |

Both feature branches currently point at the same commit as `main`. All redesign work exists
only as uncommitted changes. A checkpoint of the working tree is stored outside both
repositories at `../checkpoints/<timestamp>/`.

## Safeguards that must survive deployment

These are deliberate and must not be flipped as a side effect of shipping.

- `public/robots.txt` disallows all crawlers and must stay that way until an approved cutover.
- `PUBLIC_SITE_INDEXABLE` defaults to `false` (`.env.example`). Every built page carries
  `<meta name="robots" content="noindex,nofollow">`. Verified across all 13 routes.
- `astro.config.mjs` pins `site: 'https://drmurtadha.github.io'`. Do not change the domain.
- The 13 approved routes are enforced by `scripts/validate-content.mjs`. Legacy WordPress posts
  stay excluded.
- Deployment is manual by design. In `.github/workflows/pages.yml` the `build` job runs on push
  to `main`, but the `deploy` job is gated on `if: github.event_name == 'workflow_dispatch'`.
  Pushing to `main` builds; it does not publish. Publishing requires a deliberate
  **Run workflow** from the Actions tab.

## Step 1 — Review the changes

```bash
WORK="$HOME/Documents/GitHub-Portfolio-Redesign"
for repo in profile portfolio; do
  echo "===== $repo ====="
  git -C "$WORK/$repo" status --short
  git -C "$WORK/$repo" diff --stat
  git -C "$WORK/$repo" diff --check
done
```

Read `IMPLEMENTATION_REPORT.md` and `TEST_REPORT.md` before going further.

## Step 2 — Preview locally

```bash
cd "$HOME/Documents/GitHub-Portfolio-Redesign/portfolio"
npm ci          # recommended at least once; has not been run in this session
npm run build   # validate → build → validate:build → check:links → check:budget
npm run dev     # http://localhost:4321
```

Check the home, research, teaching, publications, impact, CV and connect pages at desktop and
phone widths. If the build fails, fix the cause; do not disable a check.

## Step 3 — Commit to the feature branches

Not yet done. Review first, then:

```bash
WORK="$HOME/Documents/GitHub-Portfolio-Redesign"

git -C "$WORK/profile" add README.md
git -C "$WORK/profile" commit -m "feat: replace template README with academic profile"

cd "$WORK/portfolio"
git add .gitignore AUDIT_REPORT.md DESIGN_SYSTEM.md IMPLEMENTATION_REPORT.md \
        TEST_REPORT.md DEPLOYMENT_GUIDE.md \
        audit/generated/redesign-external-links.json \
        src/components/ProjectCard.astro src/components/ProjectShowcase.astro \
        src/data/projects.json src/components/Hero.astro \
        src/components/PublicationExplorer.astro src/components/ResearchConstellation.astro \
        src/layouts/BaseLayout.astro src/pages/connect.astro src/pages/index.astro \
        src/pages/research.astro src/pages/teaching.astro src/styles/global.css
git commit -m "feat: academic intelligence UI enhancement"
```

`graphify-out/` is now in `.gitignore`. It is a local code-graph tool artifact, not project
content, and should not be committed.

## Step 4 — Push the branches (owner approval required)

```bash
git -C "$HOME/Documents/GitHub-Portfolio-Redesign/profile" push -u origin feat/academic-profile-redesign
git -C "$HOME/Documents/GitHub-Portfolio-Redesign/portfolio" push -u origin feat/academic-portfolio-redesign
```

Never force-push. Never push to `main` directly.

## Step 5 — Open pull requests

```bash
cd "$HOME/Documents/GitHub-Portfolio-Redesign/profile"
gh pr create --base main --head feat/academic-profile-redesign \
  --title "Academic profile README" --body "See ../portfolio/IMPLEMENTATION_REPORT.md"

cd "$HOME/Documents/GitHub-Portfolio-Redesign/portfolio"
gh pr create --base main --head feat/academic-portfolio-redesign \
  --title "Academic Intelligence UI enhancement" --body "See IMPLEMENTATION_REPORT.md and TEST_REPORT.md"
```

## Step 6 — Publish (separate, explicit decision)

Merging to `main` triggers the **build** job only. To actually publish:

1. GitHub → repository → **Actions** → **Build GitHub Pages**.
2. **Run workflow** on `main`.
3. Confirm the `deploy` job and the `github-pages` environment.

Before publishing, confirm deliberately:

- Should the site remain `noindex`? It is `noindex,nofollow` today. Leave it unless you are
  running an approved cutover. Enabling indexing is a separate decision involving
  `PUBLIC_SITE_INDEXABLE` **and** `public/robots.txt`.
- Has the broken legacy DOI `10.14257/ijseia.2014.8.2.31` been resolved, or is shipping a known
  404 reference acceptable for now?
- Is the home-page `<title>` ("Networked Intelligence") the positioning you want, given the hero
  now leads with academic identity?

## Rollback

Nothing is published until Step 6, so rollback before that is simply not merging.

After a publish, re-run the workflow from the previous `main` commit. Do not use `git reset
--hard`, `git clean -fd` or force-push in these repositories.

## Out of scope — do not touch

DNS, the WordPress production site, migration and cutover decisions, the approved route list,
the redirect policy, the asset allowlist, quarantined images, and student data.
