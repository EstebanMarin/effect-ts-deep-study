import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { Forbidden, withGuestFallback } from "../exercises/02-catch-tag.js"

it.effect("NotFound is recovered into a guest fallback", () =>
  Effect.gen(function* () {
    const result = yield* withGuestFallback("0")
    expect(result).toBe("guest:0")
  })
)

it.effect("successful lookups pass through unchanged", () =>
  Effect.gen(function* () {
    const result = yield* withGuestFallback("42")
    expect(result).toBe("user:42")
  })
)

it.effect("Forbidden is NOT recovered and still fails", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(withGuestFallback("1"))
    expect(Exit.isFailure(exit)).toBe(true)
    const err = yield* Effect.match(withGuestFallback("1"), {
      onFailure: (e) => e,
      onSuccess: () => null,
    })
    expect(err instanceof Forbidden).toBe(true)
    expect(err?._tag).toBe("Forbidden")
  })
)
