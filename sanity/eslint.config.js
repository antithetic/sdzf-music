// eslint.config.js

import studio from '@sanity/eslint-config-studio'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import importPlugin from 'eslint-plugin-import'
import typescriptEslint from 'typescript-eslint'

export default [
  ...typescriptEslint.configs.recommended,
  ...studio,
  {
    ignores: ['dist', 'node_modules', '.sanity'],
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/no-default-export': 'error',
      
    },
  },
  {
    files: ['**/sanity.config.ts', '**/sanity.cli.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]