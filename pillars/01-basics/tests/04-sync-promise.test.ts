import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import {
  syncCounter,
  promiseValue,
  tryParseInt,
} from "../exercises/04-sync-promise.js"

it.effect("syncCounter increments lazily on each run (proves deferred execution)", () =>
  Effect.gen(function* () {
    // Running the same Effect twice must yield different values — this only works
    // if the counter mutation is deferred inside Effect.sync (lazy), not evaluated
    // eagerly at module load time (which Effect.succeed would do).
    const first = yield* syncCounter
    const second = yield* syncCounter
    expect(second).toBe(first + 1)
  })
)

it.effect("promiseValue uses Effect.promise to resolve a delayed value", () =>
  Effect.gen(function* () {
    const value = yield* promiseValue
    expect(value).toBe("resolved")
  })
)

it.effect("tryParseInt succeeds for '42'", () =>
  Effect.gen(function* () {
    const result = yield* tryParseInt("42")
    expect(result).toBe(42)
  })
)

it.effect("tryParseInt fails for 'notANumber'", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(tryParseInt("notANumber"))
    expect(Exit.isFailure(exit)).toBe(true)
  })
)
