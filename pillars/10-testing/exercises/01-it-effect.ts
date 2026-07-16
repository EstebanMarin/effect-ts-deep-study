import { Effect } from "effect"

// TODO: Implement `computeTotal` so it returns an Effect that succeeds with
// the SUM of every number in `prices`. Inside Effect.gen a pure value is just
// returned (do NOT wrap it in Effect.succeed).
export const computeTotal = (prices: ReadonlyArray<number>): Effect.Effect<number> =>
  Effect.gen(function* () {
    return 0
  })
