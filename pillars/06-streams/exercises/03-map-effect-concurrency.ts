import { Effect, Stream } from "effect"

// TODO: For each id in `ids`, call `fetch(id)` (an effectful lookup) and collect
//       the results. Use Stream.mapEffect with the concurrency option set to the
//       given `concurrency` so up to `concurrency` fetches run at once. Even with
//       concurrency, Stream.mapEffect must preserve the INPUT ORDER of results.
//       Collect the results with Stream.runCollect.
export const fetchAll = <A>(
  ids: ReadonlyArray<number>,
  fetch: (id: number) => Effect.Effect<A>,
  concurrency: number,
): Effect.Effect<ReadonlyArray<A>, never, never> =>
  Stream.fromIterable(ids).pipe(
    Stream.mapEffect((id) => fetch(id)),
    Stream.runCollect,
  )
