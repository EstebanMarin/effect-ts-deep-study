import { it, expect } from "@effect/vitest"
import { Effect, Ref } from "effect"
import { fetchAll } from "../exercises/03-map-effect-concurrency.js"

it.effect("fetchAll runs fetches concurrently up to the given concurrency", () =>
  Effect.gen(function* () {
    const inFlight = yield* Ref.make(0)
    const peak = yield* Ref.make(0)

    const fetch = (id: number) =>
      Effect.gen(function* () {
        const now = yield* Ref.updateAndGet(inFlight, (n) => n + 1)
        yield* Ref.update(peak, (p) => Math.max(p, now))
        // give other fibers a chance to start before we finish
        yield* Effect.yieldNow
        yield* Effect.yieldNow
        yield* Ref.update(inFlight, (n) => n - 1)
        return id * 10
      })

    const results = yield* fetchAll([1, 2, 3, 4, 5, 6], fetch, 3)

    // results preserve input order
    expect(results).toEqual([10, 20, 30, 40, 50, 60])
    // at least 2 fetches ran at the same time (sequential would peak at 1)
    const peakValue = yield* Ref.get(peak)
    expect(peakValue).toBeGreaterThan(1)
  })
)

it.effect("fetchAll preserves order even with unbounded-style concurrency", () =>
  Effect.gen(function* () {
    const fetch = (id: number) =>
      Effect.succeed(`item-${id}`)
    const results = yield* fetchAll([3, 1, 2], fetch, 5)
    expect(results).toEqual(["item-3", "item-1", "item-2"])
  })
)
