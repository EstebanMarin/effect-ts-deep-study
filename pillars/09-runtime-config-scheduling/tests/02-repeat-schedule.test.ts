import { it, expect } from "@effect/vitest"
import { Effect, Ref } from "effect"
import { tick, repeatTimes } from "../exercises/02-repeat-schedule.js"

it.effect("repeats the effect (extra + 1) times", () =>
  Effect.gen(function* () {
    const counter = yield* Ref.make(0)
    const total = yield* repeatTimes(tick(counter), 4)
    // 1 initial run + 4 repeats = 5 runs total.
    expect(total).toBe(5)
    expect(yield* Ref.get(counter)).toBe(5)
  })
)

it.effect("with extra=0 runs exactly once", () =>
  Effect.gen(function* () {
    const counter = yield* Ref.make(0)
    const total = yield* repeatTimes(tick(counter), 0)
    expect(total).toBe(1)
    expect(yield* Ref.get(counter)).toBe(1)
  })
)
