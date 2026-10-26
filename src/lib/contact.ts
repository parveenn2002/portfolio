import type { SiteConfig } from '../types/index.ts';
import { isPlaceholder } from './placeholder.ts';

export type ContactKind = 'email' | 'whatsapp' | 'github' | 'linkedin';

export interface ContactItem {
  kind: ContactKind;
  label: string;
  /** Human-readable value, e.g. the address. */
  display: string;
  /** Undefined when the value is still a placeholder — rendered as text, not a link. */
  href?: string;
  external: boolean;
}

const WHATSAPP_NUMBER = /^\d{8,15}$/;

/**
 * Turns the contact section of site config into renderable items.
 * Empty values are omitted (not published). Placeholder values are kept but
 * get no href, so a broken mailto: or wa.me link is never produced.
 */
export function contactItems(
  site: SiteConfig,
  options: { whatsappMessage?: string; emailSubject?: string } = {},
): ContactItem[] {
  const items: ContactItem[] = [];
  const { email, whatsapp } = site.contact;

  if (email) {
    const subject = options.emailSubject ? `?subject=${encodeURIComponent(options.emailSubject)}` : '';
    items.push({
      kind: 'email',
      label: 'Email',
      display: email,
      href: isPlaceholder(email) ? undefined : `mailto:${email}${subject}`,
      external: false,
    });
  }

  if (whatsapp) {
    const valid = WHATSAPP_NUMBER.test(whatsapp);
    const text = options.whatsappMessage ? `?text=${encodeURIComponent(options.whatsappMessage)}` : '';
    items.push({
      kind: 'whatsapp',
      label: 'WhatsApp',
      display: valid ? `+${whatsapp}` : whatsapp,
      href: valid ? `https://wa.me/${whatsapp}${text}` : undefined,
      external: true,
    });
  }

  for (const [kind, label] of [
    ['github', 'GitHub'],
    ['linkedin', 'LinkedIn'],
  ] as const) {
    const url = site.links[kind];
    if (!url) continue;
    const valid = /^https:\/\//.test(url) && !isPlaceholder(url);
    items.push({
      kind,
      label,
      display: valid ? url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '') : url,
      href: valid ? url : undefined,
      external: true,
    });
  }

  return items;
}
