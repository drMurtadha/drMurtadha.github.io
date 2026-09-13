# Claude Code handoff: publish source repository safely

## Objective

Create or connect the GitHub repository `drMurtadha/drMurtadha.github.io` and push the completed local `main` branch. This task publishes the **source repository only**. Do not deploy GitHub Pages, enable indexing, change DNS, modify People@UTM, or perform a production cutover.

## Local project

```text
/Users/mohdmurtadha/Documents/Codex/2026-09-13/referenced-chatgpt-conversation-this-is-an-2/outputs/drMurtadha.github.io
```

The directory is already a Git repository on branch `main`, with clean, logically separated commits. It currently has no configured remote. The previously configured GitHub CLI credential for account `drMurtadha` is invalid, so interactive re-authentication will be required.

## Mandatory context

Read these before changing anything:

- `README.md`
- `MIGRATION_AUDIT.md`
- `CONTENT_INVENTORY.md`
- `URL_MAPPING.md`
- `API_MAPPING.md`
- `IMPLEMENTATION_PLAN.md`
- `ASSET_REGISTER.md`

Owner decisions that must remain enforced:

- Exclude all 5,249 legacy posts.
- Publish only the 12 curated routes built from 13 approved current pages.
- WordPress REST is an import source only, never a runtime dependency.
- Keep all unapproved WordPress media quarantined.
- The five current photographs and September 2026 CV are approved.
- Scopus snapshot: 81 documents, 885 citations and h-index 15, verified 13 September 2026.
- Do not add AnimMaster yet.
- Keep preview output `noindex,nofollow`.
- Do not change or disable `people.utm.my/murtadha`.

## Procedure

1. Change to the local project directory and verify that `git status --short` is clean.
2. Confirm there is no accidental inclusion of `node_modules/`, `dist/`, `work/`, credentials, raw WordPress snapshots or unrelated personal files.
3. Run `npm ci` and `npm run build`. The expected result is 13 static outputs with content, link and performance-budget checks passing.
4. Authenticate the GitHub CLI as `drMurtadha` using `gh auth login -h github.com`. Let the owner complete any browser/device confirmation.
5. Check `gh repo view drMurtadha/drMurtadha.github.io`.
6. If the repository does not exist, create **one public repository** named exactly `drMurtadha.github.io` under user `drMurtadha`, using this existing directory as its source. Do not initialize it with a separate README, license or `.gitignore`.
7. Configure `origin` as `https://github.com/drMurtadha/drMurtadha.github.io.git` and push local `main`, setting upstream tracking.
8. Verify the remote branch and the GitHub Actions **build** result. A normal push should run only the build job; the deploy job is intentionally restricted to manual `workflow_dispatch`.
9. Stop after the source and build checks are visible on GitHub. Do not manually run the deployment workflow and do not configure GitHub Pages unless the owner gives a separate explicit instruction.

## Expected verification

- Repository URL: `https://github.com/drMurtadha/drMurtadha.github.io`
- Branch: `main`
- Latest local commit before this handoff document: `c9c4fa7`
- Build outputs: 13 HTML pages including `404.html`
- Performance budget: approximately 28.5 KiB CSS, no external JavaScript, and approximately 1.1 KiB maximum inline JavaScript per page
- Working tree remains clean after the push

## Report back

Report the repository URL, pushed commit SHA, build-workflow status and any action still requiring the owner. Clearly state that Pages deployment and production cutover were not performed.
