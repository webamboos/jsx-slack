import { defineConfig } from 'rolldown'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = (id) =>
  Object.keys(pkg.dependencies).some((dep) => dep === id || id.startsWith(`${dep}/`))

export default defineConfig([
  {
    external,
    input: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name]-[hash].mjs',
      preserveModules: true,
      exports: 'named',
      minify: true,
      sourcemap: true,
    },
    platform: 'node',
    tsconfig: './tsconfig.json',
  },
])
