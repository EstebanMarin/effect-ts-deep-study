import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { AppError, triageEffect } from "../exercises/05-triage.js"

it.effect("reports success", () =>
  Effect.gen(function* () {
    const t = yield* triageEffect(Effect.succeed(1))
    expect(t).toBe("success")
  })
)

it.effect("triages an expected failure with its message", () =>
  Effect.gen(function* () {
    const t = yield* triageEffect(Effect.fail(new AppError({ message: "nope" })))
    expect(t).toEqual({ outcome: "failure", detail: "nope" })
  })
)

it.effect("triages a defect with the stringified defect", () =>
  Effect.gen(function* () {
    const t = yield* triageEffect(Effect.die("kaboom"))
    expect(t).toEqual({ outcome: "defect", detail: "kaboom" })
  })
)

it.effect("triages an interruption (takes precedence)", () =>
  Effect.gen(function* () {
    const t = yield* triageEffect(Effect.interrupt)
    expect(t).toEqual({ outcome: "interruption", detail: "interrupted" })
  })
)
