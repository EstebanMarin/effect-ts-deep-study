import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { makeSuccess, makeFailure } from "../exercises/01-succeed-fail.js"

it.effect("makeSuccess produces Exit.succeed(42)", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(makeSuccess)
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toBe(42)
    }
  })
)

it.effect("makeFailure produces an effect that fails with the string 'oops'", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(makeFailure)
    expect(Exit.isFailure(exit)).toBe(true)
    // Extract the error via Effect.match — folds over BOTH channels (like ZIO#fold).
    // For error recovery only, use Effect.catch/Effect.catchCause instead.
    const errOrFallback = yield* Effect.match(makeFailure, {
      onFailure: (e) => e,
      onSuccess: (_) => "no-error",
    })
    expect(errOrFallback).toBe("oops")
  })
)
