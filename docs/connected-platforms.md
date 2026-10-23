# Connected software and platforms

Maintained from repository evidence, October 2026. Update this inventory when
adding, removing, or changing an integration. Public companion: `/about/platforms`.
“Integrated” means code exists; it does not certify that credentials, a paid plan,
a remote deployment, or remote account settings are currently configured.

| Platform / tool | Evidence and role | Setup and handoff |
| --- | --- | --- |
| Next.js / React | `package.json`, `src/app/`: application, route handlers, server and client components. | Local dev and production build; Node 22 is the repository target. |
| Tailwind CSS | `src/components/globals.css`, `postcss.config.mjs`: shared serif/olive visual system. | Build-time CSS; reusable section shells and project placards. |
| Sanity | `sanity.config.ts`, `src/sanity/`, `src/app/studio/`, `src/lib/sfi-posts.ts`: existing CMS documents, media, and published post querying. | Public project/dataset identifiers and optional server read token; write token only for legacy upload commands. The embedded `/studio` and browser previews need `https://aaronwriight.com` in the Sanity project's CORS origins, with credentials allowed. See `.env.example`; never document values. |
| Vercel | README hosting statement, `next.config.mjs` build/cache notes, `NEXT_PUBLIC_SITE_URL`: hosting target. `aaronwriight.com` is registered through Vercel and uses Vercel DNS, which is where Resend's records for `updates.aaronwriight.com` go (see `docs/newsletter-setup.md`). | Normal repository deployment after review. Build reads checked-in public content, not personal folders. Deployment and account state were not inspected or changed. |
| Resend | `src/lib/resend-contacts.ts`, `src/app/api/newsletter/`, `src/app/api/creative/mailing-list/subscribe/`, `scripts/sfi_newsletter.py`: contacts, list membership, unsubscribe, optional SFI delivery. | Server-only API key; dedicated SFI and Creative segments. Creative requires its new segment before accepting subscriptions. See `docs/newsletter-setup.md`. No email was sent in this implementation. |
| AWS Terrain Tiles | `scripts/topo_background.py` generates `public/textures/high-peaks-mist.json`, drawn by `src/components/site/topo-background.tsx` and `src/lib/topo-background.ts`: the faint contour-map background of the Adirondack High Peaks. | Public open-data tiles (USGS 3DEP, SRTM and others); no account or key. Downloaded only when the script runs (cached in ignored `.topo-cache/`); the site serves the generated file. See `docs/site-background.md`. |
| Pic-Time | User-confirmed gallery host; photography gallery and portfolio pages link to the public Pic-Time client entry. `scripts/photography.py` supports explicitly approved ordinary public gallery URLs. | Account-managed permissions and email invitations. Public `/client` entry verified HTTP 200; login and gallery permissions remain in Pic-Time. No stored client credentials, API integration, or iframe. See `docs/photography-publishing.md` and its official sources. |
| GitHub / Git | Repository history and existing project links: versioned website, public content, and separate scientific source repositories. | Review generated output before commit/push/deploy. The legacy website remains read-only; inventory is in `docs/legacy-website-inventory-and-retirement-plan.txt`. |
| Python writing tools | `scripts/writing.py`, `scripts/venture.py`, legacy `scripts/sfi_*.py`: local author/review/publish commands. | External personal manuscripts are read-only, selected explicitly. Ignored local source config/cache; generated `content/` records deploy independently. Canonical guide: `writing/README.md`. Legacy commands are compatibility tools, not a second source of truth. |
| Word / DOCX | External manuscript file format and the writing importer. | Author outside this repository; import/re-source through the writing workflow. Presence of DOCX files confirms the format, not any cloud/Office account connection. |
| Photography review tools / Pillow | `scripts/photography.py`, `scripts/photography-requirements.txt`: metadata and selected derivative validation, local review, explicit public staging. | Photographer chooses and exports files. No originals are changed. Pillow is used to inspect/decode, not to select photographs. |
| TidyTuesday / Quarto / R / tidyverse | Independent `tidytuesday` repository: `_quarto.yml`, `.github/workflows/quarto-publish.yml`, `renv.lock`, R project, challenge templates, and `uv.lock`/`pyproject.toml`. | Render in the source project, commit source for immutable provenance, then validate/review/publish a chosen plot through `scripts/tidytuesday.py`. No repo merge; no remote workflow run was verified. See `docs/tidytuesday-publishing.txt`. |
| pnpm / npm / TypeScript / ESLint | `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `eslint.config.mjs`: dependency/build/type/lint tooling. | pnpm is the declared package manager. Existing lint configuration needs dependency/tool-command maintenance; see implementation verification notes. |

## Configuration boundaries

Keep `.env.local`, `.writing-source.local.json`, `.writing-workspace/`,
`.writing-preview/`, `.photography-workspace/`, and `.tidytuesday-review/` private
and ignored. Do not add these directories to a static file server or a deployment.
The public site never reads from the personal writing or photography folders.

Public information pages deliberately omit local absolute paths, credentials,
client lists, and private gallery links. This repository note records code entry
points so setup can be maintained without copying secret values.

The photography booking page opens a visitor-reviewed email draft to the existing
public photography address. It is not a booking CRM, reservation, payment, or
email-sending backend. The Creative mailing list is a separate consent flow.

No other mail, calendar, file-sync, payment, or customer-management platform is
inferred to be connected merely because it appears in an available-plugin list.
