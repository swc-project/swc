# SWC Test262 conformance runner

The runner uses a pinned, shallow clone of the official Test262 repository.
Fixtures are managed under `vendor/` and are never committed.

```bash
cargo test262 setup
cargo test262 run parser
cargo test262 run parser codegen --filter language/expressions/class --detail
cargo test262 runtime --filter language/modules --jobs 1
cargo test262 status
cargo test262 explain language/expressions/class/example.js
```

`cargo test262` runs the parser, compact lexer, codegen, source-map, transform,
and minifier suites. The runtime suite is separate and requires Node.js 22 or
newer. Suite dependencies are feature-gated; the lightweight CLI restarts
Cargo once with only the requested suite features.

A filtered run never reads or updates the complete-suite baseline. Baseline
updates require an explicit suite list:

```bash
cargo test262 run parser lexer --update
```

Reviewed failures live in `baselines/`; full diagnostics and the runtime cache
live in `target/test262/`. Any new failure, changed failure kind, or unexpected
pass fails an unfiltered run. JSON summaries are available with `--json`.

Setup refuses to reset a dirty fixture checkout unless `--force` is supplied.
`--offline` requires the exact pinned revision to already exist.

## Compatibility boundaries

The lexer suite targets the compact lexer in `swc_ecma_parser`, which is SWC's
maintained production implementation. The frozen `swc_ecma_lexer` compatibility
crate retains its own small regression tests and is deliberately not a Test262
target or dependency of this tool.

Source-map conformance checks map round-tripping, positions, and embedded source
content. The existing Terser token-mapping differential remains an independent
repository regression test, so non-runtime Test262 runs do not require Node.js
packages.
