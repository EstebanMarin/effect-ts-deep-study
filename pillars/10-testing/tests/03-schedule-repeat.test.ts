import { it, expect } from "@effect/vitest"
import { Effect, Fiber, Ref } from "effect"
import { TestClock } from "effect/testing"
import { pollUntil } from "../exercises/03-schedule-repeat.js"

it.effect("pollUntil fires each repeat only when the clock advances", () =>
  Effect.gen(function* () {
    const count = yield* Ref.make(0)
    const tick = Ref.update(count, (n) => n + 1)

    // 3 extra repeats, spaced 100ms apart => 4 total executions.
    const fiber = yield* Effect.forkChild(pollUntil(tick, 100, 3))

    // The very first execution happens immediately, before any repeat delay.
    yield* TestClock.adjust(0)
    expect(yield* Ref.get(count)).toBe(1)

    // Each 100ms advance releases exactly one more repeat.
    yield* TestClock.adjust(100)
    expect(yield* Ref.get(count)).toBe(2)

    yield* TestClock.adjust(100)
    expect(yield* Ref.get(count)).toBe(3)

    // Advance well past the remaining schedule; it must cap at 4 total.
    yield* TestClock.adjust(1000)
    yield* Fiber.join(fiber)
    expect(yield* Ref.get(count)).toBe(4)
  })
)
