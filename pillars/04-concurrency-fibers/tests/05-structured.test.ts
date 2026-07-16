import { it, expect } from "@effect/vitest"
import { Effect, Fiber, Ref } from "effect"
import { superviseChild } from "../exercises/05-structured.js"

it.live("interrupting the parent cascades to interrupt the forked child", () =>
  Effect.gen(function* () {
    const childInterrupted = yield* Ref.make(false)

    // A never-ending child that records when it gets interrupted.
    const child = Effect.onInterrupt(
      Effect.never,
      () => Ref.set(childInterrupted, true),
    )

    // Fork the parent (which itself forks the child), let both start.
    const parent = yield* Effect.forkChild(superviseChild(child))
    yield* Effect.sleep("20 millis")

    // Child should still be alive before we interrupt the parent.
    const beforeInterrupt = yield* Ref.get(childInterrupted)
    expect(beforeInterrupt).toBe(false)

    // Interrupt ONLY the parent — structured concurrency must tear down the child.
    yield* Fiber.interrupt(parent)
    yield* Effect.sleep("20 millis")

    const afterInterrupt = yield* Ref.get(childInterrupted)
    expect(afterInterrupt).toBe(true)
  })
)
