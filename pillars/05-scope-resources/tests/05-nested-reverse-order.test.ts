import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { openThree } from "../exercises/05-nested-reverse-order.js"

const makeResource = (log: Array<string>) =>
  (name: string): Effect.Effect<string, never, any> =>
    Effect.acquireRelease(
      Effect.sync(() => {
        log.push(`open:${name}`)
        return name
      }),
      () => Effect.sync(() => {
        log.push(`close:${name}`)
      })
    )

it.effect("returns all three acquired values in acquisition order", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const values = yield* openThree(log, makeResource(log))
    expect(values).toEqual(["a", "b", "c"])
  })
)

it.effect("finalizers release in reverse (LIFO) order when the shared scope closes", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    yield* openThree(log, makeResource(log))
    expect(log).toEqual([
      "open:a",
      "open:b",
      "open:c",
      "close:c",
      "close:b",
      "close:a",
    ])
  })
)
