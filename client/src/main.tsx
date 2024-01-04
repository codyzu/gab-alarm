// eslint-disable-line unicorn/filename-case
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import {
  RootRoute,
  Route,
  Router,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import App from './App.tsx';
import Admin from './Admin.tsx';
import './index.css';

console.log('mode', import.meta.env.PROD);

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(async () =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((module) => ({
        default: module.TanStackRouterDevtools,
      })),
    );

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});
const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute]);
const router = new Router({routeTree});

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
