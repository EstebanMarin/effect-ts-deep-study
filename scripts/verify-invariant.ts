import { execFileSync } from "node:child_process"
import { readdirSync, copyFileSync, existsSync } from "node:fs"
import { join } from "node:path"

// For each kata: test must FAIL on stub, PASS on solution.
// Maps pillars/<P>/exercises/<K>.ts  <->  solutions/<P>/<K>.ts
// Uses `corepack pnpm exec vitest` so pnpm does not need to be on PATH.
function runTest(testFile: string): boolean {
  try {
    execFileSync("corepack", ["pnpm", "exec", "vitest", "run", testFile], {
      stdio: "ignore",
      cwd: process.cwd(),
    })
    return true // passed
  } catch {
    return false // failed
  }
}

const pillarsDir = "pillars"

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
