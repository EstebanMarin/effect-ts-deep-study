import { Context, Effect, Layer } from "effect"

// Two independent services.
export class Clock extends Context.Service<Clock, {
  readonly now: () => number
}>()("Clock") {}

export class Logger extends Context.Service<Logger, {
  readonly log: (msg: string) => string
}>()("Logger") {}

// A program that needs BOTH services: it timestamps a log line.
export const timestampedLog = (msg: string): Effect.Effect<string, never, Clock | Logger> =>
  Effect.gen(function* () {
    const clock = yield* Clock
    const logger = yield* Logger
    return logger.log(`[${clock.now()}] ${msg}`)
  })

export const ClockLive: Layer.Layer<Clock> = Layer.succeed(Clock, {
  now: () => 42,
})

export const LoggerLive: Layer.Layer<Logger> = Layer.succeed(Logger, {
  log: (msg) => `LOG: ${msg}`,
})

// TODO: Combine ClockLive and LoggerLive into a single layer that provides
// BOTH Clock and Logger, using Layer.merge(ClockLive, LoggerLive).
// The stub below only merges Logger with itself, so the Clock service it
// provides is not the real ClockLive one — fix it to merge the two services.
export const AppLive: Layer.Layer<Clock | Logger> = Layer.merge(
  Layer.succeed(Clock, { now: () => -1 }),
  LoggerLive,
)

// TODO: Provide AppLive to timestampedLog so no requirements remain.
export const run = (msg: string): Effect.Effect<string, never, never> =>
  Effect.provide(timestampedLog(msg), AppLive)
