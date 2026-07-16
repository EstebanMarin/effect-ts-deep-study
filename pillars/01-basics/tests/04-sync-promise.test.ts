import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import {
  syncCounter,
  promiseValue,
  tryParseInt,
} from "../exercises/04-sync-promise.js"

it.effect("syncCounter uses Effect.sync to capture a mutable counter", () =>
  Effect.gen(function* () {
    const count = yield* syncCounter
    expect(typeof count).toBe("number")
    expect(count).toBeGreaterThanOrEqual(1)
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
    expect(exit._tag).toBe("Failure")
  })
)
