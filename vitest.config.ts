import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/!(_)*.{ts,tsx,mjs}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts'],
      thresholds: { lines: 95 },
    },
    restoreMocks: true,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'jsx-slack',
  },
  oxc: false as any,
  resolve: {
    alias: [
      {
        find: /^jsx-slack(\/.*)?$/,
        replacement: path.resolve(import.meta.dirname, 'src') + '$1',
      },
    ],
    conditions: ['node'],
  },
})
