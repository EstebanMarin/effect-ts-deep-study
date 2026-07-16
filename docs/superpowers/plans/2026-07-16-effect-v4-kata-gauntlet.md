# Effect v4 Kata Gauntlet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a rustlings-style gauntlet of ~50 Effect v4 katas (10 pillars × 5, easy→hard) where the learner fills stub holes to turn RED `@effect/vitest` tests GREEN.

**Architecture:** A pnpm/TypeScript repo. Each kata = a stub file (with `// TODO`) + a pre-written test that is RED until solved, plus a hidden reference solution proven to pass. A `gauntlet` script reports X/50 green; a `verify-invariant` script proves every test is RED-on-stub / GREEN-on-solution. Pillar 01 is authored inline as the canonical template; pillars 02–10 are fanned out via a multi-agent Workflow, each verified against the actually-installed beta.

**Tech Stack:** pnpm · TypeScript (strict) · `effect@4.0.0-beta.x` (unified versioning) · `@effect/vitest` + vitest · tsx (script runner).

## Global Constraints

- Effect version: pin exact `effect@4.0.0-beta.x` resolved from the `beta` dist-tag; **unified versioning** — `@effect/vitest` must be the SAME beta version.
- **No hallucinated APIs**: all stub/test/solution code must `tsc --noEmit` cleanly against the *installed* beta. If an API can't be verified against the installed package or official docs, flag and defer the kata — never guess.
- **Test-the-tests invariant**: every kata's test MUST fail against its stub and pass against its solution.
- `solutions/` is git-ignored — reference answers never committed.
- Repo: private, `github.com/EstebanMarin/effect-ts-deep-study`.
- Commit frequently, one logical change per commit.
- Working dir: `/home/nix/mine/effect-ts-deep-study` (git already initialized; spec committed).

## File Structure

```
package.json              # pnpm scripts, pinned beta deps
tsconfig.json             # strict TS
vitest.config.ts          # vitest + pillars glob
tsx present via devDep    # run TS scripts
scripts/
  gauntlet.ts             # run all pillar tests → print X/50 green
  verify-invariant.ts     # prove RED-on-stub / GREEN-on-solution for every kata
  api-ground-truth.ts     # dump installed effect@4 export surface for authoring
pillars/NN-<name>/
  exercises/NN-<name>.ts  # stub, // TODO holes
  tests/NN-<name>.test.ts # pre-written, RED until solved
solutions/NN-<name>/NN-<name>.ts   # git-ignored reference answer
README.md                 # 50-kata checklist + how to run
docs/reference/v4-api-surface.md   # captured ground-truth notes
```

---

### Task 1: Repo scaffold + installed beta

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore` (exists — verify)
- Create: `pillars/00-smoke/exercises/01-smoke.ts`, `pillars/00-smoke/tests/01-smoke.test.ts` (throwaway, proves the toolchain)

**Interfaces:**
- Produces: a working `pnpm test` command; installed `effect` + `@effect/vitest` at a pinned beta version recorded in `package.json`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "effect-ts-deep-study",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.12.1",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "gauntlet": "tsx scripts/gauntlet.ts",
    "verify": "tsx scripts/verify-invariant.ts",
    "api": "tsx scripts/api-ground-truth.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 2: Install the beta + dev tooling (pin exact resolved version)**

Run:
```bash
pnpm add effect@beta
pnpm add -D @effect/vitest@beta vitest typescript tsx @types/node
```
Then confirm unified versions match:
```bash
node -p "[require('./node_modules/effect/package.json').version, require('./node_modules/@effect/vitest/package.json').version]"
```
Expected: two identical `4.0.0-beta.x` strings. If they differ, install `@effect/vitest@<exact effect version>`.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "types": ["node"],
    "outDir": "dist"
  },
  "include": ["pillars", "scripts", "solutions"]
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["pillars/**/tests/**/*.test.ts"],
    globals: false,
  },
})
```

- [ ] **Step 5: Write a smoke kata + test to prove the toolchain**

`pillars/00-smoke/exercises/01-smoke.ts`:
```ts
import { Effect } from "effect"

// TODO: return an Effect that succeeds with 42
export const answer = Effect.succeed(0)
```

`pillars/00-smoke/tests/01-smoke.test.ts`:
```ts
import { it, expect } from "@effect/vitest"
import { Effect } from "effect"
import { answer } from "../exercises/01-smoke.js"

it.effect("answer succeeds with 42", () =>
  Effect.gen(function* () {
    const n = yield* answer
    expect(n).toBe(42)
  }),
)
```

- [ ] **Step 6: Run smoke test, verify it FAILS (RED)**

Run: `pnpm test pillars/00-smoke`
Expected: FAIL — got 0, expected 42. (Confirms `it.effect` wiring works and stubs are RED.)

- [ ] **Step 7: Verify import specifier convention**

If the failure is a module-resolution error rather than an assertion error, adjust the import extension (`.js` vs `.ts`) until the failure is the *assertion* (got 0 ≠ 42). Record the working convention — all later tasks use it.

- [ ] **Step 8: Delete the smoke pillar and commit scaffold**

Run:
```bash
rm -rf pillars/00-smoke
git add -A
git commit -m "chore: scaffold pnpm + effect@4 beta + vitest toolchain"
```

---

### Task 2: Tooling scripts (ground-truth, gauntlet, invariant)

**Files:**
- Create: `scripts/api-ground-truth.ts`, `scripts/gauntlet.ts`, `scripts/verify-invariant.ts`
- Create: `docs/reference/v4-api-surface.md`

**Interfaces:**
- Consumes: pinned beta from Task 1.
- Produces: `pnpm api` (dumps installed export surface), `pnpm gauntlet` (X/N green), `pnpm verify` (RED-on-stub/GREEN-on-solution). Convention that `verify-invariant` maps `pillars/<P>/exercises/<K>.ts` ↔ `solutions/<P>/<K>.ts` by identical `<P>/<K>` path.

- [ ] **Step 1: Write `scripts/api-ground-truth.ts`**

```ts
// Dumps the top-level export names of the installed effect beta so authoring
// happens against reality, not memory. Extend the module list as pillars need.
const modules = [
  "effect",
  "effect/Schema",
  "effect/Stream",
  "effect/Layer",
  "effect/ServiceMap",
]
for (const m of modules) {
  try {
    const mod = await import(m)
    console.log(`\n## ${m}\n` + Object.keys(mod).sort().join(", "))
  } catch (e) {
    console.log(`\n## ${m}\n!! not importable: ${(e as Error).message}`)
  }
}
```

- [ ] **Step 2: Run it and capture the surface**

Run: `pnpm api > docs/reference/v4-api-surface.md`
Expected: a markdown file listing real export names per module. Manually eyeball that `Effect`, `ServiceMap`, `Schema` appear. This file is the authoring reference; note that some v4 modules live under `effect/unstable/*`.

- [ ] **Step 3: Write `scripts/gauntlet.ts`**

```ts
import { execFileSync } from "node:child_process"

// Runs the full vitest suite as JSON and prints per-pillar green counts.
let raw = ""
try {
  raw = execFileSync("pnpm", ["exec", "vitest", "run", "--reporter=json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
} catch (e: any) {
  raw = e.stdout ?? "" // vitest exits non-zero when tests fail; still emits JSON
}
const json = JSON.parse(raw)
const byPillar = new Map<string, { pass: number; total: number }>()
for (const f of json.testResults ?? []) {
  const m = f.name.match(/pillars\/([^/]+)\//)
  const pillar = m?.[1] ?? "unknown"
  const cur = byPillar.get(pillar) ?? { pass: 0, total: 0 }
  for (const a of f.assertionResults ?? []) {
    cur.total++
    if (a.status === "passed") cur.pass++
  }
  byPillar.set(pillar, cur)
}
let pass = 0, total = 0
for (const [pillar, c] of [...byPillar].sort()) {
  console.log(`${c.pass === c.total ? "✅" : "⬜"} ${pillar}: ${c.pass}/${c.total}`)
  pass += c.pass; total += c.total
}
console.log(`\n🏁 ${pass}/${total} green`)
```

- [ ] **Step 4: Write `scripts/verify-invariant.ts`**

```ts
import { execFileSync } from "node:child_process"
import { readdirSync, copyFileSync, existsSync } from "node:fs"
import { join } from "node:path"

// For each kata: test must FAIL on stub, PASS on solution.
// Maps pillars/<P>/exercises/<K>.ts  <->  solutions/<P>/<K>.ts
function runTest(testFile: string): boolean {
  try {
    execFileSync("pnpm", ["exec", "vitest", "run", testFile], { stdio: "ignore" })
    return true // passed
  } catch {
    return false // failed
  }
}
const pillarsDir = "pillars"
let ok = true
for (const p of readdirSync(pillarsDir).sort()) {
  const testsDir = join(pillarsDir, p, "tests")
  if (!existsSync(testsDir)) continue
  for (const t of readdirSync(testsDir).filter((f) => f.endsWith(".test.ts"))) {
    const kata = t.replace(".test.ts", "")
    const testFile = join(testsDir, t)
    const exercise = join(pillarsDir, p, "exercises", `${kata}.ts`)
    const solution = join("solutions", p, `${kata}.ts`)

    const stubRed = !runTest(testFile) // expect FAIL
    if (!existsSync(solution)) { console.log(`❓ ${p}/${kata}: no solution`); ok = false; continue }
    copyFileSync(solution, exercise)          // swap in solution
    const solGreen = runTest(testFile)         // expect PASS
    execFileSync("git", ["checkout", "--", exercise]) // restore stub

    const pass = stubRed && solGreen
    if (!pass) ok = false
    console.log(`${pass ? "✅" : "❌"} ${p}/${kata}  stubRED=${stubRed} solGREEN=${solGreen}`)
  }
}
if (!ok) { console.error("\nInvariant FAILED"); process.exit(1) }
console.log("\nAll katas satisfy the invariant.")
```

- [ ] **Step 5: Commit tooling**

Run:
```bash
git add scripts docs/reference/v4-api-surface.md
git commit -m "feat: gauntlet, verify-invariant, and api-ground-truth scripts"
```

---

### Task 3: Author Pillar 01 (Basics) as the canonical template

This task locks the exact conventions every other pillar copies: file naming, stub
shape, `it.effect` usage, solution placement, and the RED→GREEN authoring loop. Author
against `docs/reference/v4-api-surface.md`, not memory.

**Files:**
- Create: `pillars/01-basics/exercises/01..05-<name>.ts`
- Create: `pillars/01-basics/tests/01..05-<name>.test.ts`
- Create: `solutions/01-basics/01..05-<name>.ts` (git-ignored)

**Interfaces:**
- Consumes: import convention + `it.effect` pattern from Task 1; scripts from Task 2.
- Produces: the canonical kata triple shape reused by Task 4. Each kata exports named
  values/functions the test imports; solution shares the identical export signature.

Pillar 01 kata ladder (single concept → composition):
1. `01-succeed-fail` — construct `Effect.succeed` / `Effect.fail`; assert via `Exit`.
2. `02-map-flatmap` — transform with `Effect.map` / `Effect.flatMap`.
3. `03-gen` — rewrite a `pipe` chain using `Effect.gen`.
4. `04-sync-promise` — lift side effects: `Effect.sync`, `Effect.promise`, `Effect.tryPromise`.
5. `05-pipeline` — compose all of the above into one small pipeline (hard kata).

For EACH of the 5 katas, do this loop:

- [ ] **Step A: Write the test first (RED target)**

Pattern (fill real v4 API per `v4-api-surface.md`):
```ts
import { it, expect } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { <exports> } from "../exercises/NN-<name>.js"

it.effect("<behavior>", () =>
  Effect.gen(function* () {
    // arrange/act/assert against the exercise export
  }),
)
```

- [ ] **Step B: Write the stub with `// TODO` holes**

The stub compiles (`tsc --noEmit` clean) but returns a deliberately wrong value so the
test is RED. Example shape:
```ts
import { Effect } from "effect"
// TODO: <instruction>
export const <name> = Effect.succeed(0 as never)
```

- [ ] **Step C: Run the test against the stub — expect RED**

Run: `pnpm test pillars/01-basics/tests/NN-<name>.test.ts`
Expected: FAIL with an ASSERTION error (not a compile/resolution error).

- [ ] **Step D: Write the solution in `solutions/01-basics/NN-<name>.ts`**

Identical exports as the stub, correct implementation, `tsc` clean.

- [ ] **Step E: Prove the solution is GREEN**

Run:
```bash
cp solutions/01-basics/NN-<name>.ts pillars/01-basics/exercises/NN-<name>.ts
pnpm test pillars/01-basics/tests/NN-<name>.test.ts   # expect PASS
git checkout -- pillars/01-basics/exercises/NN-<name>.ts   # restore stub
```
Expected: PASS, then stub restored.

After all 5 katas:

- [ ] **Step F: Type-check the whole pillar**

Run: `pnpm typecheck`
Expected: no errors across exercises, tests, and solutions.

- [ ] **Step G: Run the invariant on Pillar 01**

Run: `pnpm verify`
Expected: 5 lines `✅ 01-basics/NN-... stubRED=true solGREEN=true`.

- [ ] **Step H: Commit the template pillar**

Run:
```bash
git add pillars/01-basics
git commit -m "feat(pillar-01): basics katas — canonical kata template"
```
(`solutions/` is git-ignored and intentionally not committed.)

---

### Task 4: Fan out Pillars 02–10 via multi-agent Workflow

**⚠️ Token-heavy. Requires explicit user go-ahead before running.** If declined, fall
back to repeating Task 3's loop inline, one pillar per session.

**Files:**
- Create: `pillars/02-errors/` … `pillars/10-testing/` (exercises + tests)
- Create: `solutions/02-errors/` … `solutions/10-testing/` (git-ignored)

**Interfaces:**
- Consumes: Task 3's canonical kata shape and `docs/reference/v4-api-surface.md`; the
  installed beta; `scripts/verify-invariant.ts`.
- Produces: 45 additional katas (9 pillars × 5) satisfying the invariant.

Pillar ladders (each easy→hard; agents verify exact API against the installed beta):

- **02-errors:** typed error via tagged class → `catchTag` → `catchAll`/`orElse` → `Cause` inspection → defect vs failure vs interruption (`Exit`).
- **03-services-layers:** define a `ServiceMap.Service` → provide it → compose two layers → scoped layer with cleanup → full dependency graph resolution.
- **04-concurrency-fibers:** `fork`/`join` → `Effect.all` concurrency → `race`/`raceAll` → interruption + `onInterrupt` → structured concurrency (child cancellation).
- **05-scope-resources:** `acquireRelease` → `Scope` lifetime → release-on-failure → release-on-interrupt → nested resources ordered teardown.
- **06-streams:** construct + `runCollect` → `map`/`filter`/`take` → `flatMap`/`mapEffect` concurrency → error handling in a stream → backpressure/chunking.
- **07-schema:** decode/encode a struct → `check` refinements (v4 `isInt`/`isGreaterThan`) → transformation schema → union/optional → formatted decode errors.
- **08-stm:** `TRef` get/set in a transaction → atomic increment → transfer between two `TRef`s → retry/guarded transaction → compose transactions.
- **09-runtime-config-scheduling:** `Schedule.recurs`/`exponential` retry → `repeat` → `Config` read → combine schedules → build/run a custom runtime.
- **10-testing:** `it.effect` basics → `TestClock` advance → test a `Schedule` deterministically → mock a service via layer → assert on `Exit`/`Cause`.

- [ ] **Step 1: Confirm go-ahead**

Ask the user to explicitly approve running the token-heavy Workflow. Do not proceed without it.

- [ ] **Step 2: Run the authoring Workflow**

Invoke the `Workflow` tool with this script (pillars fan out concurrently; each is
authored then adversarially verified):

```js
export const meta = {
  name: 'effect-v4-gauntlet-author',
  description: 'Author + verify Effect v4 katas for pillars 02-10',
  phases: [{ title: 'Author' }, { title: 'Verify' }],
}
const PILLARS = [
  { dir: '02-errors', ladder: 'typed tagged error; catchTag; catchAll/orElse; Cause inspection; defect vs failure vs interruption via Exit' },
  { dir: '03-services-layers', ladder: 'define ServiceMap.Service; provide it; compose two layers; scoped layer with cleanup; full dependency graph' },
  { dir: '04-concurrency-fibers', ladder: 'fork/join; Effect.all concurrency; race/raceAll; interruption + onInterrupt; structured concurrency' },
  { dir: '05-scope-resources', ladder: 'acquireRelease; Scope lifetime; release-on-failure; release-on-interrupt; nested ordered teardown' },
  { dir: '06-streams', ladder: 'construct + runCollect; map/filter/take; flatMap/mapEffect concurrency; stream error handling; backpressure/chunking' },
  { dir: '07-schema', ladder: 'decode/encode struct; check refinements (isInt/isGreaterThan); transformation; union/optional; formatted decode errors' },
  { dir: '08-stm', ladder: 'TRef get/set in txn; atomic increment; transfer between TRefs; guarded/retry txn; compose transactions' },
  { dir: '09-runtime-config-scheduling', ladder: 'Schedule.recurs/exponential retry; repeat; Config read; combine schedules; custom runtime' },
  { dir: '10-testing', ladder: 'it.effect basics; TestClock advance; deterministic Schedule test; mock service via layer; assert Exit/Cause' },
]
const KATA_SCHEMA = {
  type: 'object',
  required: ['katas'],
  properties: {
    katas: { type: 'array', items: {
      type: 'object',
      required: ['index', 'name', 'stubRed', 'solGreen'],
      properties: {
        index: { type: 'number' }, name: { type: 'string' },
        stubRed: { type: 'boolean' }, solGreen: { type: 'boolean' },
        note: { type: 'string' },
      },
    } },
  },
}
const results = await pipeline(
  PILLARS,
  (p) => agent(
    `You are authoring Effect v4 (beta) katas for pillar ${p.dir} in the repo at ` +
    `/home/nix/mine/effect-ts-deep-study. Read docs/superpowers/plans/2026-07-16-effect-v4-kata-gauntlet.md ` +
    `(Task 3 defines the EXACT kata template) and docs/reference/v4-api-surface.md and pillars/01-basics ` +
    `as the reference. Author 5 katas following this easy→hard ladder: ${p.ladder}. ` +
    `For EACH kata create pillars/${p.dir}/exercises/NN-name.ts (compiling stub with // TODO, wrong value → RED), ` +
    `pillars/${p.dir}/tests/NN-name.test.ts (pre-written), and solutions/${p.dir}/NN-name.ts (correct). ` +
    `VERIFY every API against the installed beta by running: pnpm typecheck, and for each kata run the test ` +
    `against the stub (must FAIL with an assertion error, not a compile error) and against the solution (must PASS). ` +
    `NEVER invent an API — if you cannot verify one against the installed package, pick a different kata for that ` +
    `rung and note it. Report per-kata stubRed/solGreen.`,
    { label: `author:${p.dir}`, phase: 'Author', schema: KATA_SCHEMA },
  ),
  (authored, p) => agent(
    `Adversarially verify Effect v4 pillar ${p.dir} in /home/nix/mine/effect-ts-deep-study. ` +
    `Run: pnpm typecheck (must be clean). Then run scripts/verify-invariant.ts logic for THIS pillar only — ` +
    `for each kata in pillars/${p.dir}, confirm the test FAILS on the committed stub and PASSES when ` +
    `solutions/${p.dir}/NN.ts is copied over the exercise (restore the stub with git checkout afterward). ` +
    `Also grep the stub/test/solution for any import of a module or symbol NOT present in the installed ` +
    `effect package — report any hallucinated API. Return the true measured stubRed/solGreen per kata.`,
    { label: `verify:${p.dir}`, phase: 'Verify', schema: KATA_SCHEMA },
  ),
)
return { pillars: results.filter(Boolean) }
```

- [ ] **Step 3: Review the workflow report**

Expected: for all 9 pillars, every kata reports `stubRed=true` and `solGreen=true` with
no hallucinated-API notes. Any pillar with failures → re-dispatch just that pillar's
author+verify (edit the script's `PILLARS` to the failing subset and re-run).

- [ ] **Step 4: Run the global invariant + type-check**

Run:
```bash
pnpm typecheck
pnpm verify
```
Expected: `pnpm typecheck` clean; `pnpm verify` prints `✅` for all ~50 katas and "All katas satisfy the invariant."

- [ ] **Step 5: Commit all pillars**

Run:
```bash
git add pillars docs/reference/v4-api-surface.md
git commit -m "feat: author pillars 02-10 (45 verified katas)"
```

---

### Task 5: README, final gauntlet run, private push

**Files:**
- Create: `README.md`
- Modify: `package.json` (verify scripts present — no change if Task 1 complete)

**Interfaces:**
- Consumes: all pillars from Tasks 3–4.
- Produces: learner-facing entry point + published private repo.

- [ ] **Step 1: Write `README.md`**

Include: one-paragraph purpose; `pnpm install`; how to solve a kata
(`pnpm test <pillar>` → edit stub → GREEN); `pnpm gauntlet` for progress; and a 50-row
checklist grouped by pillar, e.g.:
```md
### 01 · Basics
- [ ] 01 succeed-fail
- [ ] 02 map-flatmap
...
```
Generate the checklist from the real filenames on disk:
```bash
for d in pillars/*/; do echo "### ${d}"; ls "${d}exercises" | sed 's/^/- [ ] /'; done
```

- [ ] **Step 2: Run the full gauntlet against stubs — expect all RED**

Run: `pnpm gauntlet`
Expected: `🏁 0/50 green` (learner hasn't solved anything yet — correct starting state).

- [ ] **Step 3: Commit README**

Run:
```bash
git add README.md
git commit -m "docs: add README with run instructions and 50-kata checklist"
```

- [ ] **Step 4: Create the private GitHub repo and push**

Run:
```bash
gh repo create EstebanMarin/effect-ts-deep-study --private --source=. --remote=origin --push
```
Expected: repo created private; `main` pushed. Confirm:
```bash
gh repo view EstebanMarin/effect-ts-deep-study --json visibility,url
```
Expected: `"visibility": "PRIVATE"`.

- [ ] **Step 5: Final verification**

Run:
```bash
pnpm typecheck && pnpm verify
```
Expected: type-check clean; invariant passes for all ~50 katas. Gauntlet is complete and published.

---

## Self-Review

**Spec coverage:**
- Repo/stack (spec §Repo, §Stack) → Task 1. ✓
- 10-pillar structure (spec §Structure, §Pillars) → Tasks 3–4. ✓
- rustlings mechanic (spec §Mechanic) → Task 3 template, Task 4 fan-out. ✓
- Runner + progress (spec §Runner) → Task 2 gauntlet, Task 5 README. ✓
- Correctness gates: type-check + test-the-tests + no-invention (spec §Correctness) → Task 2 scripts, enforced in Tasks 3–4. ✓
- Ultra-plan workflow build (spec §Build approach) → Task 4, with inline fallback noted. ✓
- Hidden solutions (spec §Structure) → `.gitignore` + `solutions/` convention, Tasks 1–4. ✓
- Success criteria: `0/50` on stubs, `50/50` on solutions, invariant passes, private push → Tasks 4–5. ✓

**Placeholder scan:** No "TBD/TODO-in-plan". The `// TODO` tokens are intentional kata-content holes, not plan gaps. Kata *code* is authored against the installed beta during execution (by design — the no-invention rule forbids embedding guessed v4 API), with exact verification commands given per step. ✓

**Type consistency:** Script names consistent (`gauntlet.ts`, `verify-invariant.ts`, `api-ground-truth.ts`); path convention `pillars/<P>/exercises/<K>.ts` ↔ `solutions/<P>/<K>.ts` used identically in Task 2 script and Task 3/4 authoring. Pillar dir names match between plan ladders and workflow `PILLARS` array. ✓
