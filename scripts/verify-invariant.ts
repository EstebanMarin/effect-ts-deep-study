import { execFileSync } from "node:child_process"
import { readdirSync, copyFileSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// For each kata: test must FAIL on stub, PASS on solution.
// Maps pillars/<P>/exercises/<K>.ts  <->  solutions/<P>/<K>.ts
// Uses `corepack pnpm exec vitest` so pnpm does not need to be on PATH.

// Anchor to repo root (scripts/ is one level below root)
const root = fileURLToPath(new URL("..", import.meta.url))

function runTest(testFile: string): boolean {
  try {
    execFileSync("corepack", ["pnpm", "exec", "vitest", "run", testFile], {
      stdio: "ignore",
      cwd: root,
    })
    return true // passed
  } catch {
    return false // failed
  }
}

const pillarsDir = resolve(root, "pillars")

if (!existsSync(pillarsDir)) {
  console.log("All katas satisfy the invariant.")
  process.exit(0)
}

let ok = true
const pillars = readdirSync(pillarsDir).sort()

if (pillars.length === 0) {
  console.log("All katas satisfy the invariant.")
  process.exit(0)
}

for (const p of pillars) {
  const testsDir = join(pillarsDir, p, "tests")
  if (!existsSync(testsDir)) continue
  for (const t of readdirSync(testsDir).filter((f) => f.endsWith(".test.ts"))) {
    const kata = t.replace(".test.ts", "")
    const testFile = join(testsDir, t)
    const exercise = join(pillarsDir, p, "exercises", `${kata}.ts`)
    const solution = resolve(root, "solutions", p, `${kata}.ts`)

    // M2: check solution existence BEFORE running the stub test (avoid wasted invocation)
    if (!existsSync(solution)) {
      console.log(`❓ ${p}/${kata}: no solution`)
      ok = false
      continue
    }

    const stubRed = !runTest(testFile) // expect FAIL

    copyFileSync(solution, exercise)   // swap in solution
    let solGreen: boolean
    try {
      solGreen = runTest(testFile)     // expect PASS
    } finally {
      // C1: ALWAYS restore stub, even if runTest throws
      execFileSync("git", ["checkout", "--", exercise], { cwd: root })
    }

    const pass = stubRed && solGreen!
    if (!pass) ok = false
    console.log(`${pass ? "✅" : "❌"} ${p}/${kata}  stubRED=${stubRed} solGREEN=${solGreen!}`)
  }
}
if (!ok) { console.error("\nInvariant FAILED"); process.exit(1) }
console.log("\nAll katas satisfy the invariant.")
