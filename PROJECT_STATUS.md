# Project status — PARVEEN, PHP Developer portfolio

_Last updated: 2026-10-15_

A single career portfolio for PARVEEN, adapted from an existing, fully tested
portfolio codebase. The design, layout, components, molecular Canvas 2D
background, accessibility and reduced-motion support, metadata pipeline,
security headers and release gate are unchanged. Only the content and the
number of routes differ.

## Current state

**Ready for content.** The site builds and works, with all of PARVEEN's
unconfirmed details shown as highlighted `[CONFIRM: …]` placeholders.
`npm run build:release` refuses to build until they are all replaced and
`site.url` is set. See `CONTENT_CHECKLIST.md`.

**Routes:** `/` → `/career` (301 at the host, plus a client-side fallback),
`/career`, and every other path → the 404 page (real 404 status, `noindex`).

**Page sections:** hero (molecular network), skills, experience, selected
projects, case study, how I work, education and certifications, contact and
resume.

## Adaptation from the source portfolio (2026-10-15)

- Removed the freelance and photography routes, pages, content, placeholder
  images, mesh and cinematic animation scenes (and their tests), the
  photography image helpers, the dev-only mode switcher, the two extra colour
  palettes and their fonts, and the unused `motion` package.
- Kept `MODES = ['career']` and the mode-aware layout, metadata and plugin code
  — the smallest safe routing change, with the same verified routing as before.
- Replaced all content with PARVEEN's confirmed facts plus placeholders and
  marked `SAMPLE COPY` (`src/config/site.ts`, `src/config/seo.ts`,
  `src/content/career.ts`, `src/content/projects.ts`, footer note).
- Project type can now be a `[CONFIRM: …]` placeholder (rendered highlighted,
  blocks release), so unconfirmed projects never show "Professional work".
- Skill markers made uniform (they previously implied newer vs established).
- "Learning" section renamed "Education and certifications".
- **Fixed a release-gate bug inherited from the source:** the dev-only resume
  reminder contained a `[CONFIRM]` string, so `build:release` could never pass.
  It is now plain text; verified that release passes once content is complete.
- Fresh git history, so no earlier personal content is in this repository.

## Verification (2026-10-15)

| Check | Result |
| --- | --- |
| `npm run typecheck` | ✅ no errors |
| `npm run lint` | ✅ 0 warnings |
| `npm test` | ✅ 34/34 (network scene, maths, spatial grid, contact links) |
| `npm run build` | ✅ main JS 105.0 kB gzip, career chunk 10.0 kB, CSS 7.2 kB; warns: 36 placeholders, no `site.url` |
| `npm run build:release` | ✅ fails while placeholders remain; ✅ passes on a copy with every placeholder filled and `site.url` set |
| `npm audit` | ✅ 0 vulnerabilities |
| Browser (Chromium, emulated static host with the real `_headers`/`_redirects`) | ✅ 34/34 |
| Leftover-content scan of `src/`, `public/` and `dist/` | ✅ none (only false positives such as "canonical") |

Browser checks covered `/` 301 → `/career`; direct load and refresh at 1280
and 390 px with no console errors or CSP violations; no third-party requests;
no horizontal scroll; static and runtime title "PARVEEN — PHP Developer" with
description and OG tags; all sections present; unconfirmed project types shown
as placeholders; no old content, mode switcher or links to removed routes;
header and mobile-menu navigation (Escape, link closes menu); `/freelance`,
`/photography` and unknown paths → real 404; axe-core WCAG 2.2 A/AA with zero
violations on `/career` and the 404 page; the canvas animates normally and is
drawn once and still under reduced motion; pointer displacement and ease-back;
pause when off-screen.

**Not verified:** real phones, Safari and Firefox, screen readers, Lighthouse,
behaviour on the chosen host.

## Deployment

Build with `npm run build:release`; output directory `dist`; Node 22 or newer.

- **Netlify / Cloudflare Pages:** zero extra config — `_headers`,
  `_redirects` and `404.html` are used automatically.
- **Vercel:** add a `vercel.json` with the headers from `public/_headers` and a
  permanent redirect from `/` to `/career`.
- **GitHub Pages:** custom domain or user site only; no custom headers.

After deploying, open `/` and `/career` directly, refresh, check the response
headers, test a link preview, and try it on a phone.

## Next step

PARVEEN works through `CONTENT_CHECKLIST.md`, then build with
`npm run build:release` and deploy.
