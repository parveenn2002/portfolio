import { createBrowserRouter, Navigate } from 'react-router';
import { DEFAULT_MODE, modePath } from '../config/modes.ts';
import { AppShell } from './AppShell.tsx';
import { NotFoundPage } from './NotFoundPage.tsx';
import { RouteError } from './RouteError.tsx';

/**
 * The career page is code-split from the shell. Paths must stay in sync with MODES (build/route-meta-plugin.ts
 * writes one static HTML file per mode).
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    // Shown only while the first lazy page chunk loads. The page background
    // already comes from the static HTML's data-mode, so a blank area is enough.
    HydrateFallback: () => <div className="min-h-dvh" aria-busy="true" />,
    children: [
      { index: true, element: <Navigate to={modePath(DEFAULT_MODE)} replace /> },
      {
        path: modePath('career'),
        lazy: () =>
          import('../features/career/CareerPage.tsx').then((m) => ({ Component: m.CareerPage })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
