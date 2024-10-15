import {createRootRoute, Outlet} from '@tanstack/react-router';
import {lazy} from 'react';

console.log('production mode', import.meta.env.PROD);

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(async () =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((module) => ({
        default: module.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
