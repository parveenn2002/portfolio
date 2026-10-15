import { ArrowUpRight } from 'lucide-react';
import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { projectKindLabels, projects } from '../../../content/projects.ts';
import { isPlaceholder } from '../../../lib/placeholder.ts';
import type { Project, ProjectKind } from '../../../types/content.ts';
import { NodeMark, type NodeStyle } from '../NodeMark.tsx';

const kindMark: Record<ProjectKind, NodeStyle> = {
  employment: 'solid-ink',
  'client-style': 'solid-accent',
  personal: 'ring-accent',
  practice: 'ring-muted',
};

const statusLabel: Record<Project['status'], string> = {
  'in-progress': 'In progress',
  complete: 'Complete',
};

function ProjectEntry({ project }: { project: Project }) {
  const confirmed = !isPlaceholder(project.kind);
  const kind = confirmed ? projectKindLabels[project.kind as ProjectKind] : { label: project.kind, description: '' };
  return (
    <li className="flex flex-col bg-canvas p-7 sm:p-9 md:odd:last:col-span-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="flex items-center gap-2.5 text-ink" title={kind.description || undefined}>
          <NodeMark style={confirmed ? kindMark[project.kind as ProjectKind] : 'ring-muted'} />
          <ContentText>{kind.label}</ContentText>
        </p>
        <p className="text-muted">{statusLabel[project.status]}</p>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-balance text-ink">
        <ContentText>{project.title}</ContentText>
      </h3>
      <p className="mt-3 max-w-prose text-muted">
        <ContentText>{project.summary}</ContentText>
      </p>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:gap-y-3">
        <dt className="text-muted">My role</dt>
        <dd className="text-ink">
          <ContentText>{project.role}</ContentText>
        </dd>
        <dt className="text-muted">Stack</dt>
        <dd className="text-ink">{project.stack.join(', ')}</dd>
      </dl>

      {(project.links.length > 0 || project.caseStudyId) && (
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8 text-sm">
          {project.caseStudyId && (
            <a
              href={`#case-${project.caseStudyId}`}
              className="text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-accent"
            >
              Read the case study
            </a>
          )}
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-accent"
            >
              {link.label}
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

export function ProjectsSection() {
  const kindsInUse = [...new Set(projects.map((p) => p.kind))].filter((k): k is ProjectKind => !isPlaceholder(k));
  return (
    <Section
      id="projects"
      title="Selected projects"
      intro={
        <>
          <p>Each project says how it came about and what I did on it.</p>
          {kindsInUse.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm">
              {kindsInUse.map((k) => (
                <li key={k} className="flex items-baseline gap-2.5">
                  <NodeMark style={kindMark[k]} />
                  <span>
                    <span className="text-ink">{projectKindLabels[k].label}.</span>{' '}
                    {projectKindLabels[k].description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      }
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {projects.map((project) => (
          <ProjectEntry key={project.id} project={project} />
        ))}
      </ul>
    </Section>
  );
}
