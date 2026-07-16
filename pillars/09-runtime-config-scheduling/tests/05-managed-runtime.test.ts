import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { runGreeting } from "../exercises/05-managed-runtime.js"

it.effect("runs the greeting effect through a ManagedRuntime", () =>
  Effect.gen(function* () {
    const greeting = yield* Effect.promise(() => runGreeting())
    expect(greeting).toBe("Hello, Esteban!")
  })
)

it.effect("can be run repeatedly (fresh runtime each call)", () =>
  Effect.gen(function* () {
    const a = yield* Effect.promise(() => runGreeting())
    const b = yield* Effect.promise(() => runGreeting())
    expect(a).toBe("Hello, Esteban!")
    expect(b).toBe("Hello, Esteban!")
  })
)
