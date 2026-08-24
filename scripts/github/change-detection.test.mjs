import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyChanges, isMainPush } from './change-detection.mjs';

test('a root Cargo.lock change runs Rust, binding, deny, and cargo tests', () => {
    const result = classifyChanges({ files: ['Cargo.lock'] });

    assert.equal(result.cargoDeny, true);
    assert.equal(result.rustChecks, true);
    assert.equal(result.testWasm, true);
    assert.equal(result.nodeTest, true);
    assert.equal(result.reactCompilerTest, true);
    assert.equal(result.integrationTest, true);
    assert.equal(result.fullCargoTestMatrix, true);
});

test('a nested fixture Cargo.lock does not run cargo-deny', () => {
    const result = classifyChanges({
        files: ['packages/core/e2e/fixtures/plugin_analyze/Cargo.lock'],
        packages: ['binding_core_node'],
    });

    assert.equal(result.cargoDeny, false);
    assert.equal(result.nodeTest, true);
});

test('a deny policy change only runs cargo-deny', () => {
    const result = classifyChanges({ files: ['deny.toml'] });

    assert.equal(result.cargoDeny, true);
    assert.equal(result.cargoFmt, false);
    assert.equal(result.rustChecks, false);
    assert.equal(result.testWasm, false);
    assert.equal(result.nodeTest, false);
    assert.equal(result.fullCargoTestMatrix, false);
});

test('a Rust change uses cargo-mono reverse dependents for related jobs', () => {
    const result = classifyChanges({
        files: ['crates/swc_ecma_parser/src/lib.rs'],
        packages: [
            'swc_ecma_parser',
            'binding_core_node',
            'binding_core_wasm',
        ],
    });

    assert.equal(result.cargoFmt, true);
    assert.equal(result.rustChecks, true);
    assert.equal(result.cargoDeny, false);
    assert.deepEqual(result.wasmPackages, ['binding_core_wasm']);
    assert.equal(result.nodeTest, true);
    assert.equal(result.reactCompilerTest, false);
});

test('helper sources only run helper codegen', () => {
    const result = classifyChanges({
        files: ['packages/helpers/esm/_define_property.js'],
    });

    assert.equal(result.helperCodegen, true);
    assert.equal(result.cargoFmt, false);
    assert.equal(result.rustChecks, false);
    assert.equal(result.nodeTest, false);
});

test('an individual wasm binding produces a focused matrix', () => {
    const result = classifyChanges({
        files: ['bindings/binding_typescript_wasm/src/lib.rs'],
        packages: ['binding_typescript_wasm'],
    });

    assert.deepEqual(result.wasmPackages, ['binding_typescript_wasm']);
    assert.equal(result.testWasm, true);
    assert.equal(result.nodeTest, false);
});

test('node and react compiler packages select their own binding jobs', () => {
    const nodeResult = classifyChanges({
        files: ['packages/core/index.ts'],
    });
    const reactResult = classifyChanges({
        files: ['packages/react-compiler/index.ts'],
    });

    assert.equal(nodeResult.nodeTest, true);
    assert.equal(nodeResult.integrationTest, true);
    assert.equal(nodeResult.reactCompilerTest, false);
    assert.equal(reactResult.reactCompilerTest, true);
    assert.equal(reactResult.nodeTest, false);
});

test('shared pnpm configuration runs all JavaScript and binding tests', () => {
    const result = classifyChanges({ files: ['pnpm-lock.yaml'] });

    assert.equal(result.testWasm, true);
    assert.equal(result.nodeTest, true);
    assert.equal(result.reactCompilerTest, true);
    assert.equal(result.integrationTest, true);
    assert.equal(result.fullCargoTestMatrix, true);
    assert.equal(result.cargoDeny, false);
});

test('documentation-only changes do not select expensive jobs', () => {
    const result = classifyChanges({ files: ['docs/usage.md'] });

    assert.deepEqual(result.affectedPackages, []);
    assert.equal(result.cargoFmt, false);
    assert.equal(result.rustChecks, false);
    assert.equal(result.helperCodegen, false);
    assert.equal(result.cargoDeny, false);
    assert.equal(result.testWasm, false);
    assert.equal(result.nodeTest, false);
    assert.equal(result.reactCompilerTest, false);
    assert.equal(result.integrationTest, false);
    assert.equal(result.fullCargoTestMatrix, false);
});

test('CI detection infrastructure changes force a complete run', () => {
    const result = classifyChanges({ files: ['.github/workflows/CI.yml'] });

    assert.equal(result.forceAll, true);
    assert.equal(result.cargoFmt, true);
    assert.equal(result.rustChecks, true);
    assert.equal(result.helperCodegen, true);
    assert.equal(result.cargoDeny, true);
    assert.equal(result.testWasm, true);
    assert.equal(result.nodeTest, true);
    assert.equal(result.reactCompilerTest, true);
    assert.equal(result.integrationTest, true);
    assert.equal(result.fullCargoTestMatrix, true);
});

test('detection failures force a complete run', () => {
    const result = classifyChanges({ forceAll: true });

    assert.equal(result.forceAll, true);
    assert.equal(result.fullCargoTestMatrix, true);
    assert.equal(result.cargoDeny, true);
});

test('only pushes to main force a complete event run', () => {
    assert.equal(isMainPush('push', 'refs/heads/main'), true);
    assert.equal(isMainPush('pull_request', 'refs/pull/1/merge'), false);
    assert.equal(isMainPush('merge_group', 'refs/heads/gh-readonly-queue/main'), false);
});
