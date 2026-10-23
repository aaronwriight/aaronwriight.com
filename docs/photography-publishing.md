# Photography: from a chosen frame to a public gallery

The portfolio and three gallery studies are layout placeholders. No portfolio
folder has been scanned for images, no photographs have been selected, and
`content/photography/published.json` starts empty. The study routes are examples,
not client projects. They reuse `ProjectPlacard` category, title, subtitle,
description, preview, and destination fields.

## Where things live

- Personal originals stay in your photography archive, outside this repository.
- `.photography-workspace/` holds ignored draft metadata, deliberately chosen web
  derivatives, and local HTML reviews. Do not commit it or serve it publicly.
- `content/photography/published.json` contains only public gallery metadata and
  image captions/alt text. Next.js reads this portable catalog at build time.
- `public/images/photography/<slug>/` contains approved, content-hashed derivatives.
  The same asset serves the gallery and, if selected, the portfolio; no duplicates
  are needed for those two views. Images retain their whole frame, without cropping.
- `src/lib/photography.ts` contains the layout studies and catalog types. The
  existing Sanity media schema remains available for established CMS content;
  it is not a second photography catalog or a prerequisite for this workflow.

## Draft, check, review, publish

The commands follow the writing workflow's local draft/review/explicit publication
pattern. They never walk a photo folder, choose a frame, modify an original,
contact Pic-Time, or deploy the site. Python 3.10+ is required. Image validation
uses Pillow (already available on the inspected machine); install the explicit
requirement in your Python environment if needed:

```sh
python3 -m pip install -r scripts/photography-requirements.txt
pnpm photography draft my-collection
```

Edit `.photography-workspace/my-collection/gallery.json`. Keep `publicApproved`
false until you have approved every field, image, and destination for public
release. Set title, category, subtitle and description. Leave `picTimeUrl` empty
until you have verified an ordinary **public** gallery URL in a signed-out browser.
Only this account's HTTPS Pic-Time host is accepted, without query strings,
fragments, credentials, or account/invitation paths. This syntax check does not
prove a URL is public: an access-bearing path can still be a secret.

When you decide on photographs, export clean JPEG/PNG/WebP web derivatives into
the draft folder yourself, without EXIF/GPS, comments, or embedded private
metadata. The validator accepts at most 12 still images, each no larger than
3 MiB and 8000 pixels per side. It checks file bytes, image decoding, dimensions,
metadata, path containment, duplicate files, and descriptive alt text. It does
not resize, strip metadata, crop, or retouch files. An image entry looks like:

```json
{
  "source": "chosen-frame.webp",
  "alt": "A specific description of the photograph you have chosen.",
  "caption": "An optional public caption.",
  "shape": "portrait",
  "portfolio": true
}
```

`shape` is portrait, landscape, or square; it controls the surrounding frame,
not a crop. `portfolio: false` keeps an image in its public gallery only. All
images supplied here are public after publication; this is not a private-gallery
pipeline. Do not add client names, emails, codes, invitation links, or passwords.

```sh
pnpm photography check .photography-workspace/my-collection/gallery.json
pnpm photography review .photography-workspace/my-collection/gallery.json
```

Open the reported local HTML file and inspect the images, captions, alt text,
and destination. Set `publicApproved: true` when ready, run review again, then:

```sh
pnpm photography publish .photography-workspace/my-collection/gallery.json --confirm-public --dry-run
pnpm photography publish .photography-workspace/my-collection/gallery.json --confirm-public
```

A fingerprint binds review to the exact manifest and derivative bytes; changing
either requires another review. Publication stages generated public files locally.
It does not commit, push, upload to a service, or deploy. Inspect the git diff,
preview the site, then use the normal repository release process. Existing gallery
replacement requires `--replace`. Empty image lists support metadata-only entries.
Never use the publish command merely to demonstrate an unapproved photo.

The original draft and derivatives are not changed. Generated assets have immutable
hash names; replacement does not erase earlier files. To reverse an uncommitted
publication, restore the catalog and remove only the generated files shown in
that publication's diff. For previously deployed content, removal requires a
reviewed removal commit and redeploy, including unused derivative files. Removing
a catalog entry alone does not remove publicly accessible image URLs, and caches
or third-party copies cannot be recalled by this workflow.

## Pic-Time handoff and client access

The public entry point is now centralized in `src/data/photography.ts`:
`https://frameitwrightphotography.pic-time.com/client`. It returned HTTP 200
on October 12, 2026 without an invitation token; a signed-out browser also
confirmed its Login option with image/media loads blocked. The site's “Looking for your
photographs?” action goes there in the same tab, clearly labeled as a handoff
for gallery access and sign-in on Pic-Time. The portfolio and platforms wiki
also use the public account entry. This is an outbound link, not FIW authentication.
A collection absent from the landing page may still need the emailed invitation.

**Recommended division:** keep the website portfolio as a small selection across
collections. Gallery placards open a local page with the chosen snapshot (up to
12 web derivatives), and its `picTimeUrl` opens the full explicitly public gallery.
Pic-Time remains the delivery, account, and gallery-management system. A
`portfolio: true` image can appear in both local views from the same public file.
This retains the site's design without maintaining a second client-gallery system.
Neither a full-gallery link nor the client-entry action needs an embedded API.

Candidate photographs remain unselected. User-supplied content areas live in
`src/data/photography.ts`: Events, Couples & Engagement, Wedding, Family, Friends,
& Lifestyle, Graduation (High School & College), Headshots, and Travel. The booking
choices derive from that list excluding Travel. Layout studies remain explicitly
fictional and are not claims about available client collections.

Pic-Time documents both portfolio-page integration and a generic account login.
An iframe would show the collections/previews configured in the remote account;
we have deliberately kept the public handoff and locally approved snapshots.
No embed, API, credentials, gallery permission changes, or automatic image imports
were added. [Pic-Time portfolio integration guide](https://help.pic-time.com/en/articles/7908017-how-do-i-customize-and-integrate-my-portfolio-page),
[Pic-Time client landing guide](https://help.pic-time.com/en/articles/11403055-is-there-a-generic-client-landing-page-in-pic-time-2-0).

Keep private deliveries and invitations in Pic-Time. Do not copy client invitation
URLs, tokens, passwords, or client-only photographs into manifests, tests, source,
or public previews. The optional example client gallery was not accessed: its
redacted invitation is not needed to verify the public landing page. Only the
public account URL is used for the new client-entry action.

Before linking an individual public collection, verify its visibility and consent
in the account and a signed-out browser. Account version and settings affect
which previews are exposed; a private-gallery designation alone is not proof
that every preview is hidden. Review these before ever enabling a portfolio embed.
[Pic-Time 1.0 client landing page](https://help.pic-time.com/en/articles/8959345-is-there-a-generic-client-landing-page),
[Pic-Time 2.0 client landing page](https://help.pic-time.com/en/articles/11403055-is-there-a-generic-client-landing-page-in-pic-time-2-0).

## Checks

```sh
python3 -m unittest discover -s scripts -p test_photography.py
```

Tests generate their own tiny colored rectangles in temporary folders. They
exercise consent, review freshness, rollback, safe public records, path and file
validation, and private-link rejection without reading personal photographs.
