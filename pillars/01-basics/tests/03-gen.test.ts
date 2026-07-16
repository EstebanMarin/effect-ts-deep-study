import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { pipeVersion, genVersion } from "../exercises/03-gen.js"

it.effect("pipeVersion computes (n * 2) + 10 using pipe", () =>
  Effect.gen(function* () {
    const result = yield* pipeVersion(5)
    expect(result).toBe(20)
  })
)

it.effect("genVersion produces the same result as pipeVersion", () =>
  Effect.gen(function* () {
    const [pipe5, gen5] = yield* Effect.all([pipeVersion(5), genVersion(5)])
    expect(pipe5).toBe(gen5)
    expect(gen5).toBe(20)
  })
)

it.effect("genVersion works for various inputs", () =>
  Effect.gen(function* () {
    const result = yield* genVersion(0)
    expect(result).toBe(10) // (0 * 2) + 10
  })
)
