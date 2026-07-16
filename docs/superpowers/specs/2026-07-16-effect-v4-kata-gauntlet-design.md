# Design: Effect v4 Kata Gauntlet

**Date:** 2026-07-16
**Repo:** `effect-ts-deep-study` (private, github.com/EstebanMarin)
**Author context:** Coming from Scala ZIO; goal is deep hands-on mastery of Effect TS **v4.0**.

## Goal

A rustlings-style **kata gauntlet**: ~50 graded coding exercises (10 pillars × 5 katas,
easy→hard) that teach Effect v4 by making failing tests pass. Pure code, no prose crutch,
no ZIO-mapping notes — learn Effect on its own terms. Muscle memory over reference reading.

## Non-goals

- No reference knowledge base / notes repo.
- No ZIO→Effect mapping docs (explicitly declined).
- No production application. This is a learning artifact.
- No v3 support. v4 beta only.

## Version reality (verified 2026-07-16)

- **Effect v4 is in beta** (first beta 2026-02-18), actively developed through 2026.
  v3 remains the production recommendation; we deliberately choose v4 beta for learning.
- Pin latest `effect@4.0.0-beta.x`. v4 uses **unified package versioning** — every
  ecosystem package shares the same version (`@effect/vitest@4.0.0-beta.x`, etc.).
- Major v4 shifts that shape the pillars:
  - **Core consolidation**: `@effect/platform`, `@effect/rpc`, `@effect/cluster` folded
    into `effect` (often under `effect/unstable/*`).
  - **Service system redesign**: `ServiceMap.Service` replaces `Context.Tag` (closest
    analog to ZIO `ZLayer`/`Has`).
  - **Schema fully overhauled**: `.pipe(Schema.int(), Schema.positive())` →
    `.check(Schema.isInt(), Schema.isGreaterThan(0))`.
  - **STM integrated into core**.
  - Rewritten fiber runtime; ~20× faster streams & batching; ~6.3KB minimal bundle.
- Because APIs are churning, **all exercise code is verified against the actually
  installed beta**, never authored from training-data memory alone.

## Stack

- Package manager: **pnpm**.
- Language: **TypeScript**, `strict: true`.
- Runtime deps: `effect@4.0.0-beta.x`.
- Test: **`@effect/vitest`** + `vitest`. (`@effect/vitest` gives `it.effect`,
  `TestClock`, deterministic effect testing — the ZIO Test analog.)
- No linter/formatter framework required beyond `tsc` type-checking. Optional Biome later.

## Repository structure

```
effect-ts-deep-study/
  package.json
  tsconfig.json
  vitest.config.ts
  README.md                       # 50-kata progress checklist + how-to-run
  .gitignore                      # ignores /solutions
  scripts/
    gauntlet.ts                   # run all pillar tests, print X/50 green
    verify-invariant.ts           # assert every test RED on stub, GREEN on solution
  pillars/
    01-basics/
      exercises/
        01-<name>.ts              # stub with // TODO holes
        ...05-<name>.ts
      tests/
        01-<name>.test.ts         # pre-written, RED until stub is solved
        ...
    02-errors/
    03-services-layers/
    04-concurrency-fibers/
    05-scope-resources/
    06-streams/
    07-schema/
    08-stm/
    09-runtime-config-scheduling/
    10-testing/
  solutions/                      # reference answers, git-ignored (no spoilers)
    01-basics/01-<name>.ts ...
```

## The 10 pillars

| # | Pillar | Hard-part focus |
|---|--------|-----------------|
| 01 | Basics | `Effect` type, constructors, `pipe` vs `Effect.gen`, running effects |
| 02 | Errors | typed errors, `catchTag`, `Cause`, defects vs failures, `Exit` |
| 03 | Services & Layers | `ServiceMap.Service`, layer composition, dependency graph, scoped layers |
| 04 | Concurrency & Fibers | `fork`/`join`, `race`, structured concurrency, interruption |
| 05 | Scope & Resources | `acquireRelease`, `Scope`, resource safety under failure/interrupt |
| 06 | Streams | pull-based `Stream`, transformation, concurrency, backpressure |
| 07 | Schema | decode/encode, `check`, transformations, error formatting (v4 API) |
| 08 | STM | `TRef`, transactional composition, concurrent state without locks |
| 09 | Runtime, Config & Scheduling | `Schedule` (retry/repeat), `Config`, runtime construction |
| 10 | Testing | `@effect/vitest`, `TestClock`, deterministic time, service mocking |

Count is flexible ("the hard stuff") — pillars may split/merge if the beta API makes a
topic thinner or fatter than expected. Target ~5 katas each, ~50 total.

## Exercise mechanic (rustlings-style)

- Each kata = one **stub** file (`exercises/NN-name.ts`) with `// TODO` holes and the
  minimum scaffolding, plus a **pre-written test** (`tests/NN-name.test.ts`) that is RED
  until the stub is correctly filled.
- Difficulty ramps inside a pillar: kata 01 = single isolated concept; kata 05 = compose
  several concepts, often under failure or interruption.
- Reference **solutions** live in `/solutions` (git-ignored) so the learner isn't spoiled
  but a correct answer always exists and is proven to pass.

## Runner & progress

- `pnpm test <pillar>` → run one pillar's tests (RED/GREEN loop).
- `pnpm gauntlet` → `scripts/gauntlet.ts` runs everything and prints `X/50 green` plus a
  per-pillar breakdown.
- `README.md` holds a 50-row checklist the learner ticks off.

## Correctness gates (the real quality bar)

1. **Type-check against installed beta**: every stub, test, and solution must `tsc` cleanly
   against the actually-installed `effect@4` beta. No hallucinated APIs.
2. **Test-the-tests invariant** (`scripts/verify-invariant.ts`): for every kata, the test
   must FAIL when run against the stub and PASS when run against the solution. If either
   direction is wrong, the kata is broken. This script is the gate that proves the whole
   gauntlet is authored correctly.
3. **No-invention rule**: if a pillar's v4 API cannot be verified against the installed
   package or official docs (`MIGRATION.md`, effect-smol, effect.website), the kata is
   flagged and deferred rather than guessed.

## Build approach — the "ultra plan" (multi-agent Workflow)

Authoring 50 verified katas is a fan-out task. Proposed build (requires explicit
go-ahead at execution time due to token cost):

- **Phase 0 (inline):** scaffold repo — `package.json`, install real beta, `tsconfig`,
  `vitest.config`, gauntlet scripts. Capture the *actual* installed API surface as ground
  truth (types, exports) so agents author against reality, not memory.
- **Phase 1 (fan-out):** one agent per pillar (10 concurrent) authors its 5
  stub+test+solution triples, type-checking each against the installed beta.
- **Phase 2 (adversarial verify):** a verifier agent per pillar confirms the
  test-the-tests invariant (RED on stub, GREEN on solution) and flags any hallucinated
  API. Failures loop back to Phase 1 for that pillar.
- **Phase 3 (synthesis, inline):** assemble README checklist, run full `pnpm gauntlet`
  and `verify-invariant`, commit.

If the workflow build is declined, fallback is incremental: build pillar 01 inline as a
proven template, then repeat per pillar across sessions.

## Success criteria

- `pnpm install` resolves a coherent `effect@4` beta set.
- `pnpm gauntlet` runs; with empty stubs it reports `0/50` (all RED); with `/solutions`
  swapped in it reports `50/50` (all GREEN).
- `scripts/verify-invariant.ts` passes for all 50 katas.
- Repo pushed private to github.com/EstebanMarin.

## Risks

- **Beta churn**: APIs may shift between beta releases. Mitigation: pin exact beta version
  in `package.json`; the type-check gate catches drift on reinstall.
- **Thin/undocumented areas** (e.g. STM, unstable HTTP): may yield fewer katas.
  Mitigation: no-invention rule — flag and defer rather than guess.
- **Workflow token cost**: mitigated by explicit opt-in and the inline fallback.
