import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["test/**/*.{ts,tsx,mjs}"],
    restoreMocks: true,
  },
  esbuild: {
    jsx: "automatic",
  },
  oxc: false,
});
