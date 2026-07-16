import { Context, Effect, Layer } from "effect"

// Low-level service: connection settings.
export class Config extends Context.Service<Config, {
  readonly dbUrl: string
}>()("Config") {}

// High-level service: a Database that is BUILT from Config.
export class Database extends Context.Service<Database, {
  readonly query: (sql: string) => string
}>()("Database") {}

// A program that only depends on Database (not Config directly).
export const runQuery = (sql: string): Effect.Effect<string, never, Database> =>
  Effect.gen(function* () {
    const db = yield* Database
    return db.query(sql)
  })

export const ConfigLive: Layer.Layer<Config> = Layer.succeed(Config, {
  dbUrl: "postgres://localhost/app",
})

// DatabaseLive is built effectfully: it reads Config, then produces a Database
// whose query method embeds the configured dbUrl.
// Note its requirement channel is `Config` — it needs Config to build.
export const DatabaseLive: Layer.Layer<Database, never, Config> = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config
    return {
      query: (sql: string) => `[${config.dbUrl}] ${sql}`,
    }
  }),
)

// TODO: Wire the graph. Feed ConfigLive into DatabaseLive so the resulting
// layer provides Database with NO remaining Config requirement.
// Hint: use Layer.provide — pass the layer that needs something as the first
// argument and the layer that satisfies it as the second.
//
// The stub below uses the wrong dbUrl because ConfigLive is never wired in.
export const AppLive: Layer.Layer<Database> = Layer.provide(
  DatabaseLive,
  Layer.succeed(Config, { dbUrl: "postgres://WRONG/db" }),
)

// TODO: Provide AppLive to runQuery so no requirements remain.
export const run = (sql: string): Effect.Effect<string, never, never> =>
  Effect.provide(runQuery(sql), AppLive)
