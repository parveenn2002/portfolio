import type {
  CaseStudy,
  ExperienceEntry,
  Fact,
  LearningEntry,
  Principle,
  SkillGroup,
} from '../types/content.ts';

/**
 * PARVEEN's career portfolio content.
 *
 * Confirmed facts: PHP Developer, 3 years of experience; PHP development,
 * Laravel, database development and management, backend development,
 * server-related knowledge and configuration, AI tools for development and
 * productivity. Nothing else may be stated as fact.
 *
 * [CONFIRM: …]  = a detail only PARVEEN can supply. Highlighted on the page
 *                 and blocks `npm run build:release` until replaced.
 * SAMPLE COPY   = wording drafted from the confirmed facts for PARVEEN to
 *                 review and rewrite in her own voice.
 */

export const careerHero = {
  // SAMPLE COPY
  heading: 'Backend development with PHP and Laravel.',
  // SAMPLE COPY
  lede: 'PHP developer with three years of experience building the backend of web applications — the application logic, the databases behind it and the servers it runs on — with a focus on code that stays maintainable.',
  facts: [
    { label: 'Role', value: 'PHP Developer' },
    { label: 'Experience', value: '3 years' },
    { label: 'Core skills', value: 'PHP, Laravel, databases' },
    { label: 'Also works with', value: 'Server configuration, AI tools' },
  ] satisfies Fact[],
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    description: 'Building the server side of web applications.',
    items: ['PHP', 'Laravel', 'Backend development'],
  },
  {
    title: 'Databases',
    description: 'Designing and managing the data that applications depend on.',
    items: [
      'Database development',
      'Database management',
      '[CONFIRM: specific database technologies, e.g. MySQL — or remove]',
    ],
  },
  {
    title: 'Infrastructure',
    description: 'Configuring the servers that applications run on.',
    items: ['Server configuration', '[CONFIRM: specific servers, tools or deployment work — or remove]'],
  },
  {
    title: 'Developer productivity',
    description: 'Using AI tools to support everyday development work.',
    items: ['AI tools for development', '[CONFIRM: specific AI tools — or remove]'],
  },
];

export const experienceIntro = 'Three years of PHP development. Details marked for review are still to be confirmed.';

export const experience: ExperienceEntry[] = [
  {
    role: 'PHP Developer', // [CONFIRM: exact job title if different]
    organisation: '[CONFIRM: employer name, or “Not disclosed”]',
    period: '[CONFIRM: start month and year] – [CONFIRM: end, or “present”]',
    summary: 'PHP and Laravel development, database work and backend development.',
    highlights: ['[CONFIRM: two or three responsibilities PARVEEN can describe publicly]'],
    stack: ['PHP', 'Laravel', '[CONFIRM: other technologies used in this role]'],
  },
  // If the three years span more than one employer, copy the entry above per role.
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'laravel-app',
    title: '[CONFIRM: case study title for one real project]',
    projectId: 'laravel-app',
    context: '[CONFIRM: what the project needed to do and why]',
    approach: ['[CONFIRM: two to four concrete things PARVEEN built or decided, and why]'],
    outcome: '[CONFIRM: what was delivered — only include numbers that were actually measured]',
    contribution: '[CONFIRM: exactly what PARVEEN did, and what others did]',
  },
];

// SAMPLE COPY — drafted for PARVEEN to review. Describes intentions, not
// specific security practices or production responsibilities.
export const principles: Principle[] = [
  {
    title: 'Code that stays maintainable',
    body: 'Clear structure and readable code, so a feature can be changed later without unpicking everything around it.',
  },
  {
    title: 'Debug from the evidence',
    body: 'Reproduce the problem, narrow it down and confirm the cause before changing code.',
  },
  {
    title: 'Care for the data',
    body: 'Applications are only as reliable as their data, so database changes are made deliberately and checked carefully.',
  },
  {
    title: 'Security in mind',
    body: 'Treat input with suspicion and keep sensitive configuration out of code.',
  },
  {
    title: 'AI as a practical tool',
    body: 'Use AI tools to work faster on routine tasks, while reviewing and understanding every change they suggest.',
  },
];

// Education and certifications: placeholder until PARVEEN supplies details.
// Delete the entry (and the section in CareerPage.tsx) if she prefers to omit it.
export const learning: LearningEntry[] = [
  {
    title: '[CONFIRM: qualification or certification]',
    detail: '[CONFIRM: institution or issuer]',
    period: '[CONFIRM: year]',
  },
];

export const careerContact = {
  heading: 'Get in touch',
  body: 'Open to [CONFIRM: the roles PARVEEN is looking for, e.g. PHP or Laravel developer positions]. Email is the quickest way to reach me.',
};
