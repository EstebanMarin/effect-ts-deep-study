import { it, expect } from "@effect/vitest"
import { Effect, Fiber, Ref } from "effect"
import { gatedWork } from "../exercises/04-on-interrupt.js"

it.live("gatedWork runs its interrupt finalizer when the fiber is interrupted", () =>
  Effect.gen(function* () {
    const cleaned = yield* Ref.make(false)
    const onCancel = Ref.set(cleaned, true)

    // Fork the never-ending gated work, let it start, then interrupt it.
    const fiber = yield* Effect.forkChild(gatedWork(onCancel))
    yield* Effect.sleep("10 millis")
    yield* Fiber.interrupt(fiber)

    const didClean = yield* Ref.get(cleaned)
    expect(didClean).toBe(true)
  })
)

it.live("gatedWork does NOT run the finalizer before interruption", () =>
  Effect.gen(function* () {
    const cleaned = yield* Ref.make(false)
    const onCancel = Ref.set(cleaned, true)

    const fiber = yield* Effect.forkChild(gatedWork(onCancel))
    yield* Effect.sleep("10 millis")

    // Still running (never completes) — finalizer must not have fired yet.
    const beforeInterrupt = yield* Ref.get(cleaned)
    expect(beforeInterrupt).toBe(false)

    yield* Fiber.interrupt(fiber)
  })
)
