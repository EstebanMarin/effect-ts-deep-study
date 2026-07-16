import { it, expect } from "@effect/vitest"
import { Effect, Ref } from "effect"
import { runAllConcurrently } from "../exercises/02-all-concurrency.js"

it.live("runAllConcurrently collects results in input order", () =>
  Effect.gen(function* () {
    const tasks = [1, 2, 3, 4].map((n) => Effect.succeed(n * 10))
    const results = yield* runAllConcurrently(tasks)
    expect(results).toEqual([10, 20, 30, 40])
  })
)

it.live("runAllConcurrently runs the tasks concurrently, not sequentially", () =>
  Effect.gen(function* () {
    // Each task increments a live-counter, records the peak, then decrements.
    // If tasks ran sequentially the peak would be 1; running them concurrently
    // (all in flight at once) drives the peak up to the number of tasks.
    const active = yield* Ref.make(0)
    const peak = yield* Ref.make(0)

    const makeTask = (n: number) =>
      Effect.gen(function* () {
        const now = yield* Ref.updateAndGet(active, (c) => c + 1)
        yield* Ref.update(peak, (p) => (now > p ? now : p))
        // Yield control so other concurrent tasks get a chance to start.
        yield* Effect.sleep("10 millis")
        yield* Ref.update(active, (c) => c - 1)
        return n
      })

    const results = yield* runAllConcurrently([1, 2, 3].map(makeTask))
    expect(results).toEqual([1, 2, 3])

    const observedPeak = yield* Ref.get(peak)
    expect(observedPeak).toBe(3)
  })
)
