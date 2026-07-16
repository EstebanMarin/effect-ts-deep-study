import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { useOnce } from "../exercises/02-scoped-lifetime.js"

const makeResource = (log: Array<string>): Effect.Effect<string, never, any> =>
  Effect.acquireRelease(
    Effect.sync(() => {
      log.push("open")
      return "conn"
    }),
    () => Effect.sync(() => {
      log.push("close")
    })
  )

it.effect("uses the resource then closes its scope, returning the uppercased value", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const result = yield* useOnce(makeResource(log))
    expect(result).toBe("CONN")
    expect(log).toEqual(["open", "close"])
  })
)

it.effect("discharges the Scope requirement so the effect runs without an outer scope", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    // If useOnce still required a Scope, this yield* would not typecheck / run
    // to completion with a closed finalizer. We assert the finalizer ran.
    yield* useOnce(makeResource(log))
    expect(log[log.length - 1]).toBe("close")
  })
)
