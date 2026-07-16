# `it.effect` Convention Reference

## Verified Convention

**Plain `it.effect(() => Effect.gen(...))` works without any return-type annotation.**

```typescript
import { it, expect } from "@effect/vitest"
import { Effect } from "effect"

it.effect("description", () =>
  Effect.gen(function* () {
    const result = yield* someEffect
    expect(result).toBe(expectedValue)
  })
)
```

No explicit return type annotation on the callback is needed. TypeScript infers the return type correctly under `exactOptionalPropertyTypes: true` and `strict: true`.

## Probe Results

Verified on 2026-07-16 with:
- `effect@4.0.0-beta.98`
- `@effect/vitest@4.0.0-beta.98`
- `typescript@7.0.2`
- `tsconfig` flags: `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`

**Probe test used** a non-trivial effect with `Effect.acquireRelease` (so `R = Scope.Scope`) and `Effect.sleep(Duration.zero)`:

```typescript
// exercises/01-probe.ts
export const probeScopedEffect: Effect.Effect<number, never, Scope.Scope> =
  Effect.gen(function* () {
    const resource = yield* Effect.acquireRelease(
      Effect.succeed(42),
      (_n) => Effect.void
    )
    yield* Effect.sleep(Duration.zero)
    return resource
  })

// tests/01-probe.test.ts
it.effect("probe: scoped effect with acquireRelease runs correctly", () =>
  Effect.gen(function* () {
    const result = yield* probeScopedEffect
    expect(result).toBe(42)
  })
)
```

`corepack pnpm typecheck` → **0 errors** (no Scope mismatch, no annotation needed).
`corepack pnpm test pillars/00-probe` → **1 passed**.

## Import Extension Convention

Use the `.js` extension for all local TypeScript module imports (NodeNext resolution):

```typescript
import { probeScopedEffect } from "../exercises/01-probe.js"
//                                                      ^^ .js not .ts
```

## When `Effect.scoped` IS Needed

`Effect.scoped` is needed when you want to **return a scoped value from within the test body** (collapsing `R` from `Scope.Scope` to `never`). It is **not** required as a wrapper around the `it.effect` callback itself — `@effect/vitest` already provides `Scope.Scope` as part of `R` for the test runner.

Use `Effect.scoped` inside `Effect.gen` to close a scope explicitly if you need to test teardown behavior.

## Summary

| Scenario | Required form |
|---|---|
| Standard effect test | `it.effect("name", () => Effect.gen(function* () { ... }))` |
| Effect with `acquireRelease` | Same — no extra wrapper needed |
| Test with custom layer | Use `it.layer(MyLayer.Live)(...)` |
| Explicit scope collapse | `yield* Effect.scoped(someScopedEffect)` inside gen |
