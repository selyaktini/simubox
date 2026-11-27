import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await mkdir('site/public/lab', { recursive: true });
await build({ entryPoints: ['simulations/lorenz/app.ts'], bundle: true, format: 'iife', target: 'es2022', outfile: 'site/public/lab/app.js', minify: true });
console.log('Built first-party Lorenz simulation');
