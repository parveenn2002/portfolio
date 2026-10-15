import { useEffect } from 'react';
import { site } from '../config/site.ts';
import { applyHead, buildHead } from '../lib/meta.ts';
import type { Mode, PageMeta } from '../types/index.ts';

/**
 * Keeps <title>, meta tags and <html data-mode> in sync during client-side
 * navigation. The initial values are already in the static HTML from the build.
 */
export function usePageHead(meta: PageMeta, path: string, mode: Mode): void {
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    applyHead(buildHead(meta, path, site.url));
  }, [meta, path, mode]);
}
