# assets/

Build inputs. Nothing in here is served — that is the entire point of the
directory existing.

These files used to sit in `public/`, where Next copies everything to the CDN
verbatim. That meant shipping 1.8 MB of source TTFs and another 180 KB of
full-size source images to every deployment so that no visitor could ever
request them. Kept in the repo because they are needed to regenerate the
served artefacts; kept out of `public/` because they are not the artefacts.

## `fonts-src/Peyda Pro/`

The unmodified Peyda Pro TTFs. The four weights the site actually uses are
subset from these into `app/fonts/Peyda-{400,500,600,700}.woff2` — about 202 KB
per weight becomes about 28 KB. See the regeneration command in the README and
the header comment in `app/layout.tsx`.

Only Regular, Medium, SemiBold and Bold are consumed. Thin through Black are
here for completeness; nothing references them.

## `images-src/`

Full-size originals for the 96px marks in `public/images/`. Regenerate a served
mark by resizing its original to 96px on the long edge and re-encoding.

`AZlogo.webp` (1254×1254) is the current AZ mark, and the source for the
navbar/project-fallback logo at `public/images/az-logo-96.webp`:

```bash
node --input-type=module -e "
import sharp from 'sharp';
await sharp('assets/images-src/AZlogo.webp')
  .resize(96, 96, { fit: 'contain', background: { r:0, g:0, b:0, alpha:0 } })
  .webp({ quality: 90, effort: 6 })
  .toFile('public/images/az-logo-96.webp');
"
```

`logo.png` and `amirali_logo.webp` are the previous dark 3D monogram, still the
source for `app/icon.png`, `app/apple-icon.png` and `app/opengraph-image.jpg`,
which Next picks up by file convention.
