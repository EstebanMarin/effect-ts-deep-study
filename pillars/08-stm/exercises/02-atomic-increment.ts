import { Effect, TxRef } from "effect"

// TODO: Create a TxRef counter starting at 0. Increment it `times` times, each
//       increment performed atomically inside its own Effect.tx transaction
//       (use TxRef.update to add 1). Return the final value of the counter.
export const incrementN = (times: number): Effect.Effect<number> =>
  Effect.gen(function* () {
    const counter = yield* TxRef.make(0)
    return yield* TxRef.get(counter)
  })
