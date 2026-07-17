import { Effect } from "effect"

// TODO: Make makeSuccess an Effect that succeeds with the number 42.
export const makeSuccess: Effect.Effect<number, never, never> = Effect.succeed(0)

// TODO: Make makeFailure an Effect that fails with the string "oops".
export const makeFailure: Effect.Effect<never, string, never> = Effect.fail("TODO")
