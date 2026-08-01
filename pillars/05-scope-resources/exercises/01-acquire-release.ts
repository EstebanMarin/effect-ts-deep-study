import { Effect } from "effect"

// A resource lifecycle is a pair: an "acquire" effect that opens the resource
// and a "release" effect that always cleans it up. `Effect.acquireRelease`
// builds a *scoped* effect: the release runs when the surrounding Scope closes.
//
// TODO: Implement `openResource` using `Effect.acquireRelease`.
//   - acquire: append "open" to the given `log` array (mutating in place),
//     then produce the resource value — the string "handle".
//   - release: append "close" to the same `log` array.
// The returned effect must require a Scope (that is its R channel); the test
// wraps it in `Effect.scoped` to close the scope and trigger the release.
export const openResource = (
	log: Array<string>
): Effect.Effect<string, never, any> =>
	// Wrong on purpose: no lifecycle at all, nothing is ever logged.
  Effect.acquireRelease(
    Effect.sync(() => {
      log.push("open")
      return "handle"
    }),
    () => Effect.sync(() => {
      log.push("close")}),
  );
