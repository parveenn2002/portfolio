import type { Project, ProjectKind } from '../types/content.ts';

/**
 * PARVEEN's projects.
 *
 * The entries below are SUGGESTED CATEGORIES ONLY — not claims that these
 * projects exist. Replace each with real work she can describe publicly, or
 * delete it. Set `kind` to how the project came about ('employment',
 * 'client-style', 'personal' or 'practice'). Never include employer code,
 * internal systems, client names or data she isn't allowed to share, and only
 * add links that are public.
 */
export const projectKindLabels: Record<ProjectKind, { label: string; description: string }> = {
  employment: {
    label: 'Professional work',
    description: 'Done as part of a job.',
  },
  'client-style': {
    label: 'Client-style project',
    description: 'Built to a real brief, as for a client.',
  },
  personal: {
    label: 'Personal project',
    description: 'Self-initiated.',
  },
  practice: {
    label: 'Practice project',
    description: 'Built to learn a specific tool or technique.',
  },
};

export const projects: Project[] = [
  {
    id: 'laravel-app',
    title: '[CONFIRM: project title — e.g. a Laravel web application]',
    kind: '[CONFIRM: project type — professional, client-style, personal or practice]',
    status: 'complete',
    summary: '[CONFIRM: one or two sentences on what the application does and who uses it]',
    role: '[CONFIRM: what PARVEEN built or was responsible for]',
    stack: ['PHP', 'Laravel', '[CONFIRM: other technologies used]'],
    links: [],
    caseStudyId: 'laravel-app',
  },
  {
    id: 'backend-api',
    title: '[CONFIRM: project title — e.g. a backend API]',
    kind: '[CONFIRM: project type — professional, client-style, personal or practice]',
    status: 'complete',
    summary: '[CONFIRM: what the API provides and which applications use it]',
    role: '[CONFIRM: PARVEEN’s role]',
    stack: ['PHP', '[CONFIRM: framework and other technologies used]'],
    links: [],
  },
  {
    id: 'database-app',
    title: '[CONFIRM: project title — e.g. a database-driven application]',
    kind: '[CONFIRM: project type — professional, client-style, personal or practice]',
    status: 'complete',
    summary: '[CONFIRM: what data it manages and what the database work involved]',
    role: '[CONFIRM: PARVEEN’s role]',
    stack: ['PHP', '[CONFIRM: database technology, e.g. MySQL]'],
    links: [],
  },
  {
    id: 'server-work',
    title: '[CONFIRM: project title — e.g. server setup, deployment or maintenance]',
    kind: '[CONFIRM: project type — professional, client-style, personal or practice]',
    status: 'complete',
    summary: '[CONFIRM: what was set up or maintained, described without internal details]',
    role: '[CONFIRM: PARVEEN’s role]',
    stack: ['[CONFIRM: server software and tools used]'],
    links: [],
  },
  {
    id: 'ai-workflow',
    title: '[CONFIRM: project title — e.g. an AI-assisted development workflow, or delete this entry]',
    kind: '[CONFIRM: project type — professional, client-style, personal or practice]',
    status: 'complete',
    summary: '[CONFIRM: how AI tools were used in the work and what they helped with]',
    role: '[CONFIRM: PARVEEN’s role]',
    stack: ['[CONFIRM: AI tools used]'],
    links: [],
  },
];

export const getProject = (id: string): Project | undefined => projects.find((p) => p.id === id);
