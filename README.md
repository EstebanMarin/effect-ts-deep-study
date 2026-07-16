# Effect v4 Kata Gauntlet

A **rustlings-style** collection of 50 Effect v4 (beta) katas across 10 pillars. Each kata is a failing test suite with an exercise stub — your job is to fill in the `// TODO` sections until the tests turn green. The goal is deep, hands-on fluency with Effect v4, covering everything from core primitives to STM, streaming, Schema, and testing. This repo targets **effect@4.0.0-beta.98**.

---

## Prerequisites & Setup

- Node.js ≥ 20 with Corepack enabled
- Run once to install dependencies:

```bash
corepack pnpm install
```

---

## How to Solve a Kata

1. Pick a pillar directory under `pillars/`.
2. Open the exercise stub (e.g. `pillars/01-basics/exercises/01-succeed-fail.ts`).
3. Run the tests for that pillar in watch mode:

```bash
corepack pnpm test:watch pillars/01-basics
```

   Or run them once:

```bash
corepack pnpm test pillars/01-basics
```

4. Read the RED test output. Open the corresponding test file in `pillars/<pillar>/tests/` to understand what is expected.
5. Fill in the `// TODO` sections in the exercise stub until the tests turn GREEN.
6. Move on to the next kata.

---

## Track Your Progress

Run the full gauntlet to see how many katas you have fully passing across all 50 katas:

```bash
corepack pnpm gauntlet
```

A kata is **green** only when every assertion in its test file passes. The total reflects whole-kata completions, not individual assertions. A fresh clone with unsolved stubs starts at `0/50 green`.

---

## Solutions

`solutions/` is **intentionally git-ignored**. Reference answers exist locally for authors but are not shipped in this repository — work through the `// TODO` stubs yourself.

---

## 50-Kata Checklist

### 01 · Basics

- [ ] 01-succeed-fail
- [ ] 02-map-flatmap
- [ ] 03-gen
- [ ] 04-sync-promise
- [ ] 05-pipeline

### 02 · Errors

- [ ] 01-tagged-fail
- [ ] 02-catch-tag
- [ ] 03-catch-cause
- [ ] 04-inspect-cause
- [ ] 05-triage

### 03 · Services & Layers

- [ ] 01-define-service
- [ ] 02-layer-succeed
- [ ] 03-compose-layers
- [ ] 04-scoped-layer
- [ ] 05-dependency-graph

### 04 · Concurrency & Fibers

- [ ] 01-fork-join
- [ ] 02-all-concurrency
- [ ] 03-race
- [ ] 04-on-interrupt
- [ ] 05-structured

### 05 · Scope & Resources

- [ ] 01-acquire-release
- [ ] 02-scoped-lifetime
- [ ] 03-finalizer-on-failure
- [ ] 04-finalizer-on-interrupt
- [ ] 05-nested-reverse-order

### 06 · Streams

- [ ] 01-from-iterable
- [ ] 02-map-filter-take
- [ ] 03-map-effect-concurrency
- [ ] 04-error-handling
- [ ] 05-grouped-batches

### 07 · Schema

- [ ] 01-decode-struct
- [ ] 02-refinements
- [ ] 03-transform
- [ ] 04-union-optional
- [ ] 05-decode-result

### 08 · STM

- [ ] 01-txref-get-set
- [ ] 02-atomic-increment
- [ ] 03-transfer
- [ ] 04-guarded-retry
- [ ] 05-all-or-nothing

### 09 · Runtime, Config & Scheduling

- [ ] 01-retry-recurs
- [ ] 02-repeat-schedule
- [ ] 03-config-provider
- [ ] 04-combine-schedules
- [ ] 05-managed-runtime

### 10 · Testing

- [ ] 01-it-effect
- [ ] 02-testclock-sleep
- [ ] 03-schedule-repeat
- [ ] 04-mock-service
- [ ] 05-exit-cause
