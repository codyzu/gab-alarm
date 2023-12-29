import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
// Import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import unoCSS from 'unocss/vite';

const path = fileURLToPath(import.meta.url);
const root = resolve(dirname(path), 'src');
const plugins = [unoCSS(), react()];

export default {root, plugins};
