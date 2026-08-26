# Amirali Zand — Portfolio

A bilingual (English / Persian) developer portfolio built as its own work sample:
the premise is that the experience of using the site — the motion quality, the
performance, the RTL handling — argues for the skill more convincingly than a
list of adjectives would.

Single page, eight sections, one API route. Dark and glassy, heavy on motion,
fully self-hosted fonts.

## Stack

| Layer                        | Choice                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| Framework                    | Next.js 16 (App Router), React 19, TypeScript                          |
| Styling                      | Tailwind CSS 3, design tokens in `tailwind.config.ts` + `lib/theme.ts` |
| Scroll / timeline animation  | GSAP + ScrollTrigger                                                   |
| State / transition animation | Framer Motion                                                          |
| Smooth scrolling             | Lenis                                                                  |
| Primitives                   | Radix UI (dialog, tabs, slot)                                          |
| 3D                           | Spline                                                                 |
| Mail                         | Resend                                                                 |

Animation is deliberately split: GSAP owns anything scroll- or timeline-driven,
Framer Motion owns anything state-driven. Two libraries never animate the same
element's transform at once. See `AGENTS.md` for the full design spec — it is
the reference document for this codebase, not an afterthought.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Open http://localhost:3000.

The site renders fine without any environment variables — only the contact form
needs one. Without `RESEND_API_KEY` the `/api/contact` route responds 500 and
logs why, rather than failing silently.

### Environment variables

| Variable               | Required             | Purpose                                                                                                                 |
| ---------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | for the contact form | Server-side send in `app/api/contact/route.ts`. Never exposed to the client.                                            |
| `NEXT_PUBLIC_SITE_URL` | in production        | Absolute origin for `metadataBase`, sitemap, robots and Open Graph URLs. Falls back to the Vercel URL in `lib/site.ts`. |
| `CHROME_PATH`          | optional             | Only read by `npm run resume:pdf`, when it cannot locate Chrome or Edge itself.                                         |

## Scripts

| Script                            | Does                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                                                |
| `npm run build`                   | Production build (also typechecks)                                                                                |
| `npm start`                       | Serve the production build                                                                                        |
| `npm run lint`                    | ESLint                                                                                                            |
| `npm run typecheck`               | `tsc --noEmit`                                                                                                    |
| `npm run format` / `format:check` | Prettier write / verify                                                                                           |
| `npm run resume:pdf`              | Reprints `public/resume/Amirali-Zand-Resume.pdf` from the HTML résumé next to it, using a headless Chrome or Edge |

The HTML résumé is the single source of truth — the site embeds it live in the
preview modal, so the PDF is the only rendition that can drift. Rerun
`resume:pdf` after every edit to it.

## Layout

```
app/
  (en)/            English root layout + `/`
  (fa)/fa/         Persian root layout + `/fa`
  api/contact/     The only server route — Resend
  fonts/           Subset woff2, loaded via next/font/local
  globals.css      Tailwind layers, theme variables, RTL rules
components/
  sections/        The eight page sections
  ui/              Reusable pieces (command palette, skills graph, cards)
lib/
  i18n/            en.ts declares the Dictionary type *and* the English copy;
                   fa.ts must satisfy the same type
  theme.ts         Motion and colour tokens
assets/fonts-src/  Source TTFs — build inputs, not served
```

`lib/i18n/en.ts` being both the schema and the English content is load-bearing:
a missing Persian translation is a compile error, not a blank spot at runtime.

## Fonts

All four families are self-hosted. Serving them from our own origin instead of
Fontshare removed two third-party handshakes from the critical path — measured
from Tehran, that stylesheet alone accounted for ~3.7s of a 3.8s first
contentful paint.

Peyda Pro is subset from the TTFs in `assets/fonts-src/`, which are kept in the
repo but deliberately outside `public/` so they are not deployed. Regenerate a
weight with:

```bash
python -m fontTools.subset "assets/fonts-src/Peyda Pro/Peyda-Regular.ttf" \
  --output-file=app/fonts/Peyda-400.woff2 --flavor=woff2 \
  --layout-features='*' --unicodes="U+0000-00FF,U+0600-06FF,..."
```

`--layout-features='*'` is not optional. Arabic is a joining script; dropping
`init`/`medi`/`fina`/`rlig`/`ccmp` renders every Persian word as disconnected
isolated letters.

## Language switching

English lives at `/`, Persian at `/fa`, and both are server-rendered with the
correct `lang` and `dir` so crawlers see real content in both languages.

The in-page toggle, however, never navigates. It swaps the dictionary behind a
full-screen curtain and rewrites the URL with `history.replaceState`. This is
deliberate: routing between the two would remount the tree, and that teardown
destroys every GSAP ScrollTrigger and the Spline WebGL context — which used to
leave the page blank until a hard refresh. The curtain also does real work, not
just decoration; it covers the untransitionable RTL/LTR reflow so the direction
flip reads as intentional.

## Known limitations

- Switching language by typing the other URL directly is a full document load.
  Only the in-page toggle gets the animated transition.
- The 3D hero is a hosted Spline scene, so it depends on that service being up.
- No test suite. Quality gates are ESLint, Prettier, the TypeScript build, and
  the manual checklist in `AGENTS.md` §10.

## License

Code is MIT — see [LICENSE](LICENSE).

The content is not. The résumé, the photography, the project write-ups and the
Persian and English copy in `lib/i18n/` are personal material; please don't
redeploy this as your own portfolio. Reuse the patterns, not the person.
