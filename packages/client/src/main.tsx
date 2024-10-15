// eslint-disable-line unicorn/filename-case
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import {RouterProvider, createRouter} from '@tanstack/react-router';
import './index.css';
// Import the generated route tree
import {routeTree} from './routeTree.gen';

// Create a new router instance
const router = createRouter({routeTree});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  type Register = {
    router: typeof router;
  };
}

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
