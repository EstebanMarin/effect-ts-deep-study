import { Effect, Scope } from "effect"

// When multiple resources share a scope, their finalizers run in REVERSE order
// of acquisition (LIFO) — like nested `try/finally` or a stack unwinding. The
// last resource opened is the first one closed. This guarantees an inner
// resource never outlives the outer resource it depends on.
//
// You are given a helper `resource(name)` that returns a scoped effect logging
// "open:<name>" on acquire and "close:<name>" on release.
//
// TODO: Implement `openThree(log)` so that it acquires three resources named
// "a", "b", then "c" (in that order) within a single scope, and returns the
// array of their acquired values ["a", "b", "c"]. Provide the scope with
// `Effect.scoped` so all three finalizers run.
//
// Because they share one scope, the expected log is:
//   open:a, open:b, open:c, close:c, close:b, close:a
//
// The `resource` factory is passed in so the test controls the logging.
export const openThree = (
	log: Array<string>,
	resource: (name: string) => Effect.Effect<string, never, Scope.Scope>
): Effect.Effect<Array<string>, never, never> =>
	// Wrong on purpose: opens nothing, so no lifecycle is logged and the
	// returned values are empty.
  Effect.scoped(
    Effect.gen(function*() {
      const a = yield* resource("a")
      const b = yield* resource("b")
      const c = yield* resource("c")
      return [a, b, c]
    }),
  );
