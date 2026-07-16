import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["pillars/**/tests/**/*.test.ts"],
    globals: false,
  },
})
