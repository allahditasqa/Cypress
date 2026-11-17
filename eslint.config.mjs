// ESLint (flat config): TypeScript + Cypress best practices. `npm run lint`
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import cypress from 'eslint-plugin-cypress';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['node_modules', 'reports', 'mochawesome-report', 'cypress/screenshots', 'cypress/downloads', 'scripts'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts'],
    extends: [cypress.configs.recommended],
    rules: {
      'cypress/no-unnecessary-waiting': 'warn',
    },
  },
);
