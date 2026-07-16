import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { safeDecode } from "../exercises/05-decode-result.js"

it.effect("safeDecode returns ok:true with the decoded value", () =>
  Effect.gen(function* () {
    const outcome = safeDecode({ id: 1, email: "a@b.com" })
    expect(outcome.ok).toBe(true)
    if (outcome.ok) {
      expect(outcome.value).toEqual({ id: 1, email: "a@b.com" })
    }
  })
)

it.effect("safeDecode returns ok:false with a formatted error message", () =>
  Effect.gen(function* () {
    const outcome = safeDecode({ id: "nope", email: 5 })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) {
      expect(typeof outcome.error).toBe("string")
      expect(outcome.error.length).toBeGreaterThan(0)
      // The rendered issue tree mentions the offending field.
      expect(outcome.error).toContain("id")
    }
  })
)

it.effect("safeDecode does not throw on invalid input", () =>
  Effect.gen(function* () {
    expect(() => safeDecode(null)).not.toThrow()
    expect(safeDecode(null).ok).toBe(false)
  })
)
