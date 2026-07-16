import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { runWithCleanup } from "../exercises/03-finalizer-on-failure.js"

it.effect("finalizer runs and value propagates on success", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const result = yield* runWithCleanup(log, Effect.succeed("ok"))
    expect(result).toBe("ok")
    expect(log).toEqual(["cleanup"])
  })
)

it.effect("finalizer STILL runs when the work fails, and the failure propagates", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const exit = yield* Effect.exit(runWithCleanup(log, Effect.fail("boom")))
    expect(Exit.isFailure(exit)).toBe(true)
    // The finalizer must have executed despite the failure.
    expect(log).toEqual(["cleanup"])
    const err = yield* Effect.match(runWithCleanup([], Effect.fail("boom")), {
      onFailure: (e) => e,
      onSuccess: () => "no-error",
    })
    expect(err).toBe("boom")
  })
)
