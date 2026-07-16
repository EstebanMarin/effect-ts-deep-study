import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { parseOr } from "../exercises/03-catch-cause.js"

it.effect("returns the parsed number on success", () =>
  Effect.gen(function* () {
    const n = yield* parseOr("123")
    expect(n).toBe(123)
  })
)

it.effect("returns 0 fallback for an expected failure", () =>
  Effect.gen(function* () {
    const n = yield* parseOr("not-a-number")
    expect(n).toBe(0)
  })
)

it.effect("returns -1 fallback for a defect (die)", () =>
  Effect.gen(function* () {
    const n = yield* parseOr("boom")
    expect(n).toBe(-1)
  })
)
