import type { Plugin } from 'vite';
import { MODES, DEFAULT_MODE, modePath } from '../src/config/modes.ts';
import { modeMeta, notFoundMeta } from '../src/config/seo.ts';
import { site } from '../src/config/site.ts';
import { buildHead, renderHead } from '../src/lib/meta.ts';
import type { Mode, PageMeta } from '../src/types/index.ts';

/**
 * Writes one static HTML file per portfolio route so that:
 *  - link-preview crawlers (which don't run JS) see route-specific <head> tags
 *  - each route (currently /career) loads directly on any static host
 *    (served as career/index.html) without SPA rewrite rules
 *  - <html data-mode> is correct before JS runs, so there is no theme flash
 *
 * index.html must contain the marker pair below and a data-mode attribute.
 */
const START = '<!--route-meta:start-->';
const END = '<!--route-meta:end-->';
const blockPattern = new RegExp(`${START}[\\s\\S]*?${END}`);

function renderPage(template: string, meta: PageMeta, path: string, mode: Mode): string {
  if (!blockPattern.test(template)) {
    throw new Error(`route-meta: index.html is missing the ${START} … ${END} markers`);
  }
  const head = renderHead(buildHead(meta, path, site.url));
  return template
    .replace(blockPattern, `${START}\n    ${head}\n    ${END}`)
    .replace(/data-mode="[^"]*"/, `data-mode="${mode}"`);
}

export function routeMetaPlugin(): Plugin {
  let release = false;
  return {
    name: 'route-meta',

    configResolved(config) {
      release = config.mode === 'release';
    },

    // Dev and build: give index.html the default mode's head tags.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        renderPage(html, modeMeta[DEFAULT_MODE], modePath(DEFAULT_MODE), DEFAULT_MODE),
    },

    // Build only: clone the final index.html (with hashed asset links) per route.
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html'];
        if (!index || index.type !== 'asset') {
          this.error('route-meta: index.html not found in bundle');
        }
        const template = String(index.source);

        for (const mode of MODES) {
          this.emitFile({
            type: 'asset',
            fileName: `${mode}/index.html`,
            source: renderPage(template, modeMeta[mode], modePath(mode), mode),
          });
        }

        // Unknown URLs: hosts that support 404.html serve the app with a real
        // 404 status; the client router then shows the Not Found page.
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: renderPage(template, notFoundMeta, '/404', DEFAULT_MODE),
        });

        if (!site.url) {
          const message = 'site.url is empty — canonical and og:url tags omitted. Set it in src/config/site.ts.';
          if (release) this.error(message);
          this.warn(message);
        }
      },
    },
  };
}
