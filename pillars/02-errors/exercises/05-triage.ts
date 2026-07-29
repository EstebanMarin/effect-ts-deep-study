import { Cause, Data, Effect, Result } from "effect"

export class AppError extends Data.TaggedError("AppError")<{
  readonly message: string
}> {}

// A full triage report distinguishing the three ways an Effect can end
// abnormally, plus a human-readable detail string.
export interface Triage {
  readonly outcome: "failure" | "defect" | "interruption"
  readonly detail: string
}

// TODO: Given an already-obtained Cause<AppError>, produce a Triage:
//   - interruption: outcome "interruption", detail "interrupted"
//       (check Cause.hasInterrupts FIRST — an interrupt takes precedence).
//   - defect (die): outcome "defect", detail = String(theDefect)
//       (extract the defect with Cause.findDefect, which returns a Result;
//        use Result.isSuccess + `.success`, fall back to "unknown" if absent).
//   - failure (fail): outcome "failure", detail = the AppError's `message`
//       (extract the error with Cause.findError, which returns a Result;
//        use Result.isSuccess + `.success`, fall back to "unknown" if absent).
// Right now everything is misreported as an interruption.
  export const triage = (cause: Cause.Cause<AppError>): Triage => {
    // 1. Interrupt wins — check first.
    if (Cause.hasInterrupts(cause)) {
      return { outcome: "interruption", detail: "interrupted" }
    }
    // 2. Defect (die).
    if (Cause.hasDies(cause)) {
      const defect = Cause.findDefect(cause)
      return {
        outcome: "defect",
        detail: Result.isSuccess(defect) ? String(defect.success) : "unknown",
      }
    }
    // 3. Expected failure (fail).
    const error = Cause.findError(cause)
    return {
      outcome: "failure",
      detail: Result.isSuccess(error) ? error.success.message : "unknown",
    }
  }


// Convenience: run an effect and triage its failure cause (given to you).
export const triageEffect = (
  effect: Effect.Effect<unknown, AppError, never>,
): Effect.Effect<Triage | "success", never, never> =>
  effect.pipe(
    Effect.matchCause({
      onSuccess: () => "success" as const,
      onFailure: (cause) => triage(cause),
    }),
  )
