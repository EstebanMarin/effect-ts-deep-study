import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { NotFound, lookup } from "../exercises/01-tagged-fail.js"

it.effect("lookup fails (does not succeed)", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(lookup("abc"))
    expect(Exit.isFailure(exit)).toBe(true)
  })
)

it.effect("lookup fails with a NotFound tagged error carrying the id", () =>
  Effect.gen(function* () {
    const err = yield* Effect.match(lookup("user-7"), {
      onFailure: (e) => e,
      onSuccess: () => null,
    })
    expect(err).not.toBeNull()
    expect(err instanceof NotFound).toBe(true)
    expect(err?._tag).toBe("NotFound")
    expect(err?.id).toBe("user-7")
  })
)
