import { Data, Effect } from "effect"

// Two distinct tagged errors can occur in the same program.
export class NotFound extends Data.TaggedError("NotFound")<{
  readonly id: string
}> {}
export class Forbidden extends Data.TaggedError("Forbidden")<{
  readonly reason: string
}> {}

// `fetchUser` fails with NotFound for id "0", Forbidden for id "1",
// otherwise succeeds with a greeting. Given to you — do NOT modify.
export const fetchUser = (
  id: string,
): Effect.Effect<string, NotFound | Forbidden, never> => {
  if (id === "0") return Effect.fail(new NotFound({ id }))
  if (id === "1") return Effect.fail(new Forbidden({ reason: "blocked" }))
  return Effect.succeed(`user:${id}`)
}

// TODO: Recover ONLY the NotFound error by turning it into the fallback
//       string `guest:<id>`. Leave the Forbidden error untouched so it
//       still appears in the error channel (note the result type: the E
//       channel keeps Forbidden but drops NotFound).
//       Use Effect.catchTag. Right now nothing is recovered.
export const withGuestFallback = (
  id: string,
): Effect.Effect<string, Forbidden, never> =>
  fetchUser(id).pipe(
    Effect.catchTag("NotFound", (e) => Effect.succeed(`guest:${e.id}`))
  )
