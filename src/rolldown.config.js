import { resolve } from "node:path";

import { defineConfig } from "rolldown";

export default defineConfig({
  input: resolve(import.meta.dirname, "main.tsx"),
  output: {
    file: resolve(import.meta.dirname, "../docs/main.js"),
    minify: true,
  },
});
