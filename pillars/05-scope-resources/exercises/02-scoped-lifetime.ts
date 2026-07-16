import { Effect, Scope } from "effect"

// `Effect.scoped` provides a fresh Scope to a scoped effect and closes that
// scope as soon as the effect finishes — running every finalizer registered
// against it. This "seals in" a resource's lifetime to a single expression.
//
// You are given `resource`, a scoped effect that logs "open" on acquire and
// "close" on release (built with acquireRelease). It requires a Scope.
//
// TODO: Implement `useOnce` so that it:
//   1. Provides a scope to `resource` via `Effect.scoped`,
//   2. inside that scope, reads the resource value and returns it uppercased,
//   3. and lets the scope close (running the "close" finalizer) before returning.
// The RESULT effect must NOT require a Scope any more (R = never): scoping it
// discharges that requirement.
export const useOnce = (
  resource: Effect.Effect<string, never, Scope.Scope>
): Effect.Effect<string, never, never> =>
  // Wrong on purpose: ignores the resource and its lifecycle entirely.
  Effect.succeed("")
