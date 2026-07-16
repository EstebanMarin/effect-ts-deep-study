import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { decode } from "../exercises/02-refinements.js"

it.effect("decode accepts a positive integer", () =>
  Effect.gen(function* () {
    expect(decode(5)).toBe(5)
  })
)

it.effect("decode rejects a non-integer", () =>
  Effect.gen(function* () {
    expect(() => decode(3.5)).toThrow()
  })
)

it.effect("decode rejects zero and negatives", () =>
  Effect.gen(function* () {
    expect(() => decode(0)).toThrow()
    expect(() => decode(-2)).toThrow()
  })
)
