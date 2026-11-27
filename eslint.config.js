import tseslint from 'typescript-eslint';
export default [
  { ignores: ['node_modules/**', 'site/dist/**', 'site/.astro/**', 'site/public/lab/**', 'test-results/**', 'playwright-report/**'] },
  ...tseslint.configs.recommended,
];
