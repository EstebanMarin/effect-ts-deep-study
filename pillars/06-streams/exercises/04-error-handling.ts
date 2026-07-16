import { Effect, Stream } from "effect"

// A stream that emits the given numbers but FAILS with a string error as soon
// as it encounters a negative number.
const source = (values: ReadonlyArray<number>): Stream.Stream<number, string> =>
  Stream.fromIterable(values).pipe(
    Stream.mapEffect((n) =>
      n < 0 ? Effect.fail(`negative: ${n}`) : Effect.succeed(n),
    ),
  )

// TODO: Run `source(values)`, but RECOVER from any failure so the returned
//       effect never fails. Use Stream.catch to replace the failing stream with
//       a single-element fallback stream `Stream.make(fallback)` (this appends
//       the fallback AFTER whatever elements were emitted before the failure).
//       Collect the result with Stream.runCollect.
export const collectWithFallback = (
  values: ReadonlyArray<number>,
  fallback: number,
): Effect.Effect<ReadonlyArray<number>, never, never> =>
  source(values).pipe(
    Stream.catch(() => Stream.empty),
    Stream.runCollect,
  )
