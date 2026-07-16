import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { transfer } from "../exercises/03-transfer.js"

it.effect("moves the amount from one account to the other", () =>
  Effect.gen(function* () {
    const result = yield* transfer(100, 0, 30)
    expect(result).toEqual([70, 30])
  })
)

it.effect("conserves the total balance", () =>
  Effect.gen(function* () {
    const [from, to] = yield* transfer(50, 20, 10)
    expect(from).toBe(40)
    expect(to).toBe(30)
    expect(from + to).toBe(70)
  })
)
