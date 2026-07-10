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

The reviewed runtime allowlist is canonicalized on Node.js major version 22,
matching the monitor workflow. Newer Node.js versions remain available for
filtered runtime debugging, but cannot verify or rewrite the complete
allowlist.

Runtime execution defaults to at most eight persistent Node workers, bounded
by the machine's available parallelism. `--jobs` explicitly overrides that
limit. Each worker shares individually compiled harness sources through a
bounded cache and is periodically recycled, so full-corpus runs do not retain
every context or harness combination for the lifetime of the command. Runtime
results use a hash-sharded content-addressed cache to keep full runs fast
without creating a single enormous directory.

A filtered run never reads or updates the complete-suite baseline. Baseline
updates require an explicit suite list:

```bash
cargo test262 run parser lexer --update
```

Reviewed failures and unsupported outcomes live in `baselines/` as short
summaries and stable fingerprints. Deterministic before/after output is part of
the fingerprint; machine-specific Node stack and console context is not. Full
diagnostics and the runtime cache live in `target/test262/`. Any new failure or
unsupported outcome, changed failure kind or fingerprint, or unexpected pass
fails an unfiltered run. JSON summaries are available with `--json`.

Setup refuses to reset a dirty fixture checkout unless `--force` is supplied.
A clean checkout at another revision is moved to the configured pin, including
under `--locked`; `--offline` requires the exact pin to already exist.

## Compatibility boundaries

The lexer suite targets the compact lexer in `swc_ecma_parser`, which is SWC's
maintained production implementation. The frozen `swc_ecma_lexer` compatibility
crate retains its own small regression tests and is deliberately not a Test262
target or dependency of this tool. With ESTree token oracles deferred, this
suite checks compact-token invariants such as parser-driven capture, span
ordering, line-break state, diagnostic bounds, and panic isolation; it is
not presented as a differential token oracle.

Source-map conformance checks map round-tripping, positions, and embedded source
content. The existing Terser token-mapping differential remains an independent
repository regression test, so non-runtime Test262 runs do not require Node.js
packages.

The frozen legacy corpus audit and deletion gates are tracked in
[MIGRATION.md](MIGRATION.md).
