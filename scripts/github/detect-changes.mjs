#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { classifyChanges, isMainPush } from "./change-detection.mjs";

const execFileAsync = promisify(execFile);
const DEFAULT_BASE_BRANCH = "main";

const eventName = process.env.GITHUB_EVENT_NAME ?? "";
const gitRef = process.env.GITHUB_REF ?? "";
const baseBranch = process.env.GITHUB_BASE_REF || DEFAULT_BASE_BRANCH;
const changedBaseRef = `origin/${baseBranch}`;

try {
  if (isMainPush(eventName, gitRef)) {
    process.stderr.write("Running the complete CI suite for a push to main.\n");
    printOutputs(classifyChanges({ forceAll: true }));
  } else {
    process.stderr.write(
      `Detecting changes for event=${eventName}, ref=${gitRef}, base=${changedBaseRef}.\n`
    );
    const { stdout } = await execFileAsync(
      "cargo",
      ["mono", "--output", "json", "changed", "--base", changedBaseRef],
      { maxBuffer: 10 * 1024 * 1024 }
    );
    const changed = JSON.parse(stdout);
    const outputs = classifyChanges({
      files: changed.files ?? [],
      packages: changed.packages ?? [],
    });

    process.stderr.write(
      `Detected ${changed.files?.length ?? 0} changed files and ${
        outputs.affectedPackages.length
      } affected packages.\n`
    );
    printOutputs(outputs);
  }
} catch (error) {
  process.stderr.write(
    `Failed to detect changes; running the complete CI suite: ${error}\n`
  );
  printOutputs(classifyChanges({ forceAll: true }));
}

function printOutputs(outputs) {
  const values = {
    force_all: outputs.forceAll,
    affected_packages: outputs.affectedPackages,
    cargo_fmt: outputs.cargoFmt,
    rust_checks: outputs.rustChecks,
    helper_codegen: outputs.helperCodegen,
    cargo_deny: outputs.cargoDeny,
    test_wasm: outputs.testWasm,
    wasm_packages: outputs.wasmPackages,
    node_test: outputs.nodeTest,
    react_compiler_test: outputs.reactCompilerTest,
    integration_test: outputs.integrationTest,
    full_cargo_test_matrix: outputs.fullCargoTestMatrix,
  };

  for (const [name, value] of Object.entries(values)) {
    console.log(`${name}=${formatOutput(value)}`);
  }
}

function formatOutput(value) {
  return Array.isArray(value) ? JSON.stringify(value) : String(value);
}
