import { Effect } from "effect"

// Interruption is the third way an effect can end (besides success and failure).
// `Effect.onInterrupt` attaches a finalizer that runs ONLY when the effect is
// interrupted — perfect for releasing a resource held by a long-running task
// that gets cancelled.
//
// TODO: Implement `interruptibleTask(log)` returning a NEVER-completing effect
// (use `Effect.never`) that, when interrupted, appends "interrupted" to `log`.
// Attach the cleanup with `Effect.onInterrupt`.
//
// The test forks this task, lets it start, then interrupts the fiber and checks
// that "interrupted" was recorded.
export const interruptibleTask = (
  log: Array<string>
): Effect.Effect<never, never, never> =>
  // Wrong on purpose: never registers the onInterrupt handler, so nothing is
  // recorded when the fiber is cancelled.
  Effect.never
