import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { learning } from '../../../content/career.ts';

export function LearningSection() {
  return (
    <Section id="learning" title="Education and certifications">
      <ul className="divide-y divide-line border-y border-line">
        {learning.map((entry) => (
          <li
            key={entry.title}
            className="grid gap-2 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10"
          >
            <div>
              <h3 className="text-lg font-semibold text-ink">{entry.title}</h3>
              <p className="mt-2 max-w-prose text-muted">
                <ContentText>{entry.detail}</ContentText>
              </p>
            </div>
            <p className="text-sm text-muted sm:pt-1 sm:text-right">
              <ContentText>{entry.period}</ContentText>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
