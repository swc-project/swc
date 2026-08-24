const WASM_PACKAGES = [
  "binding_core_wasm",
  "binding_minifier_wasm",
  "binding_typescript_wasm",
  "binding_nodejs_support_wasm",
  "binding_es_ast_viewer",
];

const DETECTION_INFRA_PATHS = new Set([
  ".github/workflows/CI.yml",
  "scripts/github/change-detection.mjs",
  "scripts/github/change-detection.test.mjs",
  "scripts/github/detect-changes.mjs",
]);

const CARGO_TEST_INFRA_PATHS = new Set([
  "scripts/github/get-test-matrix.mjs",
  "scripts/github/run-cargo-hack.sh",
  "scripts/github/test-concurrent.sh",
  "tests.yml",
]);

const NODE_SHARED_PATHS = new Set([
  ".mocha.setup.js",
  ".mocharc.js",
  ".node-version",
  ".npmrc",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
]);

const RUST_GLOBAL_PATHS = new Set([
  ".gitmodules",
  "Cargo.lock",
  "Cargo.toml",
  "rust-toolchain",
]);

const TYPES_PACKAGE_PREFIX = "packages/types/";

/**
 * Returns whether an event must run the complete CI suite.
 *
 * Pull requests and merge groups are intentionally selective. A push to the
 * default branch remains a complete verification run.
 */
export function isMainPush(eventName, gitRef) {
  return eventName === "push" && gitRef === "refs/heads/main";
}

/**
 * Classifies changed files and affected Cargo packages into CI job inputs.
 *
 * `packages` must contain cargo-mono's default reverse-dependency expansion,
 * not only the packages that directly own changed files.
 */
export function classifyChanges({
  files = [],
  packages = [],
  forceAll = false,
}) {
  const normalizedFiles = files.map(normalizePath);
  const affectedPackages = [...new Set(packages)].sort();
  const affectedPackageSet = new Set(affectedPackages);

  const detectionInfraChanged = normalizedFiles.some((file) =>
    DETECTION_INFRA_PATHS.has(file)
  );
  const runAll = forceAll || detectionInfraChanged;
  const rustGlobalChanged = normalizedFiles.some((file) =>
    RUST_GLOBAL_PATHS.has(file)
  );
  const cargoConfigChanged = normalizedFiles.some((file) =>
    file.startsWith(".cargo/")
  );
  const rustConfigChanged =
    cargoConfigChanged ||
    normalizedFiles.some(
      (file) => file === ".rustfmt.toml" || file === "clippy.toml"
    );
  const nodeSharedChanged = normalizedFiles.some(
    (file) =>
      NODE_SHARED_PATHS.has(file) ||
      file.startsWith(".github/actions/setup-node/")
  );
  const cargoTestInfraChanged = normalizedFiles.some(
    (file) =>
      CARGO_TEST_INFRA_PATHS.has(file) ||
      file.startsWith("scripts/cargo/") ||
      file.startsWith(".cargo/")
  );

  const cargoFmt =
    runAll ||
    normalizedFiles.some(
      (file) =>
        file.endsWith(".rs") ||
        file === ".rustfmt.toml" ||
        file === "rust-toolchain"
    );
  const rustChecks =
    runAll ||
    rustGlobalChanged ||
    rustConfigChanged ||
    affectedPackages.length > 0;
  const helperCodegen =
    runAll ||
    normalizedFiles.some(
      (file) =>
        file.startsWith("packages/helpers/esm/") ||
        file.startsWith("tools/generate-code/") ||
        file.startsWith(
          "crates/swc_ecma_transforms_base/src/helpers/generated/"
        )
    );
  const cargoDeny =
    runAll ||
    normalizedFiles.some(
      (file) => file === "Cargo.lock" || file === "deny.toml"
    );

  const allBindingsAffected =
    runAll || rustGlobalChanged || cargoConfigChanged || nodeSharedChanged;
  const typesPackageChanged = normalizedFiles.some((file) =>
    file.startsWith(TYPES_PACKAGE_PREFIX)
  );
  const wasmPackages = allBindingsAffected
    ? [...WASM_PACKAGES]
    : WASM_PACKAGES.filter((name) => affectedPackageSet.has(name));
  const nodeTest =
    allBindingsAffected ||
    affectedPackageSet.has("binding_core_node") ||
    typesPackageChanged ||
    normalizedFiles.some((file) => file.startsWith("packages/core/"));
  const reactCompilerTest =
    allBindingsAffected ||
    affectedPackageSet.has("binding_react_compiler_node") ||
    typesPackageChanged ||
    normalizedFiles.some((file) => file.startsWith("packages/react-compiler/"));
  const integrationTest =
    nodeTest ||
    affectedPackageSet.has("swc_node_bundler") ||
    normalizedFiles.some((file) =>
      file.startsWith("crates/swc_node_bundler/tests/integration/")
    );

  return {
    forceAll: runAll,
    affectedPackages,
    cargoFmt,
    rustChecks,
    helperCodegen,
    cargoDeny,
    testWasm: wasmPackages.length > 0,
    wasmPackages,
    nodeTest,
    reactCompilerTest,
    integrationTest,
    fullCargoTestMatrix:
      runAll || rustGlobalChanged || nodeSharedChanged || cargoTestInfraChanged,
  };
}

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}
