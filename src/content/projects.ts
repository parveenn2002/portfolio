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
    label: 'Industry Experience',
    description: 'Projects developed and maintained in a professional work environment.',
  },
  'client-style': {
    label: 'Business Solutions',
    description: 'Applications designed to address specific business requirements.',
  },
  personal: {
    label: 'Independent Projects',
    description: 'Projects developed independently to explore ideas and build practical solutions.',
  },
  practice: {
    label: 'Technical Experiments',
    description: 'Hands-on implementations created to strengthen technical skills and explore new technologies.',
  },
};

export const projects: Project[] = [
 {
    id: 'laravel-app',
    title: 'School ERP Management System',
    kind: 'employment',
    status: 'complete',
    summary:
      'A school management application designed to centralize student information and support administrative operations through organized ERP modules.',
    role:
      'Worked on backend development, student management functionality, CRUD operations, authentication, role-based access, database operations, and application maintenance.',
    stack: [
      'PHP',
      'Laravel',
      'MySQL',
      'REST APIs',
      'JavaScript',
      'HTML',
      'CSS',
    ],
    links: [],
    caseStudyId: 'school-erp',
  },
  {
    id: 'backend-api',
    title: 'Fintech PIVC Verification Platforms',
    kind: 'employment',
    status: 'complete',
    summary:
      'Worked on more than five Pre-Issuance Verification Call (PIVC) applications supporting customer verification, policy onboarding, consent capture, and insurance-related workflows for fintech clients.',
    role:
      'Developed and maintained Laravel REST APIs, implemented validations, integrated verification services, supported liveness and smile-detection workflows, tested APIs using Postman, and assisted with debugging and production releases.',
    stack: [
      'PHP',
      'Laravel',
      'MySQL',
      'REST APIs',
      'Postman',
      'JavaScript',
      'Third-party API Integration',
    ],
    links: [],
    caseStudyId: 'pivc-platform',
  },
  {
    id: 'database-app',
    title: 'Digital Visiting Card Platforms',
    kind: 'employment',
    status: 'complete',
    summary:
      'Contributed to more than six Digital Visiting Card (DVC) platforms, including an LICHFL project involving over 2,000 customer digital cards. The applications supported customer data management and dynamic card presentation.',
    role:
      'Worked on PHP backend functionality, database operations, bulk Excel data imports, and integration with dynamic frontend components.',
    stack: [
      'PHP',
      'Laravel',
      'MySQL',
      'JavaScript',
      'Phaser',
      'Excel Data Import',
    ],
    links: [],
    caseStudyId: 'digital-visiting-cards',
  },
  {
    id: 'server-work',
    title: 'Application Deployment and Production Support',
    kind: 'employment',
    status: 'complete',
    summary:
      'Supported application hosting, deployment, maintenance, and production releases for web applications hosted on GoDaddy.',
    role:
      'Handled deployment-related tasks, supported server and hosting configuration, investigated application issues, coordinated fixes, and assisted with release management and ongoing maintenance.',
    stack: [
      'GoDaddy',
      'PHP',
      'Laravel',
      'MySQL',
      'Git',
      'Bitbucket',
    ],
    links: [],
  },
  {
    id: 'ai-workflow',
    title: 'AI-Assisted Software Development Workflow',
    kind: 'employment',
    status: 'complete',
    summary:
      'Used AI-assisted development tools to support software development tasks, including code generation, debugging, code improvement, documentation, and rapid prototyping.',
    role:
      'Used AI tools alongside PHP/Laravel development to explore implementation approaches, troubleshoot errors, improve existing code, and accelerate routine development tasks. AI tools supported the workflow rather than representing a separately verified AI product.',
    stack: [
      'ChatGPT',
      'Claude',
      'DeepSeek',
      'Cursor',
      'GitHub Copilot',
      'Prompt Engineering',
    ],
    links: [],
  },
];

export const getProject = (id: string): Project | undefined => projects.find((p) => p.id === id);
