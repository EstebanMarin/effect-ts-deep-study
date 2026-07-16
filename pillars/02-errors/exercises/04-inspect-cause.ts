import { Effect, Exit } from "effect"

// `run` may succeed, fail (expected), or die (defect). Given to you — do NOT modify.
export const run = (
  kind: "ok" | "fail" | "die",
): Effect.Effect<number, string, never> => {
  if (kind === "fail") return Effect.fail("expected-error")
  if (kind === "die") return Effect.die(new Error("unexpected-defect"))
  return Effect.succeed(99)
}

// Classify the outcome of an Effect<number, string> by inspecting its Exit.
//   - "success" when it succeeded
//   - "failure" when it failed with an expected error (Fail)
//   - "defect"  when it died with a defect (Die)
// TODO: Implement using Effect.exit + Exit.isSuccess / Exit.hasDies (or
//       Exit.hasFails). Right now every outcome is misclassified as "success".
export const classify = (
  effect: Effect.Effect<number, string, never>,
): Effect.Effect<"success" | "failure" | "defect", never, never> =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(effect)
    const result: "success" | "failure" | "defect" = "success"
    if (Exit.isSuccess(exit)) return result
    // TODO: distinguish a defect (Die) from an expected failure (Fail)
    return result
  })
