import { Effect, Stream } from "effect"

// TODO: Partition the stream of `values` into fixed-size batches of `size`
//       elements using Stream.grouped(size). The final batch may be smaller if
//       there aren't enough elements. For EACH batch, produce its SUM using
//       Stream.map over the emitted arrays (reduce each array with +).
//       Collect the per-batch sums with Stream.runCollect.
//
//       Example: values [1,2,3,4,5], size 2 -> batches [1,2],[3,4],[5]
//                -> sums [3, 7, 5].
export const batchSums = (
  values: ReadonlyArray<number>,
  size: number,
): Effect.Effect<ReadonlyArray<number>, never, never> =>
  Stream.fromIterable(values).pipe(
    Stream.map((batch) => batch),
    Stream.runCollect,
  )
