import { Effect } from "effect"

// TODO: Use Effect.sync to wrap a synchronous side-effectful computation.
//       Define a mutable counter (let counter = 0) in module scope, then
//       export syncCounter as an Effect that increments counter and returns
//       its new value each time it is run.
export const syncCounter: Effect.Effect<number, never, never> =
  Effect.succeed(0)

// TODO: Use Effect.promise to wrap a Promise that resolves to the string "resolved".
export const promiseValue: Effect.Effect<string, never, never> =
  Effect.promise(() => Promise.resolve("wrong"))

// TODO: Use Effect.tryPromise to wrap a Promise that parses the input string as an integer.
//       Succeed with the parsed number; let the Effect fail if parseInt returns NaN.
//       The error type should be unknown (tryPromise's default).
export const tryParseInt = (s: string): Effect.Effect<number, unknown, never> =>
  Effect.succeed(0)
