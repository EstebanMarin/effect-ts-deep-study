import { Effect } from "effect"

// `delayedValue` sleeps for the given duration and then produces `value`.
// Under `it.effect` a TestClock is installed, so the sleep is virtual: the
// test can advance time with TestClock.adjust instead of waiting in real time.
//
// TODO: Implement `delayedValue` so it FIRST sleeps for `millis` milliseconds
// (use Effect.sleep) and THEN returns `value`. Right now it returns immediately
// without sleeping.
export const delayedValue = <A>(millis: number, value: A): Effect.Effect<A> =>
  Effect.gen(function* () {
    return value
  })
