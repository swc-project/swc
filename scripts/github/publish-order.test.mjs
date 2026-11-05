import assert from "node:assert/strict";
import test from "node:test";

import { analyzePublishOrder } from "./publish-order.mjs";

function workspacePackage(name, { publish = null, dependencies = [] } = {}) {
  return {
    id: `${name} 0.0.0`,
    name,
    manifest_path: `/repo/crates/${name}/Cargo.toml`,
    publish,
    dependencies,
  };
}

function pathDependency(name, kind = null) {
  return { name, path: `/repo/crates/${name}`, kind };
}

function metadata(packages) {
  return {
    workspace_root: "/repo",
    workspace_members: packages.map((pkg) => pkg.id),
    packages,
  };
}

test("orders dependencies before dependents", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("app", {
        dependencies: [pathDependency("core")],
      }),
      workspacePackage("core"),
    ])
  );

  assert.equal(result.packageCount, 2);
  assert.deepEqual(result.order, ["core", "app"]);
  assert.deepEqual(result.cycles, []);
});

test("detects a cycle through a dev dependency", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("swc_ecma_transforms_compat", {
        dependencies: [pathDependency("swc_ecma_preset_env", "dev")],
      }),
      workspacePackage("swc_ecma_preset_env", {
        dependencies: [pathDependency("swc_ecma_transforms")],
      }),
      workspacePackage("swc_ecma_transforms", {
        dependencies: [pathDependency("swc_ecma_transforms_compat")],
      }),
    ])
  );

  assert.equal(result.cycles.length, 1);
  assert.deepEqual(result.cycles[0].packages, [
    "swc_ecma_preset_env",
    "swc_ecma_transforms",
    "swc_ecma_transforms_compat",
  ]);

  const devEdge = result.cycles[0].edges.find(
    (edge) =>
      edge.from === "swc_ecma_transforms_compat" &&
      edge.to === "swc_ecma_preset_env"
  );
  assert.deepEqual(devEdge.kinds, ["dev"]);
});

test("ignores non-publishable packages", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("app", {
        dependencies: [pathDependency("test-support")],
      }),
      workspacePackage("test-support", {
        publish: [],
        dependencies: [pathDependency("app")],
      }),
    ])
  );

  assert.equal(result.packageCount, 1);
  assert.deepEqual(result.cycles, []);
});

test("resolves relative path dependencies", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("app", {
        dependencies: [
          { name: "core", path: "crates/core", kind: null },
        ],
      }),
      workspacePackage("core"),
    ])
  );

  assert.equal(result.packageCount, 2);
  assert.deepEqual(result.order, ["core", "app"]);
  assert.deepEqual(result.cycles, []);
});

test("ignores registry and out-of-workspace dependencies", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("app", {
        dependencies: [
          { name: "serde", kind: null },
          { name: "external", path: "/vendor/external", kind: null },
        ],
      }),
    ])
  );

  assert.equal(result.packageCount, 1);
  assert.deepEqual(result.cycles, []);
});

test("reports every package in a cycle", () => {
  const result = analyzePublishOrder(
    metadata([
      workspacePackage("a", { dependencies: [pathDependency("b")] }),
      workspacePackage("b", { dependencies: [pathDependency("a")] }),
      workspacePackage("c", { dependencies: [pathDependency("a")] }),
    ])
  );

  assert.deepEqual(
    result.cycles.map((cycle) => cycle.packages),
    [["a", "b"]]
  );
});
