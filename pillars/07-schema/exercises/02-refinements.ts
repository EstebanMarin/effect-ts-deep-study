import { Schema } from "effect"

// TODO: Build `PositiveInt` — a schema for a `number` that must be BOTH an
// integer AND strictly greater than 0. Use `Schema.check` with the refinements
// `Schema.isInt()` and `Schema.isGreaterThan(0)`:
//
//   Schema.Number.pipe(Schema.check(Schema.isInt(), Schema.isGreaterThan(0)))
//
// Right now it accepts ANY number, so 3.5 and -2 wrongly pass. Fix it.
export const PositiveInt = Schema.Number

// `decode` returns the value when it satisfies PositiveInt, otherwise throws.
export const decode = (input: unknown): number =>
  Schema.decodeUnknownSync(PositiveInt)(input)
