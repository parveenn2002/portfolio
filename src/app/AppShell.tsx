import { Outlet, ScrollRestoration } from 'react-router';

export function AppShell() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
