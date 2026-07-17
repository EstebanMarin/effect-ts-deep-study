import { Data, Effect } from "effect"

// A tagged error carries a discriminant `_tag` (here "NotFound") plus payload.
// TODO: Complete this class so it is a Data.TaggedError named "NotFound"
//       carrying a single readonly field `id: string`.
export class NotFound extends Data.TaggedError("NotFound")<{
  readonly id: string
}> {}

// TODO: Return an Effect that FAILS with a NotFound error whose `id` is the
//       given argument. Right now it wrongly succeeds instead of failing.
export const lookup = (id: string): Effect.Effect<never, NotFound, never> =>
  Effect.fail(new NotFound({id}))

