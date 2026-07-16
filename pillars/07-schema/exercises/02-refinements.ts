import { Schema } from "effect"

// TODO: Build `PositiveInt` — a schema for a `number` that must be BOTH an
// integer AND strictly greater than 0.
// Hint: use Schema.check with the isInt and isGreaterThan refinements
// (pipe Schema.Number through Schema.check, passing both refinements).
// Right now it accepts ANY number, so 3.5 and -2 wrongly pass. Fix it.
export const PositiveInt = Schema.Number

// `decode` returns the value when it satisfies PositiveInt, otherwise throws.
export const decode = (input: unknown): number =>
  Schema.decodeUnknownSync(PositiveInt)(input)
