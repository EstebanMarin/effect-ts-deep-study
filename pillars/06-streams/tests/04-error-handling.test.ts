import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { collectWithFallback } from "../exercises/04-error-handling.js"

it.effect("collectWithFallback appends the fallback when the stream fails", () =>
  Effect.gen(function* () {
    // emits 1, 2, then fails at -1 -> recover appends fallback 99
    const result = yield* collectWithFallback([1, 2, -1, 3], 99)
    expect(result).toEqual([1, 2, 99])
  })
)

it.effect("collectWithFallback passes values through when nothing fails", () =>
  Effect.gen(function* () {
    const result = yield* collectWithFallback([1, 2, 3], 99)
    expect(result).toEqual([1, 2, 3])
  })
)

it.effect("collectWithFallback recovers immediately when first element fails", () =>
  Effect.gen(function* () {
    const result = yield* collectWithFallback([-5, 1, 2], 0)
    expect(result).toEqual([0])
  })
)
