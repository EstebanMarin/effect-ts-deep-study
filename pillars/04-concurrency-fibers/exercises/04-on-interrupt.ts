import { Effect } from "effect"

// TODO: Build an effect that:
//   1. attaches an interruption finalizer via Effect.onInterrupt — when the
//      effect is interrupted, the finalizer runs `onCancel`;
//   2. never completes on its own (use Effect.never), so the ONLY way it ends
//      is by being interrupted.
//
//   The finalizer `onCancel` is provided by the caller (typically it records
//   that cleanup happened). It must run exactly when the effect is interrupted.
//
//   Right now this returns immediately WITHOUT registering any interrupt
//   finalizer, so cancellation cleanup never fires.
export const gatedWork = (
  onCancel: Effect.Effect<void, never, never>,
): Effect.Effect<never, never, never> =>
  Effect.never.pipe(Effect.onInterrupt(() => onCancel))
