import { Schema } from "effect"

// A schema describing a person: { name: string, age: number }.
export const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

export type Person = typeof Person.Type

// TODO: Implement `decodePerson` so it decodes an UNKNOWN value into a `Person`
// using the synchronous decoder `Schema.decodeUnknownSync(Person)`.
// It should throw (a SchemaError) when the input does not match the schema.
export const decodePerson = (input: unknown): Person => ({ name: "wrong", age: -1 })
