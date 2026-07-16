import { Effect } from "effect"

// TODO: Use Effect.sync to wrap a synchronous side-effectful computation.
//       The computation should increment an internal counter and return its value.
//       (Hint: define a let counter = 0 in the module scope and increment it.)
let _counter = 0
export const syncCounter: Effect.Effect<number, never, never> =
  // BUG: uses succeed (eager) instead of sync (lazy) — and returns wrong value
  Effect.succeed(0)

// TODO: Use Effect.promise to wrap a Promise that resolves to the string "resolved".
export const promiseValue: Effect.Effect<string, never, never> =
  // BUG: returns wrong string
  Effect.promise(() => Promise.resolve("wrong"))

// TODO: Use Effect.tryPromise to wrap a Promise that parses the input string as an integer.
//       Succeed with the parsed number; let the Effect fail if parseInt returns NaN.
//       The error type should be unknown (tryPromise's default).
export const tryParseInt = (s: string): Effect.Effect<number, unknown, never> =>
  // BUG: always succeeds instead of failing on NaN
  Effect.succeed(0)

// suppress unused variable warning
void _counter
