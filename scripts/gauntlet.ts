import { execFileSync } from "node:child_process"

// Runs the full vitest suite as JSON and prints per-pillar green counts.
// Uses `corepack pnpm exec vitest` so pnpm does not need to be on PATH.
let raw = ""
try {
  raw = execFileSync("corepack", ["pnpm", "exec", "vitest", "run", "--reporter=json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    cwd: process.cwd(),
  })
} catch (e: any) {
  raw = e.stdout ?? "" // vitest exits non-zero when tests fail; still emits JSON
}

if (!raw.trim()) {
  console.log("\n🏁 0/0 green")
  process.exit(0)
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
