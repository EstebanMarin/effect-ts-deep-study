import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { run, AppLive, timestampedLog } from "../exercises/03-compose-layers.js"

it.effect("run uses BOTH the Clock and Logger services", () =>
  Effect.gen(function* () {
    const result = yield* run("boot")
    expect(result).toBe("LOG: [42] boot")
  })
)

it.effect("AppLive provides both services to timestampedLog", () =>
  Effect.gen(function* () {
    const result = yield* Effect.provide(timestampedLog("ping"), AppLive)
    expect(result).toBe("LOG: [42] ping")
  })
)
