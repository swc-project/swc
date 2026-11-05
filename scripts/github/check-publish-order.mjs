#!/usr/bin/env node
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { analyzePublishOrder } from "./publish-order.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));

const { stdout } = await execFileAsync(
  "cargo",
  ["metadata", "--no-deps", "--format-version", "1"],
  { cwd: repositoryRoot, maxBuffer: 64 * 1024 * 1024 }
);
const result = analyzePublishOrder(JSON.parse(stdout));

if (result.cycles.length === 0) {
  console.log(
    `Publish dependency order is acyclic for ${result.packageCount} packages.`
  );
  process.exit(0);
}

const packageCount = result.cycles.reduce(
  (count, cycle) => count + cycle.packages.length,
  0
);

console.error("::error::Publish dependency order has a cycle.");
console.error(
  `Selected ${result.packageCount} publishable packages; ${packageCount} packages are in a cycle.`
);

for (const [index, cycle] of result.cycles.entries()) {
  console.error(`Cycle ${index + 1}: ${cycle.packages.join(", ")}`);
  for (const edge of cycle.edges) {
    console.error(
      `  ${edge.from} -> ${edge.to} (${edge.kinds.join("+")})`
    );
  }
}

console.error(
  "cargo mono publish includes normal, build, and dev dependencies in its package order."
);
console.error(
  "Remove the path dependency that closes the cycle, or move the test coverage to a crate that already depends on both packages."
);
process.exit(1);
