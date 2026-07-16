import { it, expect } from "@effect/vitest"
import { Effect, Exit, Ref } from "effect"
import { makeFlaky, retryFlaky } from "../exercises/01-retry-recurs.js"

it.effect("retries enough times to eventually succeed", () =>
  Effect.gen(function* () {
    const attempts = yield* Ref.make(0)
    // fails twice, succeeds on the 3rd run; allow 2 retries (3 total runs).
    const flaky = makeFlaky(attempts, 2)
    const result = yield* retryFlaky(flaky, 2)
    expect(result).toBe("ok")
    expect(yield* Ref.get(attempts)).toBe(3)
  })
)

it.effect("surfaces the error when retries are exhausted", () =>
  Effect.gen(function* () {
    const attempts = yield* Ref.make(0)
    // needs 5 successful passes but only 1 retry (2 runs) is allowed.
    const flaky = makeFlaky(attempts, 5)
    const exit = yield* Effect.exit(retryFlaky(flaky, 1))
    expect(Exit.isFailure(exit)).toBe(true)
    // 1 initial + 1 retry = 2 evaluations.
    expect(yield* Ref.get(attempts)).toBe(2)
  })
)
