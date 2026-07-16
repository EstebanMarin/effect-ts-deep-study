import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { classify, run } from "../exercises/04-inspect-cause.js"

it.effect("classifies a success", () =>
  Effect.gen(function* () {
    const label = yield* classify(run("ok"))
    expect(label).toBe("success")
  })
)

it.effect("classifies an expected failure (Fail)", () =>
  Effect.gen(function* () {
    const label = yield* classify(run("fail"))
    expect(label).toBe("failure")
  })
)

it.effect("classifies a defect (Die)", () =>
  Effect.gen(function* () {
    const label = yield* classify(run("die"))
    expect(label).toBe("defect")
  })
)
