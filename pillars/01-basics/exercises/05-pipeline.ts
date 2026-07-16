import { Effect } from "effect"

// TODO: Implement `pipeline` using Effect.gen.
//
// Steps to compose (all concepts from katas 01–04):
//   1. Use Effect.tryPromise to parse `rawInput` as an integer (fail if NaN).
//   2. Use Effect.map (or direct arithmetic in gen) to double the parsed number.
//   3. Use Effect.flatMap (or yield* Effect.succeed) to build the string "Result: <doubled>".
//   4. Return the final string effect.
//
// Signature: (rawInput: string) => Effect.Effect<string, unknown, never>

export const pipeline = (rawInput: string): Effect.Effect<string, unknown, never> =>
  // BUG: ignores rawInput, always returns wrong value
  Effect.succeed("wrong")
