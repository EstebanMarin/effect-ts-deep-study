import { it, expect } from "@effect/vitest"
import { Effect, Ref } from "effect"
import { forkAndJoin } from "../exercises/01-fork-join.js"

it.effect("forkAndJoin returns the forked task's success value", () =>
  Effect.gen(function* () {
    const result = yield* forkAndJoin(Effect.succeed(42))
    expect(result).toBe(42)
  })
)

it.effect("forkAndJoin actually runs the forked task's side effects", () =>
  Effect.gen(function* () {
    const ref = yield* Ref.make(0)
    const task = Effect.gen(function* () {
      yield* Ref.update(ref, (n) => n + 1)
      return "done"
    })
    const result = yield* forkAndJoin(task)
    expect(result).toBe("done")
    const count = yield* Ref.get(ref)
    expect(count).toBe(1)
  })
)
