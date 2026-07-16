import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { openResource } from "../exercises/01-acquire-release.js"

it.effect("acquire runs, yields the handle, and release runs when the scope closes", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const handle = yield* Effect.scoped(openResource(log))
    expect(handle).toBe("handle")
    expect(log).toEqual(["open", "close"])
  })
)

it.effect("release only runs once the scope is closed, not before", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    // Use the resource inside the scope; at that point only "open" has happened.
    yield* Effect.scoped(
      Effect.gen(function* () {
        yield* openResource(log)
        expect(log).toEqual(["open"])
      })
    )
    // After the scope closes, the finalizer has appended "close".
    expect(log).toEqual(["open", "close"])
  })
)
