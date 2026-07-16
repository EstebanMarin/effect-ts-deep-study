import { Effect, TxRef } from "effect"

// TODO: Model two account balances as TxRefs. Inside a SINGLE Effect.tx
//       transaction, move `amount` from `from` to `to`: subtract `amount` from
//       the `from` ref and add `amount` to the `to` ref. Return a tuple of the
//       resulting balances as [fromBalance, toBalance].
export const transfer = (
  fromInitial: number,
  toInitial: number,
  amount: number,
): Effect.Effect<readonly [number, number]> =>
  Effect.gen(function* () {
    const from = yield* TxRef.make(fromInitial)
    const to = yield* TxRef.make(toInitial)
    const f = yield* TxRef.get(from)
    const t = yield* TxRef.get(to)
    return [f, t] as const
  })
