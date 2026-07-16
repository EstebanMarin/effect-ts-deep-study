import { Effect, Stream } from "effect"

// TODO: From the given iterable of numbers, build a stream that:
//   1. keeps only the EVEN numbers (Stream.filter),
//   2. squares each remaining number (Stream.map, n => n * n),
//   3. takes only the first `limit` results (Stream.take),
// then collect the results with Stream.runCollect.
export const evenSquares = (
  values: Iterable<number>,
  limit: number,
): Effect.Effect<ReadonlyArray<number>, never, never> =>
  Stream.fromIterable(values).pipe(
    Stream.map((n) => n * n),
    Stream.runCollect,
  )
