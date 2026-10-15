# Content checklist for PARVEEN — before going live

Everything here shows on the site until it is replaced; unresolved items are
highlighted pink in the browser. `npm run build` reports how many remain, and
**`npm run build:release` refuses to build until all are done** and `site.url`
is set. Find them any time with `grep -rn "CONFIRM" src`.

Currently **36 `[CONFIRM]` placeholders in 3 content files**.

Only these facts are confirmed: PARVEEN, PHP Developer, 3 years of experience;
PHP, Laravel, database development and management, backend development,
server-related knowledge and configuration, AI tools for development and
productivity.

## 1. Public details — `src/config/site.ts`

- [ ] `url`: production address, e.g. `https://parveen.dev` (no trailing slash)
- [ ] `contact.email`: public contact email
- [ ] Optional: `contact.whatsapp` (digits with country code), `links.github`,
      `links.linkedin` (full `https://` URLs). Leave `''` to hide.
- [ ] Optional: resume. Add `public/resume/resume.pdf`, then set `resume.available: true`.

## 2. Career — `src/content/career.ts`

- [ ] Skills: specific database technologies, server tools, AI tools (or remove those lines)
- [ ] Experience: employer (or “Not disclosed”), dates, the exact job title if not
      “PHP Developer”, 2–3 public responsibilities, other technologies.
      Add an entry per employer if the 3 years span more than one.
- [ ] Case study: title, context, approach, outcome (only measured numbers), her contribution
- [ ] Education and certifications: qualification, institution, year. Or delete the
      entry and the section in `src/features/career/CareerPage.tsx`.
- [ ] Contact line: the roles she is looking for

## 3. Projects — `src/content/projects.ts`

The five entries are **suggested categories only**: a Laravel app, a backend
API, a database-driven app, server work, and an AI-assisted workflow. For each,
replace it with real work she can describe publicly, or delete it:

- [ ] Title, summary, her role, technologies used
- [ ] `kind`: `'employment'`, `'client-style'`, `'personal'` or `'practice'`
- [ ] Public links only (live site or repository); never employer code or client data

## 4. Sample copy to review

These are marked `SAMPLE COPY` in `career.ts`. They're written only from the
confirmed facts, but should be reworded in her own voice:

- [ ] Hero heading and introduction
- [ ] The five “How I work” principles (make sure each one is true for her)
- [ ] Page description for search and social: `src/config/seo.ts`
- [ ] Footer line: `src/config/navigation.ts`

## 5. Optional

- [ ] Replace the placeholder favicon (`public/favicon.svg`)
- [ ] Social preview image (`og:image` is not wired yet; previews show text only)
