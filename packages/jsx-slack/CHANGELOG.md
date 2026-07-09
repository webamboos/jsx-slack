# @webamboos/jsx-slack

## 7.0.0

### Major Changes

- d12b9e7: This release modernizez the project, drops CJS completely and migrates to a monorepo setup.

  - Migrated `jest` to `vitest`
  - Migrated `rollup` to `rolldown` and dropped the need for Babel
  - Dropped CJS support completely, the output is no ESM-only
  - Updated TypeScript to v6
  - Restructured into a monorepo: `packages/jsx-slack` now contains the library code and `packages/demo` contains some basic code to test the bundled package.
  - Added `mise` for managing Node and PNPM versions
  - Migrated to oxlint and oxfmt from eslint/prettier

  No new Slack blocks yet. We are planning to add support for newer Slack blocks in minor versions.
