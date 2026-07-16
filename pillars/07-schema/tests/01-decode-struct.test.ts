import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { decodePerson } from "../exercises/01-decode-struct.js"

it.effect("decodePerson decodes a valid record into a Person", () =>
  Effect.gen(function* () {
    const person = decodePerson({ name: "Ada", age: 36 })
    expect(person).toEqual({ name: "Ada", age: 36 })
  })
)

it.effect("decodePerson throws on an invalid record", () =>
  Effect.gen(function* () {
    expect(() => decodePerson({ name: "Ada", age: "old" })).toThrow()
    expect(() => decodePerson({ name: 42 })).toThrow()
  })
)
