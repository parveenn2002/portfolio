import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { skillGroups } from '../../../content/career.ts';
import { NodeMark } from '../NodeMark.tsx';

// Uniform markers: no skill is presented as stronger or newer than another without confirmation.

export function SkillsSection() {
  return (
    <Section
      id="skills"
      title="Skills"
      intro="Grouped by how I use them rather than by self-rated levels."
    >
      <div className="divide-y divide-line">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="grid gap-6 py-10 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-10"
          >
            <div>
              <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
              <p className="mt-2 max-w-sm text-muted">{group.description}</p>
            </div>
            <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-ink">
                  <NodeMark style="solid-accent" />
                  <span>
                    <ContentText>{item}</ContentText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
