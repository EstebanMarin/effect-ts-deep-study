import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { batchSums } from "../exercises/05-grouped-batches.js"

it.effect("batchSums groups into fixed-size batches and sums each", () =>
  Effect.gen(function* () {
    const result = yield* batchSums([1, 2, 3, 4, 5], 2)
    // batches [1,2],[3,4],[5] -> [3, 7, 5]
    expect(result).toEqual([3, 7, 5])
  })
)

it.effect("batchSums yields a single batch when size covers everything", () =>
  Effect.gen(function* () {
    const result = yield* batchSums([1, 2, 3], 10)
    expect(result).toEqual([6])
  })
)

it.effect("batchSums produces one sum per element when size is 1", () =>
  Effect.gen(function* () {
    const result = yield* batchSums([4, 5, 6], 1)
    expect(result).toEqual([4, 5, 6])
  })
)

it.effect("batchSums returns empty for an empty input", () =>
  Effect.gen(function* () {
    const result = yield* batchSums([], 3)
    expect(result).toEqual([])
  })
)
