import typescript from '@typescript-eslint/parser'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import workspaces from 'eslint-plugin-workspaces'

export default [
  {ignores: ['node_modules','**/node_modules', '**/dist', '**/.sanity', '**/.astro', ]},
  {
    files: ['*.tsx', '*.ts'],
    languageOptions: {
      parser: typescript,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      workspaces: workspaces,
    },
    rules: {
      'workspaces/no-relative-imports': 'error',
      'workspaces/require-dependency': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]