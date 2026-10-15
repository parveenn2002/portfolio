import { Section } from '../../../components/ui/Section.tsx';
import { principles } from '../../../content/career.ts';

export function ApproachSection() {
  return (
    <Section id="approach" title="How I work">
      <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {principles.map((p) => (
          <div key={p.title} className="border-l border-line pl-6">
            <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
            <p className="mt-3 text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
