import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { setThenGet } from "../exercises/01-txref-get-set.js"

it.effect("reads back the value written inside the transaction", () =>
  Effect.gen(function* () {
    const result = yield* setThenGet(1, 42)
    expect(result).toBe(42)
  })
)

it.effect("works with any next value", () =>
  Effect.gen(function* () {
    const result = yield* setThenGet(100, 7)
    expect(result).toBe(7)
  })
)
