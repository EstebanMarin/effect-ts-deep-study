import { Data, Effect } from "effect"

export class ParseError extends Data.TaggedError("ParseError")<{
  readonly input: string
}> {}

// `parse` succeeds with the parsed integer, or fails with ParseError.
// It can ALSO die (defect) when the input is the literal "boom".
// Given to you — do NOT modify.
export const parse = (
  input: string,
): Effect.Effect<number, ParseError, never> => {
  if (input === "boom") return Effect.die(new Error("kaboom"))
  const n = Number(input)
  return Number.isNaN(n)
    ? Effect.fail(new ParseError({ input }))
    : Effect.succeed(n)
}

// TODO: Make `parseOr` NEVER fail and NEVER die: fold over the WHOLE cause.
//   - On success: return the parsed number.
//   - On any cause: return a fallback number.
//        * if the cause contains a defect (die), return -1
//        * otherwise (an expected failure), return 0
//   Use Effect.catchCause together with Cause.hasDies (both channels handled,
//   so the result type must be Effect<number, never, never>).
//   Right now it only handles success and leaks the error channel.
export const parseOr = (
  input: string,
): Effect.Effect<number, never, never> =>
  parse(input) as Effect.Effect<number, never, never>
