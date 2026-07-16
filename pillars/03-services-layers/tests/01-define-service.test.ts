import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { Greeter, welcome } from "../exercises/01-define-service.js"

// A concrete implementation of the Greeter service used by the tests.
const testGreeter = { greet: (name: string) => `Hello, ${name}!` }

it.effect("welcome uses the Greeter service to build a message", () =>
  Effect.gen(function* () {
    const result = yield* Effect.provideService(welcome("Ada"), Greeter, testGreeter)
    expect(result).toBe("Hello, Ada!")
  })
)

it.effect("welcome delegates to whatever greet implementation is provided", () =>
  Effect.gen(function* () {
    const shouty = { greet: (name: string) => `HI ${name.toUpperCase()}` }
    const result = yield* Effect.provideService(welcome("bob"), Greeter, shouty)
    expect(result).toBe("HI BOB")
  })
)
