import { Effect, pipe } from "effect"

// pipeVersion is given to you — do NOT modify it.
// It computes: (n * 2) + 10
export const pipeVersion = (n: number): Effect.Effect<number, never, never> =>
  pipe(
    Effect.succeed(n),
    Effect.map((x) => x * 2),
    Effect.flatMap((x) => Effect.succeed(x + 10)),
  )

// TODO: Rewrite pipeVersion using Effect.gen (the generator-based syntax).
//       Your genVersion must produce exactly the same result as pipeVersion.
export const genVersion = (n: number): Effect.Effect<number, never, never> =>
  Effect.gen(function* () {
    const doubled = yield* Effect.map(Effect.succeed(n), (x) => x * 2)
    // TODO: combine doubled with the constant offset and return the final number
    return doubled - 10
  })
