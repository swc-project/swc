# Compiler snapshot fixtures

Each fixture contains `input/` and `output/`. Inputs use the compiler's normal
`.swcrc` lookup and configuration selection. External helpers default to enabled;
set `jsc.externalHelpers` to false for inline helpers.

The runner compiles JavaScript and TypeScript files sequentially in filename
order, with a fresh compiler and source map for each input. Process-wide caches
remain shared. Keep related inputs of a cache regression in one fixture so its
configurations are exercised together.

Every input uses the same pipeline and snapshot conventions:

- `output/<relative input filename>`: emitted code.
- `output/<relative input filename>.stderr`: compiler diagnostics and errors.
- `output/<relative input filename>.map`: source map, formatted as JSON.
- `output/<relative input filename>.d.ts`: isolated declarations.
- `output/<relative input filename>.extra.json`: remaining compiler metadata.

Every output kind is compared, including when it is empty. Missing snapshots
represent empty output. Errors can coexist with emitted code; record both when
the compiler produces both. Exclusions and configuration errors use the same
`.stderr` snapshots as other compiler results. Parser mode, lints, source maps,
and other compiler settings belong in `.swcrc`.

Append `.raw` to a code snapshot filename when the final newline is part of the
assertion. Ordinary snapshots use the shared text comparison; raw snapshots also
preserve the presence or absence of the final newline.

Group fixtures by functionality. Use `regressions/` for issues without a single
feature and `integration/` for shared project configurations. Flow and React
Compiler fixtures require their corresponding Cargo features. Fixtures under
`options/react-compiler/feature-only` are registered only with `react-compiler`.

Use `exec.rs` for runtime assertions and the dedicated suites for specialized API
checks. Transform API cases requiring internal options, helper references without
injection, standalone passes, or custom AST operations stay in their transform
crate. Minifier comment extraction stays in `minify.rs`; compiler minification
belongs here or in `exec.rs`.

Update intentional snapshots with
`UPDATE=1 cargo test -p swc --test compile <filter>`, then rerun without `UPDATE`.
