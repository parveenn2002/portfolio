import type { Mode, PageMeta } from '../types/index.ts';
import { site } from './site.ts';

/**
 * Page metadata. Read at build time (static HTML, so link previews work
 * without JavaScript) and at runtime (client-side navigation).
 * Descriptions must stay factual — no claims that are not in the content.
 */
const name = site.person.name;

export const modeMeta: Record<Mode, PageMeta> = {
  career: {
    title: `${name} — PHP Developer`,
    description:
      'PHP developer with three years of experience in backend development, Laravel and databases.',
    themeColor: '#0a0f14',
  },
};

export const notFoundMeta: PageMeta = {
  title: `Page not found — ${name}`,
  description: 'The page you are looking for does not exist.',
  themeColor: '#0a0f14',
  robots: 'noindex',
};
