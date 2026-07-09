import { defineConfig } from "rolldown";

export default defineConfig([
  {
    external: /^[^./]/,
    input: ["src/index.ts", "src/jsx-runtime.ts", "src/jsx-dev-runtime.ts"],
    output: {
      dir: "dist",
      cleanDir: true,
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name]-[hash].mjs",
      preserveModules: true,
      preserveModulesRoot: import.meta.dirname + "/src",
      exports: "named",
      minify: false,
      sourcemap: true,
    },
    platform: "node",
    transform: {
      jsx: "react-jsx",
      tsconfig: true,
    },
  },
]);
