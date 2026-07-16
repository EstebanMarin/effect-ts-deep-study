import { Context, Effect, Layer, ManagedRuntime } from "effect"

// A small "Greeter" service with a single method.
export class Greeter extends Context.Service<Greeter, {
  readonly greet: (name: string) => string
}>()("Greeter") {}

// The live implementation of Greeter.
export const GreeterLive: Layer.Layer<Greeter> = Layer.succeed(Greeter, {
  greet: (name) => `Hello, ${name}!`,
})

// An effect that uses the Greeter service. It requires Greeter in its context.
export const greetEsteban: Effect.Effect<string, never, Greeter> = Effect.gen(
  function* () {
    const greeter = yield* Greeter
    return greeter.greet("Esteban")
  },
)

// TODO: Implement `makeRuntime` so it constructs a ManagedRuntime from the
// GreeterLive layer (ManagedRuntime.make). The returned runtime should be able
// to run effects that require the Greeter service.
export const makeRuntime = (): ManagedRuntime.ManagedRuntime<Greeter, never> =>
  // TODO: replace this stub — it builds a runtime from an EMPTY layer, which
  // does NOT provide Greeter, so running greetEsteban against it will fail.
  ManagedRuntime.make(Layer.empty) as ManagedRuntime.ManagedRuntime<Greeter, never>

// TODO: Implement `runGreeting` so it builds a runtime via makeRuntime, runs
// `greetEsteban` on it (runtime.runPromise), disposes the runtime afterwards
// (runtime.dispose), and resolves with the greeting string.
export const runGreeting = (): Promise<string> =>
  // TODO: replace this stub with a real ManagedRuntime run-and-dispose flow.
  Promise.resolve("wrong")
