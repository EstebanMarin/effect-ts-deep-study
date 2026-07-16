import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { collectAll } from "../exercises/01-from-iterable.js"

it.effect("collectAll gathers every value from the iterable in order", () =>
  Effect.gen(function* () {
    const result = yield* collectAll([1, 2, 3, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })
)

it.effect("collectAll works with an empty iterable", () =>
  Effect.gen(function* () {
    const result = yield* collectAll([])
    expect(result).toEqual([])
  })
)

it.effect("collectAll consumes a generator iterable", () =>
  Effect.gen(function* () {
    function* gen() {
      yield 10
      yield 20
      yield 30
    }
    const result = yield* collectAll(gen())
    expect(result).toEqual([10, 20, 30])
  })
)
