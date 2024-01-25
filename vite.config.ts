import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import unoCSS from 'unocss/vite';

const path = fileURLToPath(import.meta.url);
const root = resolve(dirname(path), 'client');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [unoCSS(), react()],
  root,
  publicDir: resolve(dirname(path), 'public'),
  server: {
    proxy: {
      /* eslint-disable @typescript-eslint/naming-convention */
      '/schedule': 'http://localhost:3000',
      '^/morning.*': 'http://localhost:3000',
      '^/night.*': 'http://localhost:3000',
      /* eslint-enable @typescript-eslint/naming-convention */
    },
  },
});
