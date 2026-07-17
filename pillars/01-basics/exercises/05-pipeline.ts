import { Effect, pipe } from "effect"

// TODO: Implement `pipeline` using Effect.gen.
//
// Steps to compose (all concepts from katas 01–04):
//   1. Use Effect.tryPromise to parse `rawInput` as an integer (fail if NaN).
//   2. Use Effect.map (or direct arithmetic in gen) to double the parsed number.
//   3. Use Effect.flatMap (or yield* Effect.succeed) to build the string "Result: <doubled>".
//   4. Return the final string effect.
//
// Signature: (rawInput: string) => Effect.Effect<string, unknown, never>

// TODO: Implement the pipeline body using Effect.gen with the four steps above.
export const pipeline = (rawInput: string): Effect.Effect<string, unknown, never> =>
    Effect.gen(function* () {
      const parsed = yield* Effect.tryPromise(() =>
        Promise.resolve().then(() => {
          const n = parseInt(rawInput, 10)
          if (Number.isNaN(n)) throw new Error(`not a number: ${rawInput}`)
          return n
        })
      )
      const doubled = parsed * 2          // pure — just arithmetic, no wrapping
      return `Result: ${doubled}`         // gen wraps this in the success channel
    })
