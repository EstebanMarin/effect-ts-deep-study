import { Effect } from "effect"

// TODO: Demonstrate STRUCTURED CONCURRENCY. Build a parent effect that forks a
//       long-running CHILD as a proper child fiber (Effect.forkChild), so the
//       child's lifetime is tied to the parent's. When the parent is later
//       interrupted, the runtime must automatically interrupt the child too,
//       causing the child's own interrupt finalizer to run.
//
//       Requirements for the returned parent effect:
//         1. Fork `child` with Effect.forkChild (NOT forkDetach / forkDaemon —
//            those would outlive the parent and defeat the test).
//         2. After forking, the parent must stay alive (e.g. Effect.never) so
//            the only way it ends is by external interruption.
//
//       When the caller interrupts this parent, structured concurrency should
//       tear the child down for you — you should NOT interrupt the child by hand.
//
//       Right now the parent forks the child DETACHED (via forkDetach) and then
//       ends immediately — so the child is orphaned and outlives the parent,
//       and interrupting the parent never touches the child.
export const superviseChild = (
  child: Effect.Effect<never, never, never>,
): Effect.Effect<never, never, never> =>
  Effect.gen(function* () {
    yield* Effect.forkDetach(child)
    // Parent returns immediately here, orphaning the child.
    return yield* Effect.never
  })
