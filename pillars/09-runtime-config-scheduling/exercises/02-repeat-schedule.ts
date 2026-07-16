import { Effect, Ref, Schedule } from "effect"

// An effect that increments the given counter by 1 each time it runs and
// returns the new count.
export const tick = (
  counter: Ref.Ref<number>,
): Effect.Effect<number, never, never> =>
  Ref.updateAndGet(counter, (n) => n + 1)

// TODO: Implement `repeatTimes` so it runs `effect` once and then repeats it
// using a schedule that recurs `extra` more times (Schedule.recurs). The effect
// should therefore run a total of (extra + 1) times. Return that total number
// of executions.
//
// Note: Effect.repeat returns the SCHEDULE'S output (the number of repetitions,
// i.e. `extra`), not the effect's last value — so you will need to account for
// the initial run to report the total.
//
// Signature: (effect, extra) => Effect<number, never, never>
export const repeatTimes = (
  effect: Effect.Effect<number, never, never>,
  extra: number,
): Effect.Effect<number, never, never> =>
  // TODO: replace this stub — currently it runs the effect only once and
  // reports a total of 1 regardless of `extra`.
  Effect.as(effect, 1)
