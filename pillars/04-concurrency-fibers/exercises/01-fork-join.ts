import { Effect, Fiber } from "effect"

// TODO: Fork `task` into a background fiber, then wait for it to finish and
//       return its computed value.
//
//       Steps:
//         1. Fork the given `task` with Effect.forkChild — this yields a Fiber
//            that runs concurrently and does NOT block the current fiber.
//         2. Await the fiber's result with Fiber.join, which suspends until the
//            fiber completes and produces its success value (re-raising failures).
//         3. Return that value unchanged.
//
//       Right now this ignores the fiber entirely and returns a placeholder.
export const forkAndJoin = <A>(
  task: Effect.Effect<A, never, never>,
): Effect.Effect<A, never, never> =>
  Effect.gen(function* () {
    // TODO: fork `task`, then join the resulting fiber and return its value.
    const fiber = yield* Effect.forkChild(task)
    return yield * Fiber.join(fiber)
  })
