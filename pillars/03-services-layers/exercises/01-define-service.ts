import { Context, Effect } from "effect"

// A service is declared as a class that extends Context.Service.
// The class itself is the Context key; the string "Greeter" is its runtime id.
// Greeter provides a single method `greet` that turns a name into a message.
export class Greeter extends Context.Service<Greeter, {
  readonly greet: (name: string) => string
}>()("Greeter") {}

// TODO: Implement `welcome` so that it:
//   1. accesses the Greeter service from the surrounding context (yield* Greeter)
//   2. calls its `greet` method with `name`
//   3. returns the resulting string
// The requirement channel of the returned Effect must be `Greeter`
// (i.e. the service must be supplied by the caller).
export const welcome = (name: string): Effect.Effect<string, never, Greeter> =>
  Effect.gen(function* () {
    // TODO: obtain the Greeter service and use it to greet `name`
    return "not implemented"
  })
