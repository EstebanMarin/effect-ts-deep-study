import { Effect, TxRef } from "effect"

// TODO: Implement a guarded withdrawal. `balance` starts at `initial`. A
//       background fiber tops the balance up by `topUp`. Inside Effect.tx, read
//       the balance: if it is less than `amount`, call Effect.txRetry so the
//       transaction re-runs when the balance changes; otherwise subtract
//       `amount`. Return the final balance after the successful withdrawal.
//
// The background top-up is already wired for you:
//   yield* Effect.forkChild(Effect.tx(TxRef.update(balance, (n) => n + topUp)))
export const guardedWithdraw = (
  initial: number,
  topUp: number,
  amount: number,
): Effect.Effect<number> =>
  Effect.gen(function* () {
    const balance = yield* TxRef.make(initial)
    yield* Effect.forkChild(Effect.tx(TxRef.update(balance, (n) => n + topUp)))
    return yield* TxRef.get(balance)
  })
