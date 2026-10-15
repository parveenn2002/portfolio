# CLAUDE.md — project conventions

PARVEEN's PHP developer portfolio: a single career page at `/career` (`/`
redirects there) in a Vite + React + TypeScript SPA. Read `PROJECT_STATUS.md`
first for the current state and next step.

## Commands

| Command             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server                                         |
| `npm run build`     | Typecheck (`tsc -b`) + production build to `dist/` |
| `npm run lint`      | oxlint (React hooks, a11y, TypeScript rules)       |
| `npm run typecheck` | TypeScript only (app, build plugin and tests)      |
| `npm test`          | Unit tests (Node's built-in runner, `tests/**`)    |
| `npm run build:release` | Production build that fails on `[CONFIRM]` placeholders or empty `site.url` |
| `npm run preview`   | Serve `dist/` locally                              |

Run `typecheck`, `lint`, `test` and `build` before reporting a change complete,
plus browser checks of the main journeys (Playwright is available in this
workspace). Report actual output; never claim something works without checking it.

## Stack (pinned for compatibility)

React 19, React Router 8 (data router, `react-router` + `react-router/dom`),
Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`, no PostCSS/tailwind.config),
lucide-react, oxlint, self-hosted IBM Plex Sans via `@fontsource-variable/ibm-plex-sans`.
No animation library: entrance and menu motion are CSS.
Tests: `node --test` with native TS type-stripping (Node ≥ 22.18) — no test framework.
**TypeScript is pinned to `~6.0`** — TS 7 is not yet supported by parts of the
ecosystem (e.g. typescript-eslint). Check compatibility before any upgrade.

No backend. Add one only for a real server-side requirement (see PROJECT_STATUS).

## Structure

```
build/route-meta-plugin.ts  Vite plugin: per-route static HTML with <head> tags
build/placeholder-check-plugin.ts  counts/blocks unresolved [CONFIRM] placeholders
public/_headers, _redirects  security headers (strict CSP) + `/` → `/career` for Netlify/Cloudflare Pages
src/app/                    router, AppShell, 404, route error
src/config/                 site.ts (personal/contact), seo.ts, modes.ts, navigation.ts
src/content/                all public text (career.ts, projects.ts)
src/types/                  index.ts (site/meta), content.ts (content shapes)
src/lib/                    framework-free helpers (meta, contact, placeholder)
src/hooks/                  React hooks
src/components/layout|ui/   layout and UI primitives
src/features/career/        the page and its sections
src/animation/engine/       CanvasStage (lifecycle) + pure math, spatial grid, types
src/animation/scenes/       networkScene.ts (molecular network)
src/animation/presets.ts    tunable numbers; InteractiveBackground.tsx wraps the engine
src/styles/index.css        Tailwind import, design tokens, keyframes
tests/                      unit tests mirroring src/ paths
public/                     favicon, resume/, _headers, _redirects
```

## Conventions

- **Imports:** relative paths with explicit extensions (`./foo.ts`, `./Bar.tsx`,
  `../types/index.ts`). Required because `vite.config.ts` loads `src/config` and
  `src/lib/meta.ts` through Node's native TS loader.
- **Exports:** named exports only. Lazy routes map them in `router.tsx`.
- **Files:** components `PascalCase.tsx`; hooks `useThing.ts`; others `camelCase.ts`.
- **Styling:** Tailwind utilities with semantic tokens only — `bg-canvas`,
  `bg-surface`, `bg-raised`, `border-line`, `text-ink`, `text-muted`, `text-accent`,
  `text-accent-ink`, `text-confirm`, `font-display`, `font-sans`, `max-w-content`,
  `max-w-prose`, `ease-out-soft`, type sizes `text-hero`, `text-display`,
  `text-lede`. No raw hex colours in components. Change the look by editing the
  `:root` token block in `index.css`. Entrance motion: the `rise`
  utility (stagger with `[--rise-delay:120ms]`); menus: `drop-in`.
- **Typography:** IBM Plex Sans for body and display.
- **Design rules:** no all-caps eyebrow labels, no monospace data labels, no
  numbered markers unless the content is a real sequence, no `→` in link text.
  One bold element per page (the hero network); everything else quiet.
- **Mode plumbing:** the site was derived from a multi-mode portfolio; one mode
  (`'career'`) remains. `MODES`, `<html data-mode>` and `<ModeLayout mode>` are
  kept because the metadata plugin and layout rely on them — not dead code. The
  page renders inside `<ModeLayout mode="career">` (skip link, fixed
  `SiteHeader`, `SiteFooter`). Header links come from `config/navigation.ts`
  and must match section ids.
- **Metadata:** edit `src/config/seo.ts`. Adding a route means updating
  `MODES`/router *and* letting the plugin emit its HTML (it loops over `MODES`).
- No abstractions for one-off markup.
- **CSP:** `public/_headers` allows no inline scripts or styles. Don't add
  inline `<script>`/`<style>` to `index.html` or third-party scripts/fonts
  without updating the policy.
- **Placeholders in UI:** render content strings through `<ContentText>` so
  `[CONFIRM: …]` values are highlighted. Contact links come from
  `lib/contact.ts`, which never links a placeholder or malformed value.
- **Animation:** `CanvasStage` owns canvas sizing (DPR capped at 2), the rAF
  loop, smoothed pointer, pause when off-screen/hidden, reduced motion (single
  static frame), a quality governor and full teardown. Scenes implement
  `Scene` and never touch the DOM. No React state per frame. Don't change the
  network physics without re-running `tests/animation`. **Never put CSS masks or
  filters on the canvas** (re-composited every frame; halved FPS at 1080p) —
  use an overlay element. Decorative canvases are `aria-hidden` and
  `pointer-events: none`.

## Content honesty rules (non-negotiable)

- Confirmed facts only: PARVEEN, PHP Developer, 3 years; PHP, Laravel, database
  development and management, backend development, server-related knowledge and
  configuration, AI tools for development and productivity.
- Never invent employers, job titles, dates, education, certifications, clients,
  projects, achievements, metrics or specific technologies.
- Unknown or unverified values use the marker **`[CONFIRM: …]`** so they are
  visible and searchable (`grep -r "CONFIRM" src`). Empty strings hide optional
  items (links, WhatsApp).
- Label projects by kind (employment / personal / practice / client-style);
  until confirmed, `kind` is itself a `[CONFIRM: …]` placeholder.
- Drafted wording is marked `SAMPLE COPY` for PARVEEN to review.
- Everything in `src/` ships to the browser: no secrets, private contact
  details or confidential employer information.

## Accessibility baseline

Semantic landmarks, one `h1` per page, skip link, visible `:focus-visible`
outline (global), WCAG AA contrast (tokens verified ≥ 6.3:1 for all text pairs),
keyboard-operable controls, reduced-motion support.

## Working rules

Inspect before editing; edit, don't regenerate; report changed files and
verified results; keep `PROJECT_STATUS.md` up to date.
