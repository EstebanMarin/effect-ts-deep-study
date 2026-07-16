import { it, expect } from "@effect/vitest"
import { Effect, Exit, Option, Result } from "effect"
import { withdraw, InsufficientFundsError } from "../exercises/05-exit-cause.js"

it.effect("a valid withdrawal succeeds with the remaining balance", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(withdraw(100, 30))
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toBe(70)
    }
  })
)

it.effect("overdrawing FAILS with a typed InsufficientFundsError (Fail, not Die)", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(withdraw(100, 250))
    expect(Exit.isFailure(exit)).toBe(true)

    // It must be a typed failure, NOT a defect.
    expect(Exit.hasFails(exit)).toBe(true)
    expect(Exit.hasDies(exit)).toBe(false)

    const err = Exit.findErrorOption(exit)
    expect(Option.isSome(err)).toBe(true)
    if (Option.isSome(err)) {
      expect(err.value).toBeInstanceOf(InsufficientFundsError)
      expect(err.value._tag).toBe("InsufficientFundsError")
      expect(err.value.requested).toBe(250)
      expect(err.value.balance).toBe(100)
    }
  })
)

it.effect("a negative amount DIES with a defect (Die, not Fail)", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(withdraw(100, -5))
    expect(Exit.isFailure(exit)).toBe(true)

    // A programmer bug surfaces as a defect, not a typed error.
    expect(Exit.hasDies(exit)).toBe(true)
    expect(Exit.hasFails(exit)).toBe(false)

    const defect = Exit.findDefect(exit)
    expect(Result.isSuccess(defect)).toBe(true)
    if (Result.isSuccess(defect)) {
      expect(defect.success).toBeInstanceOf(Error)
    }
  })
)
