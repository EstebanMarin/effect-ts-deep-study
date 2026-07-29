import { Effect, Layer } from "effect"
import { Context } from "effect"

// A Config service holding a base URL and a request timeout.
export class Config extends Context.Service<Config, {
  readonly baseUrl: string
  readonly timeoutMs: number
}>()("Config") {}

// A program that reads the Config service and formats a description string.
export const describeConfig: Effect.Effect<string, never, Config> = Effect.gen(
  function* () {
    const config = yield* Config
    return `${config.baseUrl} (timeout ${config.timeoutMs}ms)`
  },
)

// TODO: Build a Layer that provides the Config service with:
//   baseUrl:   "https://api.example.com"
//   timeoutMs: 3000
// Use Layer.succeed(Config, { ... }).
export const ConfigLive: Layer.Layer<Config> = Layer.succeed(Config, {
  // TODO: fill in the correct baseUrl and timeoutMs values
  baseUrl: "https://api.example.com",
  timeoutMs: 3000,
})

// TODO: Provide ConfigLive to describeConfig using Effect.provide so the
// resulting Effect has no remaining requirements.
export const program: Effect.Effect<string, never, never> = Effect.provide(
  describeConfig,
  ConfigLive,
)
