import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { decodeShape } from "../exercises/04-union-optional.js"

it.effect("decodeShape accepts a circle", () =>
  Effect.gen(function* () {
    expect(decodeShape({ kind: "circle", radius: 3 })).toEqual({
      kind: "circle",
      radius: 3,
    })
  })
)

it.effect("decodeShape accepts a rect without the optional label", () =>
  Effect.gen(function* () {
    expect(decodeShape({ kind: "rect", width: 2, height: 4 })).toEqual({
      kind: "rect",
      width: 2,
      height: 4,
    })
  })
)

it.effect("decodeShape accepts a rect with the optional label", () =>
  Effect.gen(function* () {
    expect(
      decodeShape({ kind: "rect", width: 2, height: 4, label: "box" }),
    ).toEqual({ kind: "rect", width: 2, height: 4, label: "box" })
  })
)

it.effect("decodeShape rejects an unknown shape", () =>
  Effect.gen(function* () {
    expect(() => decodeShape({ kind: "triangle", base: 1 })).toThrow()
  })
)
