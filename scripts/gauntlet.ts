import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

// Runs the full vitest suite as JSON and prints per-pillar green kata counts.
// A KATA = one test file. A kata is GREEN iff every assertion in that file passed.
// Uses `corepack pnpm exec vitest` so pnpm does not need to be on PATH.

// Anchor to repo root (scripts/ is one level below root)
const root = fileURLToPath(new URL("..", import.meta.url))

let raw = ""
let stderrRaw = ""
try {
  raw = execFileSync("corepack", ["pnpm", "exec", "vitest", "run", "--reporter=json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    cwd: root,
  })
} catch (e: any) {
  raw = e.stdout ?? ""        // vitest exits non-zero when tests fail; still emits JSON
  stderrRaw = e.stderr ?? ""
}

if (!raw.trim()) {
  // Check for a broken environment: if stderr has content it may indicate a startup failure
  if (stderrRaw.trim()) {
    process.stderr.write(stderrRaw)
    process.exit(1)
  }
  console.log("\n🏁 0/0 green")
  process.exit(0)
}

const json = JSON.parse(raw)
const results: Array<{ name: string; status: string; assertionResults?: Array<{ status: string }> }> = json.testResults ?? []

// If JSON parsed but no results and stderr has content, it's a broken env
if (results.length === 0 && stderrRaw.trim()) {
  process.stderr.write(stderrRaw)
  process.exit(1)
}

if (results.length === 0) {
  console.log("\n🏁 0/0 green")
  process.exit(0)
}

// Count katas (files) per pillar. A kata is GREEN iff file status === "passed"
// (i.e. every assertion in the file passed).
const byPillar = new Map<string, { pass: number; total: number }>()
for (const f of results) {
  // f.name is the absolute file path; extract pillar from pillars/<name>/
  const m = f.name.match(/pillars\/([^/]+)\//)
  const pillar = m?.[1] ?? "unknown"
  const cur = byPillar.get(pillar) ?? { pass: 0, total: 0 }
  cur.total++
  if (f.status === "passed") cur.pass++
  byPillar.set(pillar, cur)
}

let pass = 0, total = 0
for (const [pillar, c] of [...byPillar].sort()) {
  console.log(`${c.pass === c.total ? "✅" : "⬜"} ${pillar}: ${c.pass}/${c.total}`)
  pass += c.pass; total += c.total
}
console.log(`\n🏁 ${pass}/${total} green`)
