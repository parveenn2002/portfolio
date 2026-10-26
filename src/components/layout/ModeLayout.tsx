import type { ReactNode } from 'react';
import { modePath } from '../../config/modes.ts';
import { modeMeta } from '../../config/seo.ts';
import { usePageHead } from '../../hooks/usePageHead.ts';
import type { Mode } from '../../types/index.ts';
import { SiteFooter } from './SiteFooter.tsx';
import { SiteHeader } from './SiteHeader.tsx';

interface ModeLayoutProps {
  mode: Mode;
  children: ReactNode;
}

/**
 * Shell for one portfolio mode: theme, metadata, landmarks, header and footer.
 * The header is fixed, so a page's first section is responsible for clearing
 * it (pt-(--header-height)) — this lets hero backgrounds run underneath it.
 */
export function ModeLayout({ mode, children }: ModeLayoutProps) {
  usePageHead(modeMeta[mode], modePath(mode), mode);

  return (
    <>
      <SkipLink />
      <div id="top" />
      <SiteHeader mode={mode} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter mode={mode} />
    </>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
    >
      Skip to content
    </a>
  );
}
