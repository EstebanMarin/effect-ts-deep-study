import { Effect } from "effect"

// TODO: Run every effect in `tasks` CONCURRENTLY (all at once, not one-by-one)
//       and collect their results into an array preserving input order.
//
//       Use Effect.all with the options object `{ concurrency: "unbounded" }`
//       so all tasks are started together rather than sequentially. The default
//       (no options) runs them one at a time — that would still produce the same
//       array, but the accompanying test measures real concurrency, so you MUST
//       opt into unbounded concurrency.
//
//       Right now this runs the tasks sequentially (default concurrency).
export const runAllConcurrently = <A>(
  tasks: ReadonlyArray<Effect.Effect<A, never, never>>,
): Effect.Effect<ReadonlyArray<A>, never, never> => Effect.all(tasks)
