import { Data, Effect } from "effect"

// A typed error raised when a withdrawal exceeds the balance.
export class InsufficientFundsError extends Data.TaggedError("InsufficientFundsError")<{
  readonly requested: number
  readonly balance: number
}> {}

// `withdraw` models money movement with two DISTINCT failure modes:
//   - a NEGATIVE `amount` is a programmer bug => it should DIE with a defect
//     (Effect.die) carrying an Error, NOT a typed failure.
//   - an `amount` greater than `balance` is an expected domain error => it
//     should FAIL with `InsufficientFundsError` (Effect.fail).
//   - otherwise it succeeds with the remaining balance (`balance - amount`).
//
// TODO: Implement the three branches described above. Right now it always
// succeeds with 0, so every Exit/Cause assertion in the test is wrong.
export const withdraw = (
  balance: number,
  amount: number
): Effect.Effect<number, InsufficientFundsError> =>
  Effect.gen(function* () {
    return 0
  })
