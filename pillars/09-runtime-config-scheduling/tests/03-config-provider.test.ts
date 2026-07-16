import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { runWithConfig } from "../exercises/03-config-provider.js"

it.effect("reads HOST and PORT from the provider", () =>
  Effect.gen(function* () {
    const result = yield* runWithConfig({ HOST: "localhost", PORT: "8080" })
    expect(result).toBe("localhost:8080")
  })
)

it.effect("reads different values from a different provider", () =>
  Effect.gen(function* () {
    const result = yield* runWithConfig({ HOST: "api.example.com", PORT: "443" })
    expect(result).toBe("api.example.com:443")
  })
)

it.effect("fails when a required key is missing", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(runWithConfig({ HOST: "localhost" }))
    expect(Exit.isFailure(exit)).toBe(true)
  })
)
