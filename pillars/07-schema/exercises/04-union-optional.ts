import { Schema } from "effect"

// A "circle" is tagged { kind: "circle", radius: number }.
export const Circle = Schema.Struct({
  kind: Schema.Literal("circle"),
  radius: Schema.Number,
})

// A "rect" is tagged { kind: "rect", width: number, height: number } and MAY
// carry an optional `label` string. `Schema.optionalKey` means the key is
// allowed to be absent entirely (not merely `undefined`).
export const Rect = Schema.Struct({
  kind: Schema.Literal("rect"),
  width: Schema.Number,
  height: Schema.Number,
  label: Schema.optionalKey(Schema.String),
})

// TODO: Build `Shape` as the UNION of `Circle` and `Rect` using
// `Schema.Union([Circle, Rect])`. The stub below only accepts circles, so any
// valid rect will fail to decode. Fix it.
export const Shape = Circle

export type Shape = typeof Shape.Type

export const decodeShape = (input: unknown): Shape =>
  Schema.decodeUnknownSync(Shape)(input)
