import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**', 'pages/**', 'api/**'],
  },
  prettier,
  {
    ignores: ['playwright-report/**', 'test-results/**', 'node_modules/**'],
  },
);
