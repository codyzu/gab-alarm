// eslint-disable-line unicorn/filename-case
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'uno.css';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
