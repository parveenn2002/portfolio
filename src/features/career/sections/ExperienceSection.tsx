import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { experience, experienceIntro } from '../../../content/career.ts';

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience" intro={experienceIntro}>
      <ol>
        {experience.map((entry, i) => (
          <li
            key={`${entry.role}-${i}`}
            className="relative pb-14 pl-9 last:pb-0 before:absolute before:top-4 before:bottom-0 before:left-[5px] before:w-px before:bg-line last:before:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute top-[0.45rem] left-0 size-[11px] rounded-full border border-accent ${
                i === 0 ? 'bg-accent' : 'bg-canvas'
              }`}
            />
            <p className="text-sm text-muted">
              <ContentText>{entry.period}</ContentText>
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              <ContentText>{entry.role}</ContentText>
            </h3>
            <p className="mt-1 text-muted">
              <ContentText>{entry.organisation}</ContentText>
            </p>
            <p className="mt-4 max-w-prose text-ink">{entry.summary}</p>
            {entry.highlights.length > 0 && (
              <ul className="mt-4 max-w-prose list-disc space-y-2 pl-5 text-muted marker:text-line">
                {entry.highlights.map((h) => (
                  <li key={h}>
                    <ContentText>{h}</ContentText>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 text-sm text-muted">
              <span className="text-ink">Stack </span>
              {entry.stack.map((s, k) => (
                <span key={s}>
                  {k > 0 && ', '}
                  <ContentText>{s}</ContentText>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
