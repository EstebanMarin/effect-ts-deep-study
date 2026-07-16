import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { Connection, makeConnectionLive } from "../exercises/04-scoped-layer.js"

it.effect("the layer opens on build and closes via its finalizer", () =>
  Effect.gen(function* () {
    const events: Array<string> = []

    // Providing a layer to an effect builds it before, and releases it after,
    // the effect runs. So after this completes, both "open" and "close" ran.
    const program = Effect.gen(function* () {
      const conn = yield* Connection
      expect(conn.send("hi")).toBe("sent:hi")
      // At this point the connection is still open, not yet closed.
      expect(events).toEqual(["open"])
    })

    yield* Effect.provide(program, makeConnectionLive(events))

    // After the scope closes, the release finalizer must have appended "close".
    expect(events).toEqual(["open", "close"])
  })
)

it.effect("finalizer runs exactly once", () =>
  Effect.gen(function* () {
    const events: Array<string> = []
    yield* Effect.provide(Effect.void, makeConnectionLive(events))
    expect(events.filter((e) => e === "close")).toHaveLength(1)
  })
)
