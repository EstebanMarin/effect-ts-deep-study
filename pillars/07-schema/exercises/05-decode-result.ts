import { Schema, Result } from "effect"

// The account schema we validate incoming data against.
export const Account = Schema.Struct({
  id: Schema.Number,
  email: Schema.String,
})

export type Account = typeof Account.Type

export type DecodeOutcome =
  | { readonly ok: true; readonly value: Account }
  | { readonly ok: false; readonly error: string }

// TODO: Implement `safeDecode` so it decodes WITHOUT throwing and returns a
// tagged outcome. Use the Result-returning decoder:
//
//   const result = Schema.decodeUnknownResult(Account)(input)
//
// Then branch with `Result.isSuccess(result)`:
//   - on success: return { ok: true, value: result.success }
//   - on failure: return { ok: false, error: result.failure.message }
//     (`result.failure` is a SchemaError whose `.message` renders the issue tree)
//
// The stub below ALWAYS reports success with a bogus account, so failing input
// is never reported and valid input carries the wrong value. Fix it.
export const safeDecode = (input: unknown): DecodeOutcome => {
  const _result = Schema.decodeUnknownResult(Account)(input)
  return { ok: true, value: { id: -1, email: "wrong" } }
}
