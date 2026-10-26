import { Link } from 'react-router';
import { SkipLink } from '../components/layout/ModeLayout.tsx';
import { DEFAULT_MODE, modePath } from '../config/modes.ts';
import { notFoundMeta } from '../config/seo.ts';
import { usePageHead } from '../hooks/usePageHead.ts';

interface NotFoundPageProps {
  heading?: string;
  message?: string;
}

export function NotFoundPage({
  heading = 'Page not found',
  message = 'The page you are looking for does not exist or has moved.',
}: NotFoundPageProps) {
  usePageHead(notFoundMeta, '/404', DEFAULT_MODE);

  return (
    <>
      <SkipLink />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex min-h-dvh max-w-content flex-col justify-center px-6 outline-none sm:px-10"
      >
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{heading}</h1>
        <p className="mt-4 max-w-prose text-muted">{message}</p>
        <p className="mt-8">
          <Link
            to={modePath(DEFAULT_MODE)}
            className="text-ink underline decoration-accent underline-offset-4 hover:text-accent"
          >
            Go to the homepage
          </Link>
        </p>
      </main>
    </>
  );
}
