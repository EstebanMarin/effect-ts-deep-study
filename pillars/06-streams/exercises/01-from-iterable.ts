import { Effect, Stream } from "effect"

// TODO: Build a Stream from the given iterable of numbers using
//       Stream.fromIterable, then run it to completion with Stream.runCollect,
//       returning the collected values as an array. The result of runCollect
//       is already an Array<number>.
export const collectAll = (
  values: Iterable<number>,
): Effect.Effect<ReadonlyArray<number>, never, never> =>
  Stream.runCollect(Stream.fromIterable(values))
