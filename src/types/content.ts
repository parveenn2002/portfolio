/** Structured content types. All public text lives in src/content and conforms to these. */

export interface NavItem {
  label: string;
  href: string;
}

/** How a project came about. Shown on every project so visitors can tell them apart. */
export type ProjectKind = 'employment' | 'client-style' | 'personal' | 'practice';

/** A `[CONFIRM: …]` marker, for values not yet confirmed (blocks `build:release`). */
export type Placeholder = `[CONFIRM:${string}]`;

export type ProjectStatus = 'in-progress' | 'complete';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  /** How the project came about — a placeholder until confirmed, never guessed. */
  kind: ProjectKind | Placeholder;
  status: ProjectStatus;
  summary: string;
  /** What you personally did on it. Required, so contribution is never implied. */
  role: string;
  stack: string[];
  /** Only real, public URLs. Empty array = no links shown. */
  links: ProjectLink[];
  caseStudyId?: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  organisation: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  projectId: string;
  context: string;
  approach: string[];
  outcome: string;
  contribution: string;
}

export interface Principle {
  title: string;
  body: string;
}

export interface LearningEntry {
  title: string;
  detail: string;
  period: string;
}

export interface Fact {
  label: string;
  value: string;
}

