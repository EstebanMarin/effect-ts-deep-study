import { Context, Effect } from "effect"

// A `Clock`-like service that yields the current time in milliseconds. In
// production it would read the wall clock; in tests we provide a mock Layer
// with a fixed value, which is why the logic depends on the service instead of
// calling Date.now() directly.
export class TimeSource extends Context.Service<TimeSource, {
  readonly now: () => number
}>()("TimeSource") {}

// TODO: Implement `isExpired` so it reads the current time from the TimeSource
// service and returns `true` when `deadline` is strictly LESS THAN the current
// time (i.e. the deadline is in the past), and `false` otherwise. Right now it
// ignores the service and always returns false.
export const isExpired = (deadline: number): Effect.Effect<boolean, never, TimeSource> =>
  Effect.gen(function* () {
    return false
  })
