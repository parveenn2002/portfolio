import type { SiteConfig } from '../types/index.ts';

/**
 * Single source of truth for PARVEEN's public details.
 *
 * Every value marked [CONFIRM: …] is a placeholder that must be reviewed
 * before deployment. Empty strings mean "not published" and hide the item.
 * Never put private details here: everything in this file ships to the browser.
 */
export const site: SiteConfig = {
  url: '', // [CONFIRM: production origin, e.g. https://parveen.dev — enables canonical/og:url]

  person: {
    name: 'PARVEEN N',
  },

  contact: {
    email: 'parveenn2002@gmail.com',
    whatsapp: '', // Optional: digits only with country code. Leave empty to hide.
  },

  links: {
    github: 'https://github.com/parveenn2002', // Optional: PARVEEN’s GitHub profile URL (https://…). Empty = hidden.
    linkedin: 'https://linkedin.com/in/parveen-noordeen-aa98a533b', // Optional: PARVEEN’s LinkedIn profile URL (https://…). Empty = hidden.
  },

  resume: {
    path: '/resume/resume.pdf', // [CONFIRM: add PARVEEN’s resume PDF to public/resume/]
    available: true,
  },
};
