import { Effect } from "effect"

// TODO: Change makeSuccess to an Effect that succeeds with the number 42.
export const makeSuccess: Effect.Effect<number, never, never> = Effect.succeed(0)

// TODO: Change makeFailure to an Effect that fails with the string "oops".
export const makeFailure: Effect.Effect<never, string, never> = Effect.fail("wrong")
