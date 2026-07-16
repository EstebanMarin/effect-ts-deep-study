import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { run, AppLive, runQuery } from "../exercises/05-dependency-graph.js"

it.effect("Database is built from the real Config dbUrl", () =>
  Effect.gen(function* () {
    const result = yield* run("SELECT 1")
    expect(result).toBe("[postgres://localhost/app] SELECT 1")
  })
)

it.effect("AppLive resolves the whole Config -> Database graph", () =>
  Effect.gen(function* () {
    const result = yield* Effect.provide(runQuery("SELECT *"), AppLive)
    expect(result).toBe("[postgres://localhost/app] SELECT *")
  })
)
