import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { evenSquares } from "../exercises/02-map-filter-take.js"

it.effect("evenSquares filters evens, squares them, and limits the count", () =>
  Effect.gen(function* () {
    const result = yield* evenSquares([1, 2, 3, 4, 5, 6], 2)
    // evens: 2, 4, 6 -> squares: 4, 16, 36 -> take 2: [4, 16]
    expect(result).toEqual([4, 16])
  })
)

it.effect("evenSquares returns all matches when limit exceeds available", () =>
  Effect.gen(function* () {
    const result = yield* evenSquares([1, 2, 3, 4], 10)
    expect(result).toEqual([4, 16])
  })
)

it.effect("evenSquares returns empty when no evens are present", () =>
  Effect.gen(function* () {
    const result = yield* evenSquares([1, 3, 5], 5)
    expect(result).toEqual([])
  })
)
