import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { double, addGreeting } from "../exercises/02-map-flatmap.js"

it.effect("double maps an effect's value by multiplying by 2", () =>
  Effect.gen(function* () {
    const result = yield* double(Effect.succeed(5))
    expect(result).toBe(10)
  })
)

it.effect("double works with different numbers", () =>
  Effect.gen(function* () {
    const result = yield* double(Effect.succeed(21))
    expect(result).toBe(42)
  })
)

it.effect("addGreeting flatMaps to prepend 'Hello, ' to the name", () =>
  Effect.gen(function* () {
    const result = yield* addGreeting(Effect.succeed("World"))
    expect(result).toBe("Hello, World")
  })
)
