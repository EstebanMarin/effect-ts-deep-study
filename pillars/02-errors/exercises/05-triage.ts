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
  return { outcome: "interruption", detail: "interrupted" }
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
