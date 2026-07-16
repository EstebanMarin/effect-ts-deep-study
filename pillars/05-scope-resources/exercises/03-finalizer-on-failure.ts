import { Effect } from "effect"

// Finalizers registered with `Effect.addFinalizer` run when the scope closes
// REGARDLESS of how the scoped effect ended — success, failure, or interruption.
// The finalizer receives the `Exit` describing how the effect completed.
//
// TODO: Implement `runWithCleanup(log, work)` so that it:
//   1. Registers a finalizer (via `Effect.addFinalizer`) that appends "cleanup"
//      to `log` no matter what.
//   2. Then runs `work` (which may succeed OR fail).
//   3. Provides the scope with `Effect.scoped` so the finalizer actually fires.
// The finalizer MUST run even when `work` fails: the failure should still
// propagate out (the returned effect fails with the same error), but "cleanup"
// must already be in `log`.
export const runWithCleanup = (
  log: Array<string>,
  work: Effect.Effect<string, string, never>
): Effect.Effect<string, string, never> =>
  // Wrong on purpose: runs the work but never registers/runs any finalizer.
  work
