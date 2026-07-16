import { Effect, TxRef } from "effect"

// Three ledgers a, b, c all start at `start`. `applyBatch` runs a batch of
// deltas — one per ledger — inside a SINGLE Effect.tx transaction. The
// transaction must be all-or-nothing: if applying every delta would leave ANY
// ledger negative, the whole transaction fails (with error "insufficient") and
// NONE of the three refs may change. On success all three deltas are applied.
//
// TODO: Inside Effect.tx, update a, b and c by their deltas, then read them
//       back; if any resulting value is < 0, `yield* Effect.fail("insufficient")`
//       (which aborts and rolls back the transaction). Otherwise return the
//       tuple [a, b, c]. Use Effect.result at the call site to observe the
//       outcome, then read the refs and return { result, snapshot } where
//       snapshot is the [a, b, c] AFTER the transaction (unchanged on failure).
export const applyBatch = (
  start: number,
  deltas: readonly [number, number, number],
): Effect.Effect<{
  readonly result: import("effect").Result.Result<
    readonly [number, number, number],
    string
  >
  readonly snapshot: readonly [number, number, number]
}> =>
  Effect.gen(function* () {
    const a = yield* TxRef.make(start)
    const b = yield* TxRef.make(start)
    const c = yield* TxRef.make(start)
    const result = yield* Effect.result(
      Effect.tx(
        Effect.gen(function* () {
          const va = yield* TxRef.get(a)
          const vb = yield* TxRef.get(b)
          const vc = yield* TxRef.get(c)
          return [va, vb, vc] as const
        }),
      ),
    )
    const snapshot = [
      yield* TxRef.get(a),
      yield* TxRef.get(b),
      yield* TxRef.get(c),
    ] as const
    return { result, snapshot }
  })
