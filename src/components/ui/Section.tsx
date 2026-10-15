import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Page section with a labelled heading. On large screens the heading sits in
 * a sticky left column beside the content, like a technical document.
 */
export function Section({ id, title, intro, children }: SectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="mx-auto max-w-content px-6 sm:px-10">
      <div className="border-t border-line py-20 sm:py-28 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
            <h2
              id={titleId}
              className="font-display text-display font-semibold text-balance text-ink"
            >
              {title}
            </h2>
            {intro && <div className="mt-4 max-w-prose text-muted lg:max-w-xs">{intro}</div>}
          </div>
        </header>
        <div className="mt-10 lg:col-span-8 lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
