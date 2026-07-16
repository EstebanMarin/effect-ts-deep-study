import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { incrementN } from "../exercises/02-atomic-increment.js"

it.effect("increments the counter the requested number of times", () =>
  Effect.gen(function* () {
    const result = yield* incrementN(5)
    expect(result).toBe(5)
  })
)

it.effect("returns 0 when asked to increment zero times", () =>
  Effect.gen(function* () {
    const result = yield* incrementN(0)
    expect(result).toBe(0)
  })
)

it.effect("handles larger counts", () =>
  Effect.gen(function* () {
    const result = yield* incrementN(100)
    expect(result).toBe(100)
  })
)
