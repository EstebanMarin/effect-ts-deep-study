import { Effect } from "effect"

// TODO: Use Effect.map to multiply the value of the input effect by 2.
export const double = (
  effect: Effect.Effect<number, never, never>,
): Effect.Effect<number, never, never> => Effect.map(effect, (n) => n * 2)

// TODO: Use Effect.flatMap to take a name from the input effect and return
//       Effect.succeed(`Hello, ${name}`) — i.e. compose two effects together.
export const addGreeting = (
  effect: Effect.Effect<string, never, never>,
): Effect.Effect<string, never, never> =>
  Effect.flatMap(effect, (name) => Effect.succeed(`Hello, ${name}`))
