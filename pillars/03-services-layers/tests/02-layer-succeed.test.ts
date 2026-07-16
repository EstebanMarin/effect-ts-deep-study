import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { program, ConfigLive, describeConfig } from "../exercises/02-layer-succeed.js"

it.effect("program describes the provided config", () =>
  Effect.gen(function* () {
    const result = yield* program
    expect(result).toBe("https://api.example.com (timeout 3000ms)")
  })
)

it.effect("ConfigLive can be provided to describeConfig directly", () =>
  Effect.gen(function* () {
    const result = yield* Effect.provide(describeConfig, ConfigLive)
    expect(result).toBe("https://api.example.com (timeout 3000ms)")
  })
)
