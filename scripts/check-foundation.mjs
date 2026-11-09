import { readFileSync, existsSync } from "node:fs";

const requiredFiles = [
  "package.json",
  "package-lock.json",
  ".nvmrc",
  ".env.example",
  "docs/PHASE-03-FOUNDATION.md",
  "docs/PHASE-05-RATE-LIMITING.md",
  "docs/PHASE-07-GATEWAY-RUNTIME.md",
  "packages/contracts/src/index.ts",
  "packages/config/src/env.ts",
  "packages/rate-limit/package.json",
  "packages/rate-limit/src/index.ts",
  "packages/rate-limit/src/memory-store.ts",
  "packages/rate-limit/src/redis-store.ts",
  "packages/gateway/package.json",
  "packages/gateway/src/index.ts",
  "packages/gateway/src/runtime.ts",
  "packages/gateway/src/registry.ts",
  "services/Cargo.toml",
  "services/native/src/lib.rs",
];

const failures = [];
for (const path of requiredFiles) {
  if (!existsSync(path)) failures.push(`Missing required foundation file: ${path}`);
}

const root = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
if (root.name !== "hypergaruda-api") failures.push("Unexpected root package name.");
if (root.engines?.node !== ">=22.23.4") failures.push("Node engine baseline mismatch.");
if (lock.lockfileVersion !== 3) failures.push("Expected npm lockfile v3.");
for (const [name, manifestPath] of [
  ["@hypergaruda/config", "packages/config/package.json"],
  ["@hypergaruda/contracts", "packages/contracts/package.json"],
  ["@hypergaruda/gateway", "packages/gateway/package.json"],
  ["@hypergaruda/rate-limit", "packages/rate-limit/package.json"],
]) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.name !== name) failures.push(`Workspace name mismatch: ${manifestPath}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`[foundation] ${failure}`);
  process.exitCode = 1;
} else {
  console.log("[foundation] Required structure and workspace metadata are present.");
}
