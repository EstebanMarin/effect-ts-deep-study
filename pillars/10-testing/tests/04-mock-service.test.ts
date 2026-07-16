import { it, expect } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { TimeSource, isExpired } from "../exercises/04-mock-service.js"

// A test Layer that mocks TimeSource with a fixed "current time" of 1000.
const FixedClock = Layer.succeed(TimeSource, { now: () => 1000 })

it.effect("a deadline in the past is expired", () =>
  Effect.gen(function* () {
    const result = yield* isExpired(500).pipe(Effect.provide(FixedClock))
    expect(result).toBe(true)
  })
)

it.effect("a deadline in the future is not expired", () =>
  Effect.gen(function* () {
    const result = yield* isExpired(1500).pipe(Effect.provide(FixedClock))
    expect(result).toBe(false)
  })
)

it.effect("a deadline exactly at now is not expired", () =>
  Effect.gen(function* () {
    const result = yield* isExpired(1000).pipe(Effect.provide(FixedClock))
    expect(result).toBe(false)
  })
)
