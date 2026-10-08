import globals from 'globals'
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jestPlugin from 'eslint-plugin-jest'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'lib/**'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },
  {
    files: ['__tests__/**/*.ts'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: { ...globals.jest }
    },
    rules: {
      ...jestPlugin.configs.recommended.rules
    }
  }
]
