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
    { label: 'Core skills', value: 'PHP, Laravel, MySQL, JavaScript, React' },
    { label: 'Also works with', value: 'AWS S3, Server Configuration, Postman, Git, AI Tools' },
  ] satisfies Fact[],
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    description: 'Building backend applications, business logic, and REST APIs.',
    items: ['PHP', 'Laravel', 'Backend development','Authentication',
      'Role-Based Access Control','ERP Module Development'],
  },
  {
    title: 'Databases',
    description: 'Designing, managing, and optimizing application databases.',
    items: [
      'MySQL',
      'SQL',
      'Database Design',
      'Database Management',
      'Query Optimization',
      'Bulk Excel Data Import',
    ],
  },
  {
    title: 'Infrastructure',
    description: 'Deploying, maintaining, and supporting production applications.',
    items: [
      'GoDaddy Server Handling',
      'Hosting & Maintenance',
      'Production Support',
      'Git',
      'Bitbucket'],
  },
   {
    title: 'Frontend Development',
    description: 'Building interactive web interfaces and supporting frontend integrations.',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'jQuery',
      'AJAX',
      'Phaser',
      'React.js',
    ],
  },
  {
    title: 'Testing & Integration',
    description: 'Testing APIs, integrating external services, and supporting reliable releases.',
    items: [
      'Postman',
      'Third-Party API Integration',
      'API Testing',
      'Debugging',
      'QA Collaboration',
      'Multi-language Applications',
      'Liveness & Smile Detection Flows',
    ],
  },
  {
    title: 'AI-Assisted Development',
    description: 'Using AI-powered tools to improve coding productivity and development workflows.',
    items: [
      'Cursor',
      'Antigravity',
      'ChatGPT',
      'Claude',
      'DeepSeek',
      'GitHub Copilot',
      'Prompt Engineering',
    ],
  },
];

export const experienceIntro = 'Three years of software development experience specializing in PHP, Laravel, REST APIs, MySQL, fintech applications, ERP modules, and production support.';

export const experience: ExperienceEntry[] = [
   {
    role: 'Junior Software Engineer',
    organisation: 'Anur Cloud Technologies',
    period: 'August 2023 – May 2026',
    summary:
      'Developed and maintained PHP/Laravel applications, REST APIs, MySQL databases, fintech verification platforms, and ERP modules.',
    highlights: [
      'Developed Laravel REST APIs for customer verification, onboarding, policy details, video consent, and PAN/Aadhaar verification integrations.',
      'Worked on 5+ Pre-Issuance Verification Call (PIVC) applications and 6+ Digital Visiting Card (DVC) platforms for fintech clients.',
      'Built School ERP modules covering student management, authentication, role-based access control, CRUD operations, reporting, and database management.',
      'Designed MySQL schemas, tested APIs using Postman, and supported debugging, deployment, and production releases.',
      'Handled application hosting and deployment on GoDaddy servers and managed source code, branching, and releases using Bitbucket.',
      'Used AI development tools to assist with code generation, debugging, optimization, documentation, and rapid feature development.',
    ],
    stack: [
      'PHP',
      'Laravel',
      'MySQL',
      'REST APIs',
      'JavaScript',
      'jQuery',
      'AJAX',
      'Phaser',
      'Postman',
    ],
  },

];

export const caseStudies: CaseStudy[] = [
  {
    id: 'school-erp',
    title: 'School ERP Management System',
    projectId: 'school-erp',
    context:
      'Developed a school management application to organize student information and administrative operations in a centralized system.',
    approach: [
      'Developed backend modules using PHP and Laravel.',
      'Implemented student management, CRUD operations, authentication, and role-based access control.',
      'Used MySQL for database design, data management, and reporting.',
      'Supported application deployment and hosting on GoDaddy and source code management through Bitbucket.',
    ],
    outcome:
      'Delivered a School ERP application with student management, authentication, administrative modules, reporting, and database management.',
    contribution:
      'Worked on backend development, database operations, application features, deployment, and source code management.',
  },
  {
    id: 'pivc-platform',
    title: 'Fintech PIVC Verification Platforms',
    projectId: 'pivc-platform',
    context:
      'Worked on fintech applications supporting pre-issuance policy verification and customer onboarding workflows.',
    approach: [
      'Developed and maintained Laravel REST APIs for customer validation, policy details, and video consent.',
      'Implemented customer verification workflows involving liveness checks and smile detection.',
      'Integrated PAN and Aadhaar verification services where required by the project.',
      'Tested APIs using Postman and collaborated with QA teams on bug fixes, releases, and production support.',
    ],
    outcome:
      'Contributed to 5+ PIVC applications, including Pramerica and Ageas projects, supporting customer verification and policy onboarding workflows.',
    contribution:
      'Contributed to backend API development, integration, validation, database management, debugging, and production support.',
  },
  {
    id: 'digital-visiting-cards',
    title: 'Digital Visiting Card Platforms',
    projectId: 'digital-visiting-cards',
    context:
      'Worked on digital visiting card platforms that manage customer information and display dynamic digital card content.',
    approach: [
      'Developed PHP/Laravel backend functionality and REST APIs for customer data retrieval.',
      'Supported bulk Excel data import and database management.',
      'Worked with JavaScript and Phaser for dynamic frontend rendering.',
    ],
    outcome:
      'Contributed to 6+ Digital Visiting Card platforms, including an LICHFL project involving more than 2,000 customer digital visiting cards.',
    contribution:
      'Worked on backend APIs, bulk data import, database operations, and frontend integration using JavaScript and Phaser.',
  },
];

// SAMPLE COPY — drafted for PARVEEN to review. Describes intentions, not
// specific security practices or production responsibilities.
export const principles: Principle[] = [
   {
    title: 'Maintainable code',
    body:
      'Build organized, readable PHP and Laravel applications that are easier to understand, debug, and extend.',
  },
  {
    title: 'Evidence-based debugging',
    body:
      'Investigate application issues, validate API behavior, and use testing and debugging to identify and resolve problems.',
  },
  {
    title: 'Reliable database operations',
    body:
      'Design and manage MySQL databases carefully, maintain data consistency, and improve database operations where needed.',
  },
  {
    title: 'API integration and validation',
    body:
      'Develop and test REST APIs, validate application data, and integrate external services to support business workflows.',
  },
  {
    title: 'Production readiness',
    body:
      'Support application deployment, server maintenance, release management, and post-deployment debugging.',
  },
  {
    title: 'Responsible AI-assisted development',
    body:
      'Use AI tools for code generation, debugging, optimization, documentation, and prototyping while reviewing suggested changes.',
  },
];

// Education and certifications: placeholder until PARVEEN supplies details.
// Delete the entry (and the section in CareerPage.tsx) if she prefers to omit it.
export const learning: LearningEntry[] = [
   {
    title: 'B.Sc. Computer Science',
    detail: 'Bishop Heber College',
    period: 'August 2020 – April 2023',
  },
  {
    title: 'Responsive Web Design Coursework',
    detail: 'freeCodeCamp',
    period: 'September 2023 – November 2023',
  },
  {
    title: 'English Typewriting',
    detail: 'Certification',
    period: 'April 2022 – August 2022',
  },
];

export const careerContact = {
  heading: 'Get in touch',
  body:
    'Open to PHP Developer, Laravel Developer, and PHP Backend Developer opportunities. Interested in building web applications, REST APIs, ERP systems, and fintech solutions. Email is the quickest way to reach me.',
};
