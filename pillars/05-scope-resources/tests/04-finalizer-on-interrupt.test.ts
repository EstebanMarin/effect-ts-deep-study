import { it, expect } from "@effect/vitest"
import { Effect, Fiber } from "effect"
import { interruptibleTask } from "../exercises/04-finalizer-on-interrupt.js"

it.effect("onInterrupt finalizer runs when the fiber is interrupted", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const fiber = yield* Effect.forkChild(interruptibleTask(log))
    // Let the child actually begin running before we cancel it.
    yield* Effect.yieldNow
    yield* Fiber.interrupt(fiber)
    expect(log).toEqual(["interrupted"])
  })
)

it.effect("finalizer does NOT fire if the task is never interrupted", () =>
  Effect.gen(function* () {
    const log: Array<string> = []
    const fiber = yield* Effect.forkChild(interruptibleTask(log))
    yield* Effect.yieldNow
    // Still running, not interrupted yet: nothing recorded.
    expect(log).toEqual([])
    // Clean up the dangling fiber.
    yield* Fiber.interrupt(fiber)
  })
)
