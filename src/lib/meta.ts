import type { PageMeta } from '../types/index.ts';

/**
 * Pure description of the <head> tags for a page. Shared by the build-time
 * plugin (renders strings into static HTML) and the runtime hook (updates the
 * live DOM), so both always produce the same tags.
 */
export interface MetaTag {
  attr: 'name' | 'property';
  key: string;
  content: string;
}

export interface HeadSpec {
  title: string;
  tags: MetaTag[];
  /** Absolute canonical URL, or undefined when the site URL is not configured. */
  canonical?: string;
}

export function buildHead(meta: PageMeta, path: string, siteUrl: string): HeadSpec {
  const canonical = siteUrl ? `${siteUrl}${path}` : undefined;

  const tags: MetaTag[] = [
    { attr: 'name', key: 'description', content: meta.description },
    { attr: 'name', key: 'theme-color', content: meta.themeColor },
    { attr: 'property', key: 'og:type', content: 'website' },
    { attr: 'property', key: 'og:title', content: meta.title },
    { attr: 'property', key: 'og:description', content: meta.description },
    { attr: 'name', key: 'twitter:card', content: 'summary' },
    { attr: 'name', key: 'twitter:title', content: meta.title },
    { attr: 'name', key: 'twitter:description', content: meta.description },
  ];
  if (meta.robots) tags.push({ attr: 'name', key: 'robots', content: meta.robots });
  if (canonical) tags.push({ attr: 'property', key: 'og:url', content: canonical });

  return { title: meta.title, tags, canonical };
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export function renderHead(head: HeadSpec): string {
  const lines = [
    `<title>${escapeHtml(head.title)}</title>`,
    ...head.tags.map(
      (t) => `<meta ${t.attr}="${t.key}" content="${escapeHtml(t.content)}" />`,
    ),
  ];
  if (head.canonical) lines.push(`<link rel="canonical" href="${escapeHtml(head.canonical)}" />`);
  return lines.join('\n    ');
}

/** Apply a HeadSpec to the live document, updating tags in place (no duplicates). */
export function applyHead(head: HeadSpec): void {
  document.title = head.title;

  // Remove optional tags from a previous page that this page doesn't set.
  for (const key of ['robots', 'og:url']) {
    if (!head.tags.some((t) => t.key === key)) {
      document.head.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.remove();
    }
  }

  for (const tag of head.tags) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${tag.attr}="${tag.key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(tag.attr, tag.key);
      document.head.append(el);
    }
    el.content = tag.content;
  }

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (head.canonical) {
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.append(link);
    }
    link.href = head.canonical;
  } else {
    link?.remove();
  }
}
