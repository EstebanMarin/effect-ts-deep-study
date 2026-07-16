import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { pipeline } from "../exercises/05-pipeline.js"

// pipeline takes a raw string, attempts to parse it as a number,
// doubles it via map, then appends a greeting via flatMap.
// e.g. "21" -> parse -> 21 -> double -> 42 -> greet -> "Result: 42"

it.effect("pipeline('21') produces 'Result: 42'", () =>
  Effect.gen(function* () {
    const result = yield* pipeline("21")
    expect(result).toBe("Result: 42")
  })
)

it.effect("pipeline('0') produces 'Result: 0'", () =>
  Effect.gen(function* () {
    const result = yield* pipeline("0")
    expect(result).toBe("Result: 0")
  })
)

it.effect("pipeline('notANumber') fails", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(pipeline("notANumber"))
    expect(Exit.isFailure(exit)).toBe(true)
  })
)
