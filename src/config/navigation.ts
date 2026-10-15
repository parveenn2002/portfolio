import type { NavItem } from '../types/content.ts';
import type { Mode } from '../types/index.ts';

export interface ModeNavigation {
  /** In-page section links. Each href must match a section id on that mode's page. */
  items: NavItem[];
  /** Highlighted call to action in the header. */
  cta?: NavItem;
  /** One line under the name in the footer. */
  footerNote: string;
}

export const modeNavigation: Record<Mode, ModeNavigation> = {
  career: {
    items: [
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
      { label: 'Approach', href: '#approach' },
    ],
    cta: { label: 'Get in touch', href: '#contact' },
    footerNote: 'PHP developer — backend development, Laravel and databases.',
  },
};
