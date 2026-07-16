import { it, expect } from "@effect/vitest"
import { Effect, Result } from "effect"
import { applyBatch } from "../exercises/05-all-or-nothing.js"

it.effect("commits all three deltas when every ledger stays non-negative", () =>
  Effect.gen(function* () {
    const { result, snapshot } = yield* applyBatch(10, [-5, 3, -10])
    expect(Result.isSuccess(result)).toBe(true)
    if (Result.isSuccess(result)) {
      expect(result.success).toEqual([5, 13, 0])
    }
    expect(snapshot).toEqual([5, 13, 0])
  })
)

it.effect("rolls back ALL refs when any ledger would go negative", () =>
  Effect.gen(function* () {
    const { result, snapshot } = yield* applyBatch(10, [-5, 3, -11])
    expect(Result.isFailure(result)).toBe(true)
    if (Result.isFailure(result)) {
      expect(result.failure).toBe("insufficient")
    }
    // all-or-nothing: nothing changed, every ref is back at the start value
    expect(snapshot).toEqual([10, 10, 10])
  })
)
