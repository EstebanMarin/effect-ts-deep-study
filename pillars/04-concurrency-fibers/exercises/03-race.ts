import { Effect } from "effect"

// TODO: Return the value of whichever effect completes FIRST, interrupting the
//       slower one. Use Effect.race, which runs both effects concurrently and
//       yields the winner's result.
//
//       Right now it ignores `right` and always returns `left`.
export const fastest = <A>(
  left: Effect.Effect<A, never, never>,
  right: Effect.Effect<A, never, never>,
): Effect.Effect<A, never, never> => left

// TODO: Return the value of whichever effect in the (non-empty) array completes
//       FIRST. Use Effect.raceAll, which races all of them concurrently and
//       interrupts the losers.
//
//       Right now it just returns the FIRST element's effect without racing.
export const firstToFinish = <A>(
  tasks: ReadonlyArray<Effect.Effect<A, never, never>>,
): Effect.Effect<A, never, never> => tasks[0]!
