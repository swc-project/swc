# Test Design

Prefer fixtures in an existing suite. If `.swcrc` and snapshots or runtime
assertions can express a case, use the shared compiler pipeline; extend the
runner instead of adding a feature-specific harness or custom pass.

| Suite                  | Fixture location                                            | Purpose                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `compile.rs`           | `tests/compile/<feature>/`                                  | `input/` + full `.swcrc` → snapshots of code, maps, declarations, extra outputs, or diagnostics. Includes env, configuration, project, cache, and exclusion regressions. |
| `exec.rs`              | `tests/exec/<feature>/`; existing `tests/babel-exec/`       | Compile and execute `exec.js`, `exec.mjs`, or `exec.ts`; check runtime assertions and reference stdout. Includes TypeScript semantics and shared native-async fixtures.  |
| `source_map.rs`        | `tests/srcmap/`; stack traces in `tests/srcmap/stacktrace/` | Source-map behavior requiring token, scope, filename, cross-compilation, or Node stack-trace assertions. Ordinary map snapshots belong in `compile`.                     |
| `minify.rs`            | `tests/minify/`                                             | Minifier API behavior, such as extracted comments: `input.js` + `config.json` → code/map/comment snapshots. Compiler minification belongs in `compile` or `exec`.        |
| `compat_lowering.rs`   | `tests/compat-lowering/`                                    | Direct compat preset transform API snapshots that cannot use the compiler pipeline because they assert helper-free output.                                             |
| `panic.rs`             | Rust tests                                                  | Custom-pass traversal, pass ordering, and expected panic propagation.                                                                                                    |
| `flow.rs`              | Parser Flow/Hermes corpora; `tests/flow-projects/`          | Flow stripping and reparsing, corpus validation, and specialized Flow checks. Ordinary Flow snapshots or execution cases use `compile` or `exec`.                        |
| `tsc.rs`               | Parser TSC corpus → `tests/tsc-references/`                 | Upstream TypeScript cases with directive-driven matrices and virtual files. Local regressions generally use `compile` or `exec`.                                         |
| `serde.rs`             | `tests/serde/`                                              | AST serialization/deserialization round trips.                                                                                                                           |
| `preserve_symlinks.rs` | Temporary filesystem fixtures                               | Symlink resolution requiring actual filesystem setup.                                                                                                                    |

-   Group fixtures by functionality. Use `compile/regressions/` for issues without
    a single feature and `compile/integration/` for shared project configurations.
-   Keep compiler options in `.swcrc`. In execution tests, `exec.json` only selects
    matrix targets or reference-compilation overrides. Preserve full configuration
    files; resolve matrix/configuration precedence in the shared runner.
-   Keep related cache/order checks in one sequential fixture. During migration,
    verify case counts, inputs, generated code, and observable results; preserve
    assertions and document necessary path or behavior changes.
-   Keep Rust assertions only when fixtures cannot express the behavior; place
    them in the closest dedicated suite. Keep cross-crate coverage here when a
    lower-level crate would otherwise acquire a cyclic dependency.

Snapshot conventions, empty outputs/exclusions, diagnostics, and `.raw` files:
[compile guide](tests/compile/README.md). Execution matrices and reference rules:
[exec guide](tests/exec/README.md).

Update intended snapshots with `UPDATE=1 cargo test -p swc --test <suite> <filter>`,
then rerun without `UPDATE`. Run `cargo test -p swc` before finishing; enable the
relevant features when changing feature-gated coverage.
