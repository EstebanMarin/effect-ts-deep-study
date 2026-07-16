import { Duration, Effect, Ref, Schedule } from "effect"

// A flaky effect that always fails with "boom" and records each attempt.
export const alwaysFails = (
  attempts: Ref.Ref<number>,
): Effect.Effect<never, string, never> =>
  Effect.gen(function* () {
    yield* Ref.update(attempts, (n) => n + 1)
    return yield* Effect.fail("boom")
  })

// TODO: Build a retry schedule that combines exponential backoff with a bounded
// number of retries: use Schedule.exponential for the delay between attempts,
// but cap the total number of retries at `maxRetries` (intersect the two
// policies so retrying stops once the count limit is reached).
//
// Hint: Schedule.exponential(base).pipe(Schedule.upTo({ times: maxRetries }))
//
// Signature: (base, maxRetries) => Schedule<...>
export const backoffCapped = (
  base: Duration.Input,
  maxRetries: number,
): Schedule.Schedule<unknown> =>
  // TODO: replace this stub — currently it performs no retries at all and
  // ignores both `base` and `maxRetries`.
  Schedule.recurs(0)

// Retries `effect` using the backoffCapped schedule. This is already wired up
// for you; it depends on backoffCapped being implemented correctly.
export const retryWithBackoff = (
  effect: Effect.Effect<never, string, never>,
  base: Duration.Input,
  maxRetries: number,
): Effect.Effect<never, string, never> =>
  Effect.retry(effect, backoffCapped(base, maxRetries))
