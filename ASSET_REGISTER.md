# Approved asset register

Owner approval recorded: 13 September 2026. Only the assets below may be copied into the static site. All other WordPress media remains quarantined.

## Photographs

| Local asset | Primary page | Purpose |
|---|---|---|
| `murtadha-office-desk.jpg` | Home | Academic work in context |
| `murtadha-supervision-meeting.jpg` | People | Postgraduate supervision in practice |
| `murtadha-portrait-warm.jpg` | Biography | Warm formal portrait |
| `murtadha-portrait-mono.jpg` | CV | Formal monochrome portrait |
| `murtadha-portrait-editorial.jpg` | Connect | Editorial contact/profile portrait |

The five selected files came from the owner-provided `Generated photos` folder. Their use is intentionally page-specific. No additional photograph is required for the current 12-route site.

## Document

| Local asset | WordPress media ID | Verification | Treatment |
|---|---:|---|---|
| `mohd-murtadha-cv-2026.pdf` | 7604 | 46-page A4 PDF; title and author metadata match; SHA-256 `8adb025cad46b04e925cb928700f38bac9a7d6fcd5502f9822d0c5c66ffa471c` | Local static download from `/cv/` |

The CV is the September 2026 upload identified as the newest matching CV in the audit snapshot. The static site links to its local copy and does not fetch it from WordPress at runtime.

## Guardrails

- `src/data/asset-policy.json` is the machine-readable allowlist used by import and validation scripts.
- Importing a non-allowlisted image or document produces a review placeholder or a validation failure.
- WordPress media URLs are not retained in generated page content.
- Adding or replacing an asset requires an explicit owner decision and an allowlist update.
