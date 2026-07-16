import { it, expect } from "@effect/vitest"
import { Effect, Fiber, Ref } from "effect"
import { TestClock } from "effect/testing"
import { delayedValue } from "../exercises/02-testclock-sleep.js"

it.effect("delayedValue stays pending until the clock advances past its delay", () =>
  Effect.gen(function* () {
    const done = yield* Ref.make(false)

    // Fork the sleeping effect; it semantically blocks on the virtual clock.
    // Only once it completes does it flip `done` to true.
    const fiber = yield* Effect.forkChild(
      Effect.gen(function* () {
        const value = yield* delayedValue(1000, "done")
        yield* Ref.set(done, true)
        return value
      })
    )

    // Advance only part of the delay: the effect must NOT have completed yet.
    yield* TestClock.adjust(500)
    expect(yield* Ref.get(done)).toBe(false)

    // Advance the rest of the delay: now it completes with its value.
    yield* TestClock.adjust(500)
    const result = yield* Fiber.join(fiber)
    expect(result).toBe("done")
    expect(yield* Ref.get(done)).toBe(true)
  })
)
