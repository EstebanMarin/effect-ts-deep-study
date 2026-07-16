import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { decode, encode } from "../exercises/03-transform.js"

it.effect("decode parses an encoded string into a number", () =>
  Effect.gen(function* () {
    const n = decode("42")
    expect(n).toBe(42)
    expect(typeof n).toBe("number")
  })
)

it.effect("encode renders the number back into a string", () =>
  Effect.gen(function* () {
    const s = encode(42)
    expect(s).toBe("42")
    expect(typeof s).toBe("string")
  })
)

it.effect("decode then encode round-trips", () =>
  Effect.gen(function* () {
    expect(encode(decode("7"))).toBe("7")
  })
)
