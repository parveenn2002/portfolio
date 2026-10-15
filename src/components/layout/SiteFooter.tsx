import { modeNavigation } from '../../config/navigation.ts';
import { site } from '../../config/site.ts';
import type { Mode } from '../../types/index.ts';
import { ContactLinks } from '../ui/ContactLinks.tsx';
import { ContentText } from '../ui/ContentText.tsx';

const year = new Date().getFullYear();

export function SiteFooter({ mode }: { mode: Mode }) {
  return (
    <footer className="mx-auto max-w-content px-6 sm:px-10">
      <div className="grid gap-8 border-t border-line py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            <ContentText>{site.person.name}</ContentText>
          </p>
          <p className="mt-2 max-w-prose text-sm text-muted">{modeNavigation[mode].footerNote}</p>
        </div>
        <ContactLinks variant="inline" />
      </div>
      <div className="flex items-center justify-between gap-6 pb-10 text-sm text-muted">
        <p>
          © {year} <ContentText>{site.person.name}</ContentText>
        </p>
        <a href="#top" className="transition-colors hover:text-ink">
          Back to top
        </a>
      </div>
    </footer>
  );
}
