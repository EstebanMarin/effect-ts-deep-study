import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { fastest, firstToFinish } from "../exercises/03-race.js"

it.live("fastest returns the quicker of two effects", () =>
  Effect.gen(function* () {
    const slow = Effect.as(Effect.sleep("100 millis"), "slow")
    const quick = Effect.as(Effect.sleep("10 millis"), "quick")
    const winner = yield* fastest(slow, quick)
    expect(winner).toBe("quick")
  })
)

it.live("fastest is symmetric — the fast side wins regardless of position", () =>
  Effect.gen(function* () {
    const quick = Effect.as(Effect.sleep("10 millis"), "quick")
    const slow = Effect.as(Effect.sleep("100 millis"), "slow")
    const winner = yield* fastest(quick, slow)
    expect(winner).toBe("quick")
  })
)

it.live("firstToFinish returns the first task to complete, not the first in the array", () =>
  Effect.gen(function* () {
    const tasks = [
      Effect.as(Effect.sleep("100 millis"), "a"),
      Effect.as(Effect.sleep("10 millis"), "b"),
      Effect.as(Effect.sleep("200 millis"), "c"),
    ]
    const winner = yield* firstToFinish(tasks)
    expect(winner).toBe("b")
  })
)
