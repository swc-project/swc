# Compiler snapshot fixtures

Each fixture has an `input` directory and an `output` directory. The compiler
discovers `.swcrc` files from each input file using the normal configuration
lookup, including configurations shared by parent directories. Fixtures without
a `.swcrc` use the compiler defaults.

The runner compiles JavaScript and TypeScript inputs and compares emitted code,
source maps, diagnostics, and additional outputs with the existing snapshots.
External helpers default to enabled for compatibility with the original fixture
suite; set `jsc.externalHelpers` in `.swcrc` to select inline helpers instead.
Excluded inputs still reach the compiler and are checked as producing no output.
Tests that need execution or specialized assertions belong in their respective
suites.

Inputs within a fixture are compiled sequentially in filename order, with a fresh
compiler and source map for each input. Process-wide caches remain shared. Keep
all inputs of a cache regression in one fixture, with per-directory `.swcrc`
files when configurations differ, so both cache entries are exercised together.

Fixtures under `options/react-compiler/feature-only` are registered only when
the `react-compiler` feature is enabled, preserving the original Rust tests'
feature conditions.

Missing snapshots represent empty output. To test exclusion, include the input
and configure its exclusion in `.swcrc`, without adding output snapshots for it.
If it unexpectedly emits nonempty code or a source map, ordinary snapshot
comparison fails. Unrelated compilation errors still fail the fixture.

A fixture with `output.swc-stderr` beside its `input` directory must fail to
compile. Its diagnostic is checked with filename-free, non-colored reporting,
while diagnostics stored beside an input retain filenames. Successful and
failing fixtures use the same compiler invocation and options. Parser mode and
lint settings belong in each fixture's `.swcrc`.
Configuration failures that occur before source diagnostics are emitted snapshot
the complete error chain instead.

Name an output snapshot `input.js.raw` (or the corresponding input filename
with `.raw` appended) when the final newline is part of the assertion. Unlike
ordinary snapshots, raw snapshots preserve the presence or absence of that
newline while still normalizing platform-specific paths and line endings.

Feature directories group fixtures by the configuration they exercise. Issue
regressions whose configuration does not identify a single feature remain in
`regressions`. Integration fixtures keep their shared parent configurations
together under `integration`.

The `minify/api` fixtures preserve snapshots originally produced by the minifier
API. Where that API emitted ES5 text without lowering newer syntax, their configs
use modern environment targets with the default print target to preserve both
behaviors. Tests that extract comments remain in the minifier API suite because
the compiler pipeline does not expose comment extraction through `.swcrc`.
