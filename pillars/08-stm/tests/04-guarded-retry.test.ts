import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { guardedWithdraw } from "../exercises/04-guarded-retry.js"

it.effect("withdraws immediately when funds are already sufficient", () =>
  Effect.gen(function* () {
    const result = yield* guardedWithdraw(100, 50, 40)
    expect(result).toBe(60)
  })
)

it.effect("retries until the background top-up makes funds sufficient", () =>
  Effect.gen(function* () {
    // starts at 5, needs 30; the top-up of 50 must arrive before it can proceed
    const result = yield* guardedWithdraw(5, 50, 30)
    expect(result).toBe(25)
  })
)
