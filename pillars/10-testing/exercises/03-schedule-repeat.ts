import { Effect } from "effect"

// `pollUntil` runs `tick` once immediately and then repeats it `extraTimes`
// more times, each repetition spaced `intervalMillis` apart (so it executes
// `extraTimes + 1` times in total). We drive it deterministically with a
// TestClock in the test: no repeat fires until the clock is advanced past the
// interval.
//
// TODO: Implement `pollUntil` using `Effect.repeat(tick, schedule)` where the
// schedule recurs `extraTimes` times with a delay of `intervalMillis` between
// each recurrence. Build it with `Schedule.recurs(extraTimes)` and attach the
// spacing via `Schedule.addDelay(..., () => Effect.succeed(intervalMillis))`.
// Right now it runs `tick` a single time and never repeats.
export const pollUntil = (
  tick: Effect.Effect<void>,
  intervalMillis: number,
  extraTimes: number
): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* tick
  })
