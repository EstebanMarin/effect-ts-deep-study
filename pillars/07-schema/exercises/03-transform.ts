import { Schema, SchemaGetter } from "effect"

// We want a codec whose ENCODED side is a `string` and whose decoded TYPE is a
// `number`: decoding parses the string into a number, encoding renders the
// number back into a string.
//
// TODO: Implement `Temperature` using `Schema.decodeTo`. Start from
// `Schema.String`, target `Schema.Number`, and supply the transformation:
//
//   Schema.String.pipe(
//     Schema.decodeTo(Schema.Number, {
//       decode: SchemaGetter.transform((s) => Number(s)),
//       encode: SchemaGetter.transform((n) => String(n)),
//     }),
//   )
//
// The current stub is the identity string schema retyped, so decoding does NOT
// produce a number and encoding does NOT produce a string. Fix it.
export const Temperature = Schema.String as unknown as Schema.Codec<number, string>

// Decode an encoded string into the numeric temperature.
export const decode = (input: string): number =>
  Schema.decodeUnknownSync(Temperature)(input)

// Encode a numeric temperature back into its string representation.
export const encode = (value: number): string =>
  Schema.encodeUnknownSync(Temperature)(value)
