import { readFileSync, existsSync } from "node:fs";

const requiredFiles = [
  "package.json",
  "package-lock.json",
  ".nvmrc",
  ".env.example",
  "docs/PHASE-03-FOUNDATION.md",
  "packages/contracts/src/index.ts",
  "packages/config/src/env.ts",
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
for (const name of ["@hypergaruda/config", "@hypergaruda/contracts"]) {
  const manifestPath = name.endsWith("config")
    ? "packages/config/package.json"
    : "packages/contracts/package.json";
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.name !== name) failures.push(`Workspace name mismatch: ${manifestPath}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`[foundation] ${failure}`);
  process.exitCode = 1;
} else {
  console.log("[foundation] Required structure and workspace metadata are present.");
}
