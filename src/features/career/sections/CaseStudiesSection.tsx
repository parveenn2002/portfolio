import { Plus } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { caseStudies } from '../../../content/career.ts';
import { getProject } from '../../../content/projects.ts';
import { NodeMark } from '../NodeMark.tsx';

/** Open a case study when the URL hash points at it (e.g. from a project's link). */
function useOpenOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith('case-')) return;
      const details = document.getElementById(id)?.querySelector('details');
      if (details) details.open = true;
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <div className="mt-2 text-muted">{children}</div>
    </div>
  );
}

export function CaseStudiesSection() {
  useOpenOnHash();
  return (
    <Section id="case-studies" title="Case studies" intro="How specific problems were approached, in more depth.">
      <div className="space-y-5">
        {caseStudies.map((study, index) => {
          const project = getProject(study.projectId);
          return (
            <article
              key={study.id}
              id={`case-${study.id}`}
              aria-labelledby={`case-${study.id}-title`}
              className="rounded-2xl border border-line bg-surface/40"
            >
              <details className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-7 sm:p-9 [&::-webkit-details-marker]:hidden">
                  <div>
                    {project && (
                      <p className="text-sm text-muted">
                        <ContentText>{project.title}</ContentText>
                      </p>
                    )}
                    <h3
                      id={`case-${study.id}-title`}
                      className="mt-2 text-xl font-semibold text-balance text-ink"
                    >
                      <ContentText>{study.title}</ContentText>
                    </h3>
                  </div>
                  <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-transform duration-300 group-open:rotate-45">
                    <Plus size={18} aria-hidden="true" />
                  </span>
                </summary>

                <div className="grid gap-8 border-t border-line p-7 sm:p-9">
                  <Block title="Context">
                    <p className="max-w-prose">
                      <ContentText>{study.context}</ContentText>
                    </p>
                  </Block>
                  <Block title="Approach">
                    <ul className="max-w-prose space-y-3">
                      {study.approach.map((step) => (
                        <li key={step} className="flex items-baseline gap-3">
                          <NodeMark style="ring-accent" />
                          <span>
                            <ContentText>{step}</ContentText>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Block title="Outcome">
                      <p>
                        <ContentText>{study.outcome}</ContentText>
                      </p>
                    </Block>
                    <Block title="My contribution">
                      <p>
                        <ContentText>{study.contribution}</ContentText>
                      </p>
                    </Block>
                  </div>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
