import { Effect } from "effect"

// TODO: Use Effect.sync to wrap a synchronous side-effectful computation.
//       Define a mutable counter (let counter = 0) in module scope, then
//       export syncCounter as an Effect that increments counter and returns
//       its new value each time it is run.
let counter = 0
export const syncCounter: Effect.Effect<number, never, never> =
  Effect.sync(() => {
    counter += 1
    return counter
  })

// TODO: Use Effect.promise to wrap a Promise that resolves to the string "resolved".
export const promiseValue: Effect.Effect<string, never, never> =
  Effect.promise(() => Promise.resolve("resolved"))

// TODO: Use Effect.tryPromise to wrap a Promise that parses the input string as an integer.
//       Succeed with the parsed number; let the Effect fail if parseInt returns NaN.
//       The error type should be unknown (tryPromise's default).
export const tryParseInt = (s: string): Effect.Effect<number, unknown, never> =>
  Effect.tryPromise(() =>
    Promise.resolve().then(() => {
      const n = parseInt(s, 10)
      if(Number.isNaN(n)) throw new Error(`not a number: ${s}`)
      return n
    })
  )
