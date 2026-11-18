#!/usr/bin/env zx
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { parse } from "yaml";

const NOOP_CRATE = "__noop__";

const scriptDir = __dirname;
const repoRootDir = path.resolve(scriptDir, "../../");
const testsYmlPath = path.resolve(repoRootDir, "tests.yml");
const testsYml = parse(await fs.readFile(testsYmlPath, "utf8"));
const affectedPackages = parseAffectedPackages(
  process.env.AFFECTED_PACKAGES ?? "[]"
);
const fullCargoTestMatrix = process.env.FULL_CARGO_TEST_MATRIX === "true";

process.stderr.write(`Script dir: ${scriptDir}\n`);
process.stderr.write(`Using tests.yml at ${testsYmlPath}\n`);
process.stderr.write(
  `Affected packages: ${affectedPackages.length}, full matrix: ${fullCargoTestMatrix}\n`
);

const allPackages = await getAllWorkspacePackageNames();
const allPackageSet = new Set(allPackages);
const allSettings = toMatrixSettings(allPackages, testsYml);

if (fullCargoTestMatrix) {
  process.stderr.write("Running the complete cargo-test matrix.\n");
  printSettings(allSettings);
  process.exit(0);
}

const affectedPackageSet = new Set(
  affectedPackages.filter((name) => allPackageSet.has(name))
);
const selectedPackages = allPackages.filter((name) =>
  affectedPackageSet.has(name)
);

if (selectedPackages.length > 0) {
  printSettings(toMatrixSettings(selectedPackages, testsYml));
  process.exit(0);
}

process.stderr.write("No affected crates; returning noop matrix entry.\n");
printSettings([{ crate: NOOP_CRATE, os: "ubuntu-latest" }]);

function parseAffectedPackages(rawValue) {
  const parsed = JSON.parse(rawValue);
  if (
    !Array.isArray(parsed) ||
    parsed.some((name) => typeof name !== "string")
  ) {
    throw new TypeError("AFFECTED_PACKAGES must be a JSON array of strings");
  }

  return parsed;
}

async function getAllWorkspacePackageNames() {
  const rawMetadata =
    await $`cargo metadata --format-version=1 --all-features --no-deps`;
  const metadata = JSON.parse(rawMetadata.stdout);
  return metadata.packages
    .map((pkg) => pkg.name)
    .filter((name) => name !== "xtask")
    .sort();
}

function toMatrixSettings(packages, config) {
  const windowsPackages = new Set(config.os?.windows ?? []);
  const macosPackages = new Set(config.os?.macos ?? []);
  const settings = [];

  for (const pkg of packages) {
    settings.push({ crate: pkg, os: "ubuntu-latest" });

    if (windowsPackages.has(pkg)) {
      settings.push({ crate: pkg, os: "windows-latest" });
    }

    if (macosPackages.has(pkg)) {
      settings.push({ crate: pkg, os: "macos-latest" });
    }
  }

  return settings;
}

function printSettings(settings) {
  console.log(JSON.stringify(settings));
}
