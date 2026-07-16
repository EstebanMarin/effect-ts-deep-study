import { Effect, TxRef } from "effect"

// TODO: Given an initial number, create a TxRef holding it, then inside a
//       single Effect.tx transaction set the ref to `next` and read it back.
//       Return the value read AFTER the set (should equal `next`).
export const setThenGet = (
  initial: number,
  next: number,
): Effect.Effect<number> =>
  Effect.gen(function* () {
    const ref = yield* TxRef.make(initial)
    return yield* Effect.tx(TxRef.get(ref))
  })
