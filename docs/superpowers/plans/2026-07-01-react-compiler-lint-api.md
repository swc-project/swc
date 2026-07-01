# React Compiler Lint API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current approach (attaching React Compiler lint diagnostics to `@swc/core`'s generic `transform`/`transformSync` error) with a dedicated `lint`/`lintSync` API in the already-scaffolded `@swc/react-compiler` package, per the design agreed with @kdy1 and @magic-akari on PR #11965.

**Architecture:** `swc_ecma_react_compiler::lint_source` (currently a test-only helper) becomes the crate's public "lint raw source text" entry point. The `binding_react_compiler_node` napi crate (already published as `@swc/react-compiler`, currently only exposing `isReactCompilerRequired`) gains a `lint`/`lintSync` pair that calls `lint_source` and converts its output into a napi-friendly `Diagnostic` object. The TS wrapper in `packages/react-compiler/src/index.ts` exposes `lint`/`lintSync`. Everything previously added to `@swc/core`'s transform-error path for this purpose (in `crates/swc/src/config/mod.rs`, `crates/swc/src/lib.rs`, `crates/swc_compiler_base/src/lib.rs`, `bindings/binding_core_node/src/transform.rs`, `packages/types/index.ts`) is reverted back to `main`, since it's superseded by the new dedicated API.

**Tech Stack:** Rust (napi-rs 3.x, serde), TypeScript, Node's built-in `node:test` runner.

## Global Constraints

- Do not use `--no-verify` on commits.
- Prefer fixture tests over inline `#[test]`s where a fixture harness already exists for the crate; `swc_ecma_react_compiler` has no fixture harness for `lint_source`, so inline tests (matching its existing `tests/integration.rs` convention) are correct here.
- Run `cargo fmt --all` and `cargo clippy --all --all-targets -- -D warnings` before considering any task done, per this repo's `AGENTS.md`.
- `cargo test -p swc_ecma_react_compiler` and `cargo test -p binding_react_compiler_node` must pass after every task that touches those crates.
- Do not remove or modify the existing `compile_result_to_diagnostics` rule-id-mapping tests in `crates/swc_ecma_react_compiler/src/diagnostics.rs` — they are unrelated to this rework and must keep passing.

---

## File Structure

- **Revert** (back to `main`, no new code): `crates/swc/src/config/mod.rs`, `crates/swc/src/lib.rs`, `crates/swc/tests/simple.rs`, `crates/swc_compiler_base/src/lib.rs`, `packages/types/index.ts`.
- **Modify**: `crates/swc_ecma_react_compiler/src/lib.rs` — make `lint_source` public and always-compiled.
- **Create**: `bindings/binding_react_compiler_node/src/diagnostics.rs` — napi-facing `Diagnostic` struct + conversion from `swc_ecma_react_compiler::diagnostics::DiagnosticMessage`.
- **Create**: `bindings/binding_react_compiler_node/src/lint.rs` — `lint`/`lintSync` napi functions.
- **Modify**: `bindings/binding_react_compiler_node/src/lib.rs` — register the two new modules.
- **Modify**: `packages/react-compiler/src/index.ts` — TS wrapper for `lint`/`lintSync`.
- **Regenerate**: `packages/react-compiler/src/binding.js`, `packages/react-compiler/src/binding.d.ts` (via `napi build`, not hand-edited).
- **Create**: `packages/react-compiler/tests/lint.test.cjs`.
- **Modify**: `packages/react-compiler/package.json` — point `"test"` at the new file.
- **Modify** (Task 7, added after initial review): `bindings/binding_react_compiler_node/src/lint.rs`, `bindings/binding_react_compiler_node/Cargo.toml`, `packages/react-compiler/src/index.ts` — add an optional parser-syntax parameter to `lint`/`lintSync`.

---

### Task 1: Revert the `@swc/core` transform-error bolt-on

**Files:**
- Revert: `crates/swc/src/config/mod.rs`
- Revert: `crates/swc/src/lib.rs`
- Revert: `crates/swc/tests/simple.rs`
- Revert: `crates/swc_compiler_base/src/lib.rs`
- Revert: `packages/types/index.ts`

**Interfaces:** None — this task only removes code. Nothing later depends on anything in these five files.

- [ ] **Step 1: Confirm each file's only diff vs. `main` is the react-compiler bolt-on**

Run: `git diff main...HEAD --stat -- crates/swc/src/config/mod.rs crates/swc/src/lib.rs crates/swc/tests/simple.rs crates/swc_compiler_base/src/lib.rs packages/types/index.ts`

Expected: the same 5 files as the full branch diff stat (no unrelated hunks). If any file has changes unrelated to React Compiler diagnostics, stop and hand-edit instead of reverting wholesale.

- [ ] **Step 2: Revert the five files to `main`**

```bash
git checkout main -- crates/swc/src/config/mod.rs crates/swc/src/lib.rs crates/swc/tests/simple.rs crates/swc_compiler_base/src/lib.rs packages/types/index.ts
```

- [ ] **Step 3: Verify the crate still builds**

Run: `cargo check -p swc -p swc_compiler_base --features swc/react-compiler`
Expected: builds cleanly (this only touches config/error plumbing, not the diagnostics-collection logic in `swc_ecma_react_compiler`, which Task 2 still needs).

- [ ] **Step 4: Commit**

```bash
git add crates/swc/src/config/mod.rs crates/swc/src/lib.rs crates/swc/tests/simple.rs crates/swc_compiler_base/src/lib.rs packages/types/index.ts
git commit -m "revert: drop @swc/core transform-error React Compiler diagnostics"
```

---

### Task 2: Make `lint_source` a public entry point in `swc_ecma_react_compiler`

**Files:**
- Modify: `crates/swc_ecma_react_compiler/src/lib.rs:182-235`
- Test: `crates/swc_ecma_react_compiler/src/tests/integration.rs` (existing tests exercise this function; no new file needed)

**Interfaces:**
- Produces: `pub fn lint_source(source_text: &str, syntax: swc_ecma_parser::Syntax, options: PluginOptions) -> LintResult` — the function `bindings/binding_react_compiler_node` (Task 4) will call.
- Consumes: nothing new; `PluginOptions`, `LintResult`, and `lint()` already exist in this file (lines 65-180) and are unchanged.

- [ ] **Step 1: Run the existing tests to confirm today's baseline passes**

Run: `cargo test -p swc_ecma_react_compiler lint_source`
Expected: `lint_simple_component_does_not_panic`, `lint_reports_ref_access_error_with_default_panic_threshold`, `lint_non_react_code_returns_empty` all PASS (they call the current test-only `lint_source`).

- [ ] **Step 2: Make `lint_source` public and remove its test gate**

In `crates/swc_ecma_react_compiler/src/lib.rs`, replace:

```rust
/// Convenience wrapper: parses source text, then lints.
#[cfg(test)]
pub(crate) fn lint_source(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
    options: PluginOptions,
) -> LintResult {
    match parse_source_for_tests(source_text, syntax) {
        Ok((program, comments, source_type)) => {
            lint(&program, source_type, source_text, Some(&comments), options)
        }
        Err(diagnostic) => LintResult {
            diagnostics: vec![*diagnostic],
        },
    }
}

#[cfg(test)]
fn parse_source_for_tests(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
) -> Result<(Program, SingleThreadedComments, SourceType), Box<DiagnosticMessage>> {
```

with:

```rust
/// Parses source text, then lints it. This is the entry point for callers
/// (e.g. the `@swc/react-compiler` napi binding) that have not already
/// parsed their source into a [`Program`].
pub fn lint_source(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
    options: PluginOptions,
) -> LintResult {
    match parse_source(source_text, syntax) {
        Ok((program, comments, source_type)) => {
            lint(&program, source_type, source_text, Some(&comments), options)
        }
        Err(diagnostic) => LintResult {
            diagnostics: vec![*diagnostic],
        },
    }
}

fn parse_source(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
) -> Result<(Program, SingleThreadedComments, SourceType), Box<DiagnosticMessage>> {
```

- [ ] **Step 3: Update `transform_source`'s call site to the renamed helper**

In the same file, in `transform_source` (a few lines above the code from Step 2), replace:

```rust
    match parse_source_for_tests(source_text, syntax) {
```

with:

```rust
    match parse_source(source_text, syntax) {
```

(This is the only other call site — confirm with `grep -n "parse_source_for_tests" crates/swc_ecma_react_compiler/src/lib.rs` returning no matches after the edit.)

- [ ] **Step 4: Run the tests again to confirm nothing broke**

Run: `cargo test -p swc_ecma_react_compiler`
Expected: all tests PASS, including the three from Step 1 (now calling the public function) and everything in `tests/integration.rs`.

- [ ] **Step 5: Run clippy**

Run: `cargo clippy -p swc_ecma_react_compiler --all-targets -- -D warnings`
Expected: no warnings. (`parse_source` and `lint_source` are both used — by each other and by `tests/integration.rs` — so no dead-code warnings.)

- [ ] **Step 6: Commit**

```bash
git add crates/swc_ecma_react_compiler/src/lib.rs
git commit -m "feat(swc_ecma_react_compiler): make lint_source a public API"
```

---

### Task 3: Add a napi-facing `Diagnostic` type to `binding_react_compiler_node`

**Files:**
- Create: `bindings/binding_react_compiler_node/src/diagnostics.rs`
- Modify: `bindings/binding_react_compiler_node/src/lib.rs:12` (add `mod diagnostics;`)

**Interfaces:**
- Consumes: `swc_ecma_react_compiler::diagnostics::{DiagnosticMessage, DiagnosticLocation, DiagnosticPosition, DiagnosticDetail, Severity}` (all already `pub`, unchanged by Task 2).
- Produces: `pub struct Diagnostic` with `impl From<&DiagnosticMessage> for Diagnostic` — Task 4's `lint`/`lintSync` will call `.into()` on each diagnostic.

- [ ] **Step 1: Create the diagnostics module**

Create `bindings/binding_react_compiler_node/src/diagnostics.rs`:

```rust
use swc_ecma_react_compiler::diagnostics::{
    DiagnosticDetail as CoreDiagnosticDetail, DiagnosticLocation as CoreDiagnosticLocation,
    DiagnosticMessage, DiagnosticPosition as CoreDiagnosticPosition, Severity,
};

// `#[napi]` resolves via the crate-wide `#[macro_use] extern crate napi_derive;`
// in `lib.rs` — matches the convention already used in `support.rs`.
#[napi(object)]
#[derive(Debug, Clone)]
pub struct Diagnostic {
    pub severity: String,
    pub message: String,
    #[napi(js_name = "ruleId")]
    pub rule_id: Option<String>,
    pub category: Option<String>,
    pub reason: Option<String>,
    pub description: Option<String>,
    pub loc: Option<DiagnosticLocation>,
    pub details: Vec<DiagnosticDetail>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticLocation {
    pub start: DiagnosticPosition,
    pub end: DiagnosticPosition,
    pub filename: Option<String>,
    #[napi(js_name = "identifierName")]
    pub identifier_name: Option<String>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticPosition {
    pub line: u32,
    pub column: u32,
    pub index: Option<u32>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticDetail {
    pub kind: String,
    pub loc: Option<DiagnosticLocation>,
    pub message: Option<String>,
}

impl From<&DiagnosticMessage> for Diagnostic {
    fn from(value: &DiagnosticMessage) -> Self {
        Self {
            severity: match value.severity {
                Severity::Error => "error".to_string(),
                Severity::Warning => "warning".to_string(),
            },
            message: value.message.clone(),
            rule_id: value.rule_id.clone(),
            category: value.category.clone(),
            reason: value.reason.clone(),
            description: value.description.clone(),
            loc: value.loc.as_ref().map(Into::into),
            details: value.details.iter().map(Into::into).collect(),
        }
    }
}

impl From<&CoreDiagnosticLocation> for DiagnosticLocation {
    fn from(value: &CoreDiagnosticLocation) -> Self {
        Self {
            start: (&value.start).into(),
            end: (&value.end).into(),
            filename: value.filename.clone(),
            identifier_name: value.identifier_name.clone(),
        }
    }
}

impl From<&CoreDiagnosticPosition> for DiagnosticPosition {
    fn from(value: &CoreDiagnosticPosition) -> Self {
        Self {
            line: value.line,
            column: value.column,
            index: value.index,
        }
    }
}

impl From<&CoreDiagnosticDetail> for DiagnosticDetail {
    fn from(value: &CoreDiagnosticDetail) -> Self {
        Self {
            kind: value.kind.clone(),
            loc: value.loc.as_ref().map(Into::into),
            message: value.message.clone(),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_react_compiler::diagnostics::{
        DiagnosticDetail as CoreDiagnosticDetail, DiagnosticLocation as CoreDiagnosticLocation,
        DiagnosticMessage, DiagnosticPosition as CoreDiagnosticPosition, Severity,
    };

    use super::Diagnostic;

    fn sample_message() -> DiagnosticMessage {
        DiagnosticMessage {
            severity: Severity::Error,
            message: "[ReactCompiler] Refs: invalid ref access".into(),
            span: Some((1, 2)),
            rule_id: Some("refs".into()),
            category: Some("Refs".into()),
            reason: Some("invalid ref access".into()),
            description: Some("description".into()),
            loc: Some(CoreDiagnosticLocation {
                start: CoreDiagnosticPosition {
                    line: 3,
                    column: 10,
                    index: Some(42),
                },
                end: CoreDiagnosticPosition {
                    line: 3,
                    column: 21,
                    index: Some(53),
                },
                filename: Some("input.tsx".into()),
                identifier_name: Some("value".into()),
            }),
            details: vec![CoreDiagnosticDetail {
                kind: "error".into(),
                loc: None,
                message: Some("detail".into()),
            }],
        }
    }

    #[test]
    fn converts_diagnostic_message_to_napi_shape() {
        let diagnostic: Diagnostic = (&sample_message()).into();

        assert_eq!(diagnostic.severity, "error");
        assert_eq!(diagnostic.message, "[ReactCompiler] Refs: invalid ref access");
        assert_eq!(diagnostic.rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostic.category.as_deref(), Some("Refs"));

        let loc = diagnostic.loc.expect("expected loc");
        assert_eq!(loc.start.line, 3);
        assert_eq!(loc.start.index, Some(42));
        assert_eq!(loc.identifier_name.as_deref(), Some("value"));

        assert_eq!(diagnostic.details.len(), 1);
        assert_eq!(diagnostic.details[0].kind, "error");
    }

    #[test]
    fn converts_warning_severity() {
        let mut message = sample_message();
        message.severity = Severity::Warning;

        let diagnostic: Diagnostic = (&message).into();

        assert_eq!(diagnostic.severity, "warning");
    }
}
```

- [ ] **Step 2: Register the module**

In `bindings/binding_react_compiler_node/src/lib.rs`, add `mod diagnostics;` next to the existing `mod support;`:

```rust
mod diagnostics;
mod support;
```

- [ ] **Step 3: Run the new tests**

Run: `cargo test -p binding_react_compiler_node`
Expected: `converts_diagnostic_message_to_napi_shape` and `converts_warning_severity` PASS.

- [ ] **Step 4: Run clippy**

Run: `cargo clippy -p binding_react_compiler_node --all-targets -- -D warnings`
Expected: no warnings.

- [ ] **Step 5: Commit**

```bash
git add bindings/binding_react_compiler_node/src/diagnostics.rs bindings/binding_react_compiler_node/src/lib.rs
git commit -m "feat(binding_react_compiler_node): add napi Diagnostic type"
```

---

### Task 4: Add `lint`/`lintSync` napi functions

**Files:**
- Create: `bindings/binding_react_compiler_node/src/lint.rs`
- Modify: `bindings/binding_react_compiler_node/src/lib.rs:12-13` (add `mod lint;`)

**Interfaces:**
- Consumes: `crate::diagnostics::Diagnostic` (Task 3), `swc_ecma_react_compiler::{lint_source, default_plugin_options}` (Task 2 and pre-existing).
- Produces: napi-exported `lint(code: Buffer, signal: Option<AbortSignal>) -> AsyncTask<LintTask>` and `lint_sync(code: Buffer) -> napi::Result<Vec<Diagnostic>>` — Task 5's TS wrapper calls these as `binding.lint`/`binding.lintSync`.

- [ ] **Step 1: Create the lint module**

Create `bindings/binding_react_compiler_node/src/lint.rs`:

```rust
use napi::bindgen_prelude::*;
use swc_ecma_parser::{Syntax, TsSyntax};

use crate::diagnostics::Diagnostic;

fn lint_inner(code: &str) -> Vec<Diagnostic> {
    let syntax = Syntax::Typescript(TsSyntax {
        decorators: true,
        tsx: true,
        ..Default::default()
    });

    let result = swc_ecma_react_compiler::lint_source(
        code,
        syntax,
        swc_ecma_react_compiler::default_plugin_options(),
    );

    result.diagnostics.iter().map(Into::into).collect()
}

struct LintTask {
    code: String,
}

#[napi]
impl Task for LintTask {
    type JsValue = Vec<Diagnostic>;
    type Output = Vec<Diagnostic>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(lint_inner(&self.code))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
fn lint(code: Buffer, signal: Option<AbortSignal>) -> AsyncTask<LintTask> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    AsyncTask::with_optional_signal(LintTask { code }, signal)
}

#[napi]
pub fn lint_sync(code: Buffer) -> napi::Result<Vec<Diagnostic>> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    Ok(lint_inner(&code))
}

#[cfg(test)]
mod tests {
    use super::lint_inner;

    #[test]
    fn reports_ref_access_error() {
        let source = r#"
            import { useRef } from 'react';

            function App() {
                const ref = useRef(1);
                return ref.current;
            }
        "#;

        let diagnostics = lint_inner(source);

        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].severity, "error");
        assert_eq!(diagnostics[0].rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostics[0].category.as_deref(), Some("Refs"));
    }

    #[test]
    fn returns_empty_for_non_react_code() {
        let diagnostics = lint_inner("const x = 1;");

        assert!(diagnostics.is_empty());
    }
}
```

- [ ] **Step 2: Register the module**

In `bindings/binding_react_compiler_node/src/lib.rs`:

```rust
mod diagnostics;
mod lint;
mod support;
```

- [ ] **Step 3: Run the new tests**

Run: `cargo test -p binding_react_compiler_node`
Expected: `reports_ref_access_error` and `returns_empty_for_non_react_code` PASS, alongside Task 3's tests.

- [ ] **Step 4: Run clippy**

Run: `cargo clippy -p binding_react_compiler_node --all-targets -- -D warnings`
Expected: no warnings.

- [ ] **Step 5: Commit**

```bash
git add bindings/binding_react_compiler_node/src/lint.rs bindings/binding_react_compiler_node/src/lib.rs
git commit -m "feat(binding_react_compiler_node): add lint/lintSync napi functions"
```

---

### Task 5: Wire up the TS wrapper and regenerate bindings

**Files:**
- Modify: `packages/react-compiler/src/index.ts`
- Regenerate: `packages/react-compiler/src/binding.js`, `packages/react-compiler/src/binding.d.ts`

**Interfaces:**
- Consumes: `binding.lint`, `binding.lintSync`, `binding.Diagnostic` (auto-generated by `napi build` from Task 4's `#[napi]` items).
- Produces: `export async function lint(code: Buffer): Promise<Diagnostic[]>`, `export function lintSync(code: Buffer): Diagnostic[]`, re-exported `Diagnostic`/`DiagnosticLocation`/`DiagnosticPosition`/`DiagnosticDetail` types — Task 6's test imports these from `../index.js`/`../index.d.ts`.

- [ ] **Step 1: Rebuild the native binding to regenerate `binding.js`/`binding.d.ts`**

Run: `pnpm --filter @swc/react-compiler build:dev`
Expected: succeeds; `packages/react-compiler/src/binding.d.ts` now additionally declares `export declare function lint(code: Buffer, signal?: AbortSignal | undefined | null): Promise<Array<Diagnostic>>`, `export declare function lintSync(code: Buffer): Array<Diagnostic>`, and the `Diagnostic`/`DiagnosticLocation`/`DiagnosticPosition`/`DiagnosticDetail` interfaces.

- [ ] **Step 2: Add the TS wrapper**

In `packages/react-compiler/src/index.ts`, replace the full file with:

```ts

import * as binding from './binding'

export type {
    Diagnostic,
    DiagnosticDetail,
    DiagnosticLocation,
    DiagnosticPosition,
} from './binding'

/**
 * TODO
 */
export async function isReactCompilerRequired(code: Buffer) {
    return await binding.isReactCompilerRequired(code)
}


/**
 * TODO
 */
export function isReactCompilerRequiredSync(code: Buffer): boolean {
    return binding.isReactCompilerRequiredSync(code)
}

/**
 * Lints `code` for React Compiler rule violations without compiling it.
 */
export async function lint(code: Buffer): Promise<binding.Diagnostic[]> {
    return await binding.lint(code)
}

/**
 * Synchronous variant of {@link lint}.
 */
export function lintSync(code: Buffer): binding.Diagnostic[] {
    return binding.lintSync(code)
}
```

- [ ] **Step 3: Type-check and build**

Run: `pnpm --filter @swc/react-compiler build:ts`
Expected: succeeds with no TypeScript errors; `packages/react-compiler/index.js` and `index.d.ts` are generated at the package root.

- [ ] **Step 4: Commit**

```bash
git add packages/react-compiler/src/index.ts packages/react-compiler/src/binding.js packages/react-compiler/src/binding.d.ts
git commit -m "feat(react-compiler): expose lint/lintSync from the TS wrapper"
```

---

### Task 6: Add a Node test for the new API

**Files:**
- Create: `packages/react-compiler/tests/lint.test.cjs`
- Modify: `packages/react-compiler/package.json:47` (the `"test"` script)

**Interfaces:**
- Consumes: `require("../index.js")` — the built output from Task 5, exposing `.lint` and `.lintSync`.

- [ ] **Step 1: Write the test file**

Create `packages/react-compiler/tests/lint.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const reactCompiler = require("../index.js");

const REF_ACCESS_SOURCE = `
import { useRef } from 'react';

function App() {
    const ref = useRef(1);
    return ref.current;
}
`;

test("lintSync reports a rule violation with rule metadata", () => {
    const diagnostics = reactCompiler.lintSync(Buffer.from(REF_ACCESS_SOURCE));

    assert.equal(diagnostics.length, 1);
    assert.equal(diagnostics[0].severity, "error");
    assert.equal(diagnostics[0].ruleId, "refs");
    assert.equal(diagnostics[0].category, "Refs");
});

test("lintSync returns no diagnostics for non-React code", () => {
    const diagnostics = reactCompiler.lintSync(Buffer.from("const x = 1;"));

    assert.deepEqual(diagnostics, []);
});

test("lint (async) matches lintSync", async () => {
    const syncResult = reactCompiler.lintSync(Buffer.from(REF_ACCESS_SOURCE));
    const asyncResult = await reactCompiler.lint(Buffer.from(REF_ACCESS_SOURCE));

    assert.deepEqual(asyncResult, syncResult);
});
```

- [ ] **Step 2: Point the package's test script at it**

In `packages/react-compiler/package.json`, replace:

```json
    "test": "cross-env NODE_OPTIONS='--experimental-vm-modules' echo 'no test'",
```

with:

```json
    "test": "node --test tests/lint.test.cjs",
```

- [ ] **Step 3: Run the test**

Run: `pnpm --filter @swc/react-compiler test`
Expected: all 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/react-compiler/tests/lint.test.cjs packages/react-compiler/package.json
git commit -m "test(react-compiler): add lint/lintSync coverage"
```

---

### Task 7: Add an optional parser-syntax parameter to `lint`/`lintSync`

**Context (added after Task 6, during initial maintainer-facing review):** `lint`/`lintSync` currently hardcode TSX+decorators parsing internally. A real downstream consumer (an internal ESLint rule prototype that calls this same lint pass via `@swc/core`'s `transformSync`) needs to control parser syntax per file (`.js` vs `.ts` vs `.tsx`, decorators on/off, etc.) — `@swc/core` already exposes this via `jsc.parser`, and `swc_ecma_react_compiler::lint_source` already accepts a `syntax: swc_ecma_parser::Syntax` parameter (nothing to change in that crate). The gap is entirely in the napi binding and TS wrapper, which never expose it.

**Files:**
- Modify: `bindings/binding_react_compiler_node/src/lint.rs` (full rewrite of its non-test content)
- Modify: `bindings/binding_react_compiler_node/Cargo.toml` (add `serde_json` dependency)
- Modify: `packages/react-compiler/src/index.ts` (add `syntax` parameter, reuse `@swc/types`'s existing `ParserConfig`)
- Regenerate: `packages/react-compiler/src/binding.js`, `packages/react-compiler/src/binding.d.ts` (via `napi build`)

**Interfaces:**
- Consumes: `swc_ecma_react_compiler::lint_source(code, syntax, options)` (unchanged, already takes `Syntax`); `swc_core::ecma::parser::{Syntax, TsSyntax}` (re-exported, already used); `@swc/types`'s existing `ParserConfig` export (`packages/types/index.ts:749`, a union of `TsParserConfig | EsParserConfig | FlowParserConfig` — already a dependency of `packages/react-compiler` per its `package.json`).
- Produces: `lint(code: Buffer, syntax?: ParserConfig): Promise<Diagnostic[]>`, `lintSync(code: Buffer, syntax?: ParserConfig): Diagnostic[]` — the public TS signature. When `syntax` is omitted, behavior is unchanged from Task 4/5/6 (TSX + decorators, matching `swc_ecma_parser::TsSyntax { decorators: true, tsx: true, ..Default::default() }`).

**Design:** The napi layer takes `syntax` as an `Option<Buffer>` (JSON-encoded), matching this codebase's established convention for passing config objects across the FFI boundary (see `bindings/binding_core_node/src/transform.rs`'s `opts: Buffer` pattern, deserialized via `get_deserialized`/`serde_json`). `swc_ecma_parser::Syntax` already derives `Serialize`/`Deserialize` with `#[serde(tag = "syntax")]` — exactly matching `@swc/types`'s `ParserConfig` shape (its discriminant field is also named `syntax`, with values `"ecmascript"`/`"typescript"`/`"flow"`). The hand-written TS wrapper does the `JSON.stringify`/`Buffer.from` encoding so callers get a typed `ParserConfig` object, not a raw `Buffer`.

- [ ] **Step 1: Add `serde_json` as a direct dependency**

In `bindings/binding_react_compiler_node/Cargo.toml`, add `serde_json` to `[dependencies]` (it's already a workspace dependency used elsewhere in this repo):

```toml
[dependencies]
backtrace     = { workspace = true }
napi          = { workspace = true, features = ["napi3", "serde-json"] }
napi-derive   = { workspace = true, features = ["type-def"] }
serde         = { workspace = true, features = ["derive"] }
serde_json    = { workspace = true }
tracing       = { workspace = true, features = ["release_max_level_info"] }
```

- [ ] **Step 2: Rewrite `lint.rs` to accept an optional syntax parameter**

Replace the full contents of `bindings/binding_react_compiler_node/src/lint.rs` with:

```rust
use napi::bindgen_prelude::*;
use swc_core::ecma::parser::Syntax;

use crate::diagnostics::Diagnostic;

/// Matches `swc_ecma_parser::Syntax`'s own `Default` impl (`Es(EsSyntax::default())`
/// — plain ECMAScript, no JSX/TSX/decorators) rather than any particular
/// consumer's build settings. This package is general-purpose; it must not
/// silently assume one caller's parser configuration for everyone else.
fn default_syntax() -> Syntax {
    Syntax::default()
}

/// Pure JSON decode, no napi types involved — this is the only part of
/// syntax parsing that unit tests may call directly. A `napi::Error` has a
/// non-trivial `Drop`/`ToNapiValue` impl that references live N-API C
/// functions (`napi_throw`, `napi_create_error`, ...), which only exist once
/// this cdylib is `dlopen`'d by a running Node process. If ANY function that
/// tests call constructs a `napi::Error` anywhere in its body — even in a
/// branch that specific test never executes — the whole function's compiled
/// object code references those unresolved symbols, and a standalone
/// `cargo test` binary (never loaded by Node) fails to link. Keep this
/// function's signature free of `napi::Error`/`napi::Result` so tests can
/// call it safely. Uses `std::result::Result` explicitly because
/// `napi::bindgen_prelude::*` (imported above) shadows the prelude's
/// `Result` with a `napi`-flavored alias.
fn decode_syntax(bytes: &[u8]) -> std::result::Result<Syntax, serde_json::Error> {
    serde_json::from_slice(bytes)
}

/// Thin napi-facing wrapper — not unit tested (see `decode_syntax`'s doc
/// comment), matching this crate's existing convention of only testing the
/// pure logic behind a `#[napi]` function, never the function itself (see
/// `support.rs`'s `is_react_compiler_required(_sync)`, which have no tests
/// at all).
fn parse_syntax_option(syntax: Option<Buffer>) -> napi::Result<Syntax> {
    match syntax {
        Some(buf) => decode_syntax(buf.as_ref()).map_err(|err| {
            napi::Error::new(
                napi::Status::InvalidArg,
                format!("invalid `syntax`: {err}"),
            )
        }),
        None => Ok(default_syntax()),
    }
}

fn lint_inner(code: &str, syntax: Syntax) -> Vec<Diagnostic> {
    let result = swc_ecma_react_compiler::lint_source(
        code,
        syntax,
        swc_ecma_react_compiler::default_plugin_options(),
    );

    result.diagnostics.iter().map(Into::into).collect()
}

struct LintTask {
    code: String,
    syntax: Syntax,
}

#[napi]
impl Task for LintTask {
    type JsValue = Vec<Diagnostic>;
    type Output = Vec<Diagnostic>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(lint_inner(&self.code, self.syntax))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
fn lint(
    code: Buffer,
    syntax: Option<Buffer>,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<LintTask>> {
    let syntax = parse_syntax_option(syntax)?;
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    Ok(AsyncTask::with_optional_signal(LintTask { code, syntax }, signal))
}

#[napi]
pub fn lint_sync(code: Buffer, syntax: Option<Buffer>) -> napi::Result<Vec<Diagnostic>> {
    let syntax = parse_syntax_option(syntax)?;
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    Ok(lint_inner(&code, syntax))
}

#[cfg(test)]
mod tests {
    use swc_core::ecma::parser::{EsSyntax, Syntax};

    use super::{decode_syntax, default_syntax, lint_inner};

    #[test]
    fn reports_ref_access_error_with_default_syntax() {
        let source = r#"
            import { useRef } from 'react';

            function App() {
                const ref = useRef(1);
                return ref.current;
            }
        "#;

        let diagnostics = lint_inner(source, default_syntax());

        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].severity, "error");
        assert_eq!(diagnostics[0].rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostics[0].category.as_deref(), Some("Refs"));
    }

    #[test]
    fn returns_empty_for_non_react_code() {
        let diagnostics = lint_inner("const x = 1;", default_syntax());

        assert!(diagnostics.is_empty());
    }

    #[test]
    fn decode_syntax_decodes_ecmascript_json() {
        let syntax = decode_syntax(br#"{"syntax":"ecmascript","jsx":true}"#)
            .expect("valid ecmascript syntax JSON should decode");

        assert_eq!(
            syntax,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            })
        );
    }

    #[test]
    fn decode_syntax_rejects_invalid_json() {
        let result = decode_syntax(b"not json");

        assert!(result.is_err());
    }
}
```

This is a full rewrite of the file's non-test content from Task 4 — `lint_inner` gains a `syntax: Syntax` parameter instead of hardcoding it internally, and both `lint`/`lint_sync` gain a `syntax: Option<Buffer>` parameter, decoded via the new `parse_syntax_option` helper before use. The 2 tests from Task 4 (`reports_ref_access_error`, `returns_empty_for_non_react_code`) are kept, calling `lint_inner` with `default_syntax()` explicitly, plus 2 new tests for `decode_syntax` — the pure JSON-decoding logic, deliberately kept free of `napi::Error` so it's linkable in a standalone `cargo test` binary (see `decode_syntax`'s doc comment for why `parse_syntax_option` itself, and the "defaults when omitted" behavior it wraps, is not unit tested — it's a thin, untested napi-facing wrapper, matching this crate's existing convention for `support.rs`'s `is_react_compiler_required(_sync)`).

- [ ] **Step 3: Run the updated tests**

Run: `cargo test -p binding_react_compiler_node`
Expected: 6 tests pass — the 2 from Task 3 (`diagnostics::tests::*`) plus this task's 4 in `lint::tests` (2 carried over from Task 4 — `reports_ref_access_error` renamed to `reports_ref_access_error_with_default_syntax`, `returns_empty_for_non_react_code` unchanged — plus 2 new `decode_syntax_*` tests). Task 4 left the suite at 4 total (2+2); this task brings it to 6.

- [ ] **Step 4: Run clippy**

Run: `cargo clippy -p binding_react_compiler_node --all-targets -- -D warnings`
Expected: no warnings.

- [ ] **Step 5: Regenerate the native binding**

Run from `packages/react-compiler/`:
```bash
pnpm exec napi build --platform --js ./src/binding.js --dts ./src/binding.d.ts --manifest-path ../../Cargo.toml -p binding_react_compiler_node --output-dir .
```
Expected: succeeds; `src/binding.d.ts`'s `lint`/`lintSync` declarations now include a `syntax?: Buffer | undefined | null` parameter between `code` and (for `lint`) `signal`.

**Known local-machine note:** if this build errors out at a `tsc` step first, that's this machine's pre-existing, unrelated `~/node_modules` ambient-type pollution (documented in Tasks 5/6's history) — not a repo bug, and not this task's job to fix. Run the `napi build` command directly (as above), which doesn't invoke `tsc` at all, to sidestep it. If you need to typecheck `index.ts` afterward, use `pnpm exec tsc -d --typeRoots ../../node_modules/@types` instead of the plain `build:ts` script, exactly as Tasks 5/6 did, and clean up any root-level `binding.js`/`binding.d.ts`/`index.js`/`index.d.ts`/`.tsbuildinfo` it produces before committing (this package only tracks `src/binding.d.ts`/`src/binding.js`, never the root copies — confirm via `git status --short`).

- [ ] **Step 6: Add the TS wrapper's `syntax` parameter**

In `packages/react-compiler/src/index.ts`, replace the full file with:

```ts

import type { ParserConfig } from '@swc/types'

import * as binding from './binding'

export type {
    Diagnostic,
    DiagnosticDetail,
    DiagnosticLocation,
    DiagnosticPosition,
} from './binding'

/**
 * TODO
 */
export async function isReactCompilerRequired(code: Buffer) {
    return await binding.isReactCompilerRequired(code)
}


/**
 * TODO
 */
export function isReactCompilerRequiredSync(code: Buffer): boolean {
    return binding.isReactCompilerRequiredSync(code)
}

function encodeSyntax(syntax?: ParserConfig): Buffer | undefined {
    return syntax === undefined ? undefined : Buffer.from(JSON.stringify(syntax))
}

/**
 * Lints `code` for React Compiler rule violations without compiling it.
 *
 * `syntax` defaults to plain ECMAScript (no JSX/TSX/decorators) when
 * omitted, matching `@swc/core`'s own default — pass an explicit `syntax`
 * for TypeScript, JSX, or decorator syntax.
 */
export async function lint(code: Buffer, syntax?: ParserConfig): Promise<binding.Diagnostic[]> {
    return await binding.lint(code, encodeSyntax(syntax))
}

/**
 * Synchronous variant of {@link lint}.
 */
export function lintSync(code: Buffer, syntax?: ParserConfig): binding.Diagnostic[] {
    return binding.lintSync(code, encodeSyntax(syntax))
}
```

- [ ] **Step 7: Type-check**

Run (from `packages/react-compiler/`): `pnpm exec tsc -d --typeRoots ../../node_modules/@types`
Expected: succeeds with no errors. Clean up any root-level `binding.js`/`binding.d.ts`/`index.js`/`index.d.ts`/`.tsbuildinfo` this produces (do not commit them).

- [ ] **Step 8: Update the Node test to cover the new parameter**

In `packages/react-compiler/tests/lint.test.cjs`, add one test after the existing 3, verifying `syntax` is honored (a plain `.js`-style `EsSyntax` with `jsx: true` should still detect the same violation, since `useRef`/`.current` access is valid in both ES+JSX and TSX):

```js
test("lintSync accepts an explicit ecmascript syntax", () => {
    const diagnostics = reactCompiler.lintSync(Buffer.from(REF_ACCESS_SOURCE), {
        syntax: "ecmascript",
        jsx: true,
    });

    assert.equal(diagnostics.length, 1);
    assert.equal(diagnostics[0].ruleId, "refs");
});
```

- [ ] **Step 9: Run the full test suite**

Run (from `packages/react-compiler/`, after Step 5's `napi build` and Step 7's `tsc` have produced a root-level `index.js`): `node --test tests/lint.test.cjs`
Expected: all 4 tests pass (3 from Task 6 + this task's new one).

- [ ] **Step 10: Commit**

```bash
git add bindings/binding_react_compiler_node/Cargo.toml bindings/binding_react_compiler_node/src/lint.rs packages/react-compiler/src/index.ts packages/react-compiler/src/binding.js packages/react-compiler/src/binding.d.ts packages/react-compiler/tests/lint.test.cjs
git commit -m "feat(react-compiler): allow lint/lintSync to accept a parser syntax option"
```

---

## Final Verification

- [ ] `cargo fmt --all`
- [ ] `cargo clippy --all --all-targets -- -D warnings`
- [ ] `cargo test -p swc_ecma_react_compiler`
- [ ] `cargo test -p binding_react_compiler_node`
- [ ] `cargo test -p swc` (confirms the Task 1 revert left `crates/swc` in a clean, passing state)
- [ ] `pnpm --filter @swc/react-compiler build:dev && pnpm --filter @swc/react-compiler test`
- [ ] `cargo check -p binding_core_node` (confirms the Task 1 revert didn't leave `@swc/core`'s napi binding referencing removed types)

## Resolved: parser syntax is configurable (Task 7), react-compiler's own options are not (by design)

Task 7 added a `syntax` parameter to `lint`/`lintSync` (parser-level config: `syntax`/`tsx`/`jsx`/`decorators`, matching `@swc/core`'s `jsc.parser` shape via `@swc/types`'s existing `ParserConfig`). Its default is `swc_ecma_parser::Syntax::default()` (plain ECMAScript — no JSX/TSX/decorators), matching `@swc/core`'s own project-wide convention, **not** any one downstream consumer's specific build settings (an earlier draft of this default accidentally matched one real consumer's exact webpack config verbatim — corrected after review).

Separately, react-compiler's own `PluginOptions` (`compilationMode`, `target`, `panicThreshold`, `gating`, `environment`, etc.) remain hardcoded via `default_plugin_options()` — investigated and deliberately left that way, not just deferred:
- `jsc.transform`'s other fields (`legacyDecorator`, `react.*`, `optimizer.*`, `useDefineForClassFields`, `decoratorVersion`) control code *emission*; `lint`/`lintSync` never emit code (`no_emit: true` internally), so none of them apply.
- `panicThreshold` specifically was checked against the upstream `forked_react_compiler` source (`entrypoint/program.rs`'s `handle_error`): raising it toward `"all_errors"` causes more errors to take the fatal `CompileResult::Error` path, and this crate's own `error_info_to_diagnostic` (`diagnostics.rs`) drops `rule_id`/`category`/`loc`/`details` entirely for that path, returning only a generic message. Exposing `panicThreshold` would let callers *degrade* the exact structured-diagnostic value this API exists to provide — our hardcoded `"none"` default is the right choice, not a gap.
- `compilationMode: "infer"` (default) cheaply skips files with no detected React-like functions before doing any real analysis — appropriate for a lint pass expected to run across a whole `.tsx?`/`.jsx?` glob, most of which won't be components.

No further options work is planned. Worth a one-line mention in the PR description that this was investigated, not just left as future work.

## Resolved: `code` is `string`, not `Buffer`

Tasks 4-7 gave `lint`/`lintSync` a `code: Buffer` parameter, following `is_react_compiler_required(_sync)`'s existing precedent in the same file. Checked against `@swc/core`'s own actual convention instead (`packages/core/src/index.ts:341` — `transformSync(src: string | Program, options?: Options)`): the source-code parameter is a plain `string` there; only the JSON-serialized `options` config gets `Buffer`-encoded internally (`toBuffer(newOptions)`). Our `syntax` parameter already matches that (`Buffer`-encoded JSON config) — `code` didn't, applying the "config" convention to the "source" parameter.

Fixed: `lint`/`lint_sync` (Rust, `bindings/binding_react_compiler_node/src/lint.rs`) and `lint`/`lintSync` (TS, `packages/react-compiler/src/index.ts`) now take `code: string`. This also removed the internal `String::from_utf8_lossy(code.as_ref()).into_owned()` conversion entirely (napi guarantees a JS-string-typed parameter is already valid UTF-8 on the Rust side), closing the lossy-decode Minor finding the whole-branch review raised. `is_react_compiler_required(_sync)` is unchanged (pre-existing, released API, out of scope for this PR).
