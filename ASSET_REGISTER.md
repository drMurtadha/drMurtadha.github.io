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

The five selected files came from the owner-provided `Generated photos` folder. Their use is intentionally page-specific.

**Owner approval recorded: 16 September 2026** — three further photographs for the new Student Development page, supplied directly by the owner (not from the WordPress media library):

| Local asset | Primary page | Purpose | Source date |
|---|---|---|---|
| `murtadha-ipf-award.jpg` | Student Development | IPF appreciation certificate, Majlis Tautan Ukhuwah Syawal UTM 2024 | 2024-04-22 |
| `murtadha-kunming-guiyang-2025.jpg` | Student Development | Kunming–Guiyang Global Outreach Program delegation, Huawei Cloud | 2025-09-23 |
| `murtadha-padang-outreach-2025.jpg` | Student Development | Global Outreach Program to Padang delegation, departure | 2025-08-19 |

Each was resized to a 1600px long edge and compressed to stay well under the site's 250 KiB per-image budget.

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
