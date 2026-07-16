import { Config, ConfigProvider, Effect } from "effect"

// Reads a "HOST" (string) and "PORT" (int) from configuration and formats them
// as "<host>:<port>". A `Config<T>` is itself an Effect that reads from the
// active ConfigProvider (a Reference with a default), so it can be yielded
// inside Effect.gen directly.
//
// TODO: Implement the body so it reads HOST via Config.string and PORT via
// Config.int, then returns `${host}:${port}`.
export const readEndpoint: Effect.Effect<string, Config.ConfigError, never> =
  Effect.gen(function* () {
  // TODO: read HOST and PORT from config and combine them.
  // Currently this ignores the provider and returns a placeholder.
  return "unset:0"
})

// TODO: Implement `runWithConfig` so it runs `readEndpoint` using an in-memory
// ConfigProvider built from the given record (ConfigProvider.fromUnknown),
// provided via ConfigProvider.layer.
//
// Signature: (values) => Effect<string, Config.ConfigError, never>
export const runWithConfig = (
  values: Record<string, string>,
): Effect.Effect<string, Config.ConfigError, never> =>
  // TODO: supply a ConfigProvider built from `values` to `readEndpoint`.
  Effect.succeed("unset:0")
