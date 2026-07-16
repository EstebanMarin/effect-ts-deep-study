import { Effect, Ref, Schedule } from "effect"

// A flaky effect: it fails with the string "boom" the first `failuresBefore`
// times it is run, then succeeds with "ok". The `attempts` Ref counts every run.
export const makeFlaky = (
  attempts: Ref.Ref<number>,
  failuresBefore: number,
): Effect.Effect<string, string, never> =>
  Effect.gen(function* () {
    const n = yield* Ref.updateAndGet(attempts, (x) => x + 1)
    if (n <= failuresBefore) {
      return yield* Effect.fail("boom")
    }
    return "ok"
  })

// TODO: Implement `retryFlaky` so it runs `effect` and, on failure, retries it
// using a schedule that recurs up to `maxRetries` additional times
// (Schedule.recurs). With enough retries the flaky effect should ultimately
// succeed; if the retries are exhausted the original error should surface.
//
// Signature: (effect, maxRetries) => Effect<string, string, never>
export const retryFlaky = (
  effect: Effect.Effect<string, string, never>,
  maxRetries: number,
): Effect.Effect<string, string, never> =>
  // TODO: replace this stub — currently it ignores maxRetries and never retries.
  effect
