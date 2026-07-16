import { it, expect } from "@effect/vitest"
import { Effect, Exit, Ref } from "effect"
import { alwaysFails, retryWithBackoff } from "../exercises/04-combine-schedules.js"

// Uses it.live so the exponential delays run against the real clock (the
// default it.effect TestClock does not auto-advance, so a delayed schedule
// would hang). The base is tiny (1ms) to keep the test fast.
it.live("caps the number of retries (exponential + bounded recurs)", () =>
  Effect.gen(function* () {
    const attempts = yield* Ref.make(0)
    const exit = yield* Effect.exit(
      retryWithBackoff(alwaysFails(attempts), "1 millis", 3),
    )
    expect(Exit.isFailure(exit)).toBe(true)
    // 1 initial evaluation + 3 retries. upTo({ times }) bounds outputs, so the
    // effect is evaluated more than once and at most 4 times overall.
    const total = yield* Ref.get(attempts)
    expect(total).toBeGreaterThan(1)
    expect(total).toBeLessThanOrEqual(4)
  })
)

it.live("a zero-retry cap still runs the effect exactly once", () =>
  Effect.gen(function* () {
    const attempts = yield* Ref.make(0)
    const exit = yield* Effect.exit(
      retryWithBackoff(alwaysFails(attempts), "1 millis", 0),
    )
    expect(Exit.isFailure(exit)).toBe(true)
    expect(yield* Ref.get(attempts)).toBe(1)
  })
)
