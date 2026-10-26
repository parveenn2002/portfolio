/** One portfolio mode remains; the type is kept so the mode-aware utilities stay unchanged. */
export type Mode = 'career';

/** Metadata for one page, used both at build time (static HTML) and at runtime. */
export interface PageMeta {
  title: string;
  description: string;
  /** Browser UI colour; should match the mode's canvas token. */
  themeColor: string;
  /** e.g. "noindex" for the 404 page. Omit for normal pages. */
  robots?: string;
}

export interface SiteConfig {
  /** Production origin without trailing slash, e.g. "https://example.dev". Empty = not configured. */
  url: string;
  person: {
    name: string;
  };
  contact: {
    email: string;
    /** International format, digits only, e.g. "919876543210". Empty = hidden. */
    whatsapp: string;
  };
  /** Empty string = link hidden. */
  links: {
    github: string;
    linkedin: string;
  };
  resume: {
    /** Path under /public, e.g. "/resume/resume.pdf". */
    path: string;
    /** Set true only once the PDF exists in public/resume. */
    available: boolean;
  };
}
