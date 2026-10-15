import { isRouteErrorResponse, useRouteError } from 'react-router';
import { NotFoundPage } from './NotFoundPage.tsx';

/** Router error boundary: 404s get the Not Found page, anything else a generic message. */
export function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  if (import.meta.env.DEV) console.error(error);

  // Typically a failed lazy chunk after a redeploy; a reload fetches the new build.
  return (
    <NotFoundPage
      heading="Something went wrong"
      message="This page could not be loaded. Please refresh the page and try again."
    />
  );
}
