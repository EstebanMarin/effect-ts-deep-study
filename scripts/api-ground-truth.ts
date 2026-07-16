// Dumps the top-level export names of the installed effect beta so authoring
// happens against reality, not memory. Extend the module list as pillars need.
//
// NOTE: effect/ServiceMap does NOT exist in effect@4.0.0-beta.98 — it was renamed/removed.
// Context is served via effect/Context. Some modules live under effect/unstable/*.
const modules = [
  "effect",
  "effect/Schema",
  "effect/Stream",
  "effect/Layer",
  "effect/Context",
  "effect/Effect",
  "effect/Option",
  "effect/Either",
  "effect/Cause",
  "effect/Exit",
  "effect/Fiber",
  "effect/Queue",
  "effect/Ref",
  "effect/Schedule",
  "effect/Duration",
  "effect/Data",
  "effect/Match",
  "effect/Array",
  "effect/Record",
  "effect/Predicate",
  // Unstable platform modules (live under effect/unstable/*)
  "effect/unstable/http",
  "effect/unstable/socket",
]
for (const m of modules) {
  try {
    const mod = await import(m)
    console.log(`\n## ${m}\n` + Object.keys(mod).sort().join(", "))
  } catch (e) {
    console.log(`\n## ${m}\n!! not importable: ${(e as Error).message}`)
  }
}
