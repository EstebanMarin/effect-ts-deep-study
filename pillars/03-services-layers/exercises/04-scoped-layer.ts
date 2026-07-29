import { Context, Effect, Layer } from "effect"

// A Connection service that records lifecycle events into a shared log array.
// Acquiring pushes "open"; the layer's finalizer must push "close" when the
// scope that built the layer is closed.
export class Connection extends Context.Service<Connection, {
  readonly send: (msg: string) => string
}>()("Connection") {}

// Builds a scoped Layer for Connection. The passed-in `events` array is used to
// observe acquisition and release order from tests.
//
// TODO: Use Effect.acquireRelease so that:
//   - acquire: pushes "open" onto `events` and returns the service object
//               { send: (msg) => `sent:${msg}` }
//   - release: pushes "close" onto `events`
// Then wrap that scoped acquisition in Layer.effect(Connection, <acquire>).
//
// The stub below never registers a finalizer, so "close" is never recorded.
export const makeConnectionLive = (
  events: Array<string>,
): Layer.Layer<Connection> =>
  Layer.effect(
    Connection,
    Effect.acquireRelease(
      Effect.sync(() => {
	events.push("open")
	return { send: () => `sent:hi`}
      }),
      () => Effect.sync(() => { events.push("close") })
    ),
  )
