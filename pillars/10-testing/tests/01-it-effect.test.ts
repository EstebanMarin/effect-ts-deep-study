import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { computeTotal } from "../exercises/01-it-effect.js"

it.effect("computeTotal sums the prices", () =>
  Effect.gen(function* () {
    const total = yield* computeTotal([10, 20, 5])
    expect(total).toBe(35)
  })
)

it.effect("computeTotal of an empty array is 0", () =>
  Effect.gen(function* () {
    const total = yield* computeTotal([])
    expect(total).toBe(0)
  })
)
