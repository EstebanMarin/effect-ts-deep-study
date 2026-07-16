import { Effect } from "effect"

export const makeSuccess: Effect.Effect<number, never, never> = Effect.succeed(42)

export const makeFailure: Effect.Effect<never, string, never> = Effect.fail("oops")
