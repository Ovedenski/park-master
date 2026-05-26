import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Next.js' `server-only` package throws when imported outside a server
      // bundle. In Vitest (plain Node) we replace it with an empty module so
      // schemas that `import "server-only"` are still importable in tests.
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});