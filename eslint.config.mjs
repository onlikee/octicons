import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/generated/**', '**/__generated__/**', 'icons/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.{ts,vue}'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['**/*.vue'],
    extends: [vue.configs['flat/essential']],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}', '**/vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/*/src/**/*.ts', 'tests/**/*.{ts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['tests/types/*.vue'],
    // These files are template type fixtures, not reusable components.
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  prettier,
])
