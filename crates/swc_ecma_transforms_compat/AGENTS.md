### Fixture Test Guide

- For every behavior that can be expressed by this crate's preset runner,
  add a preset fixture, including when the behavior also has a composite or
  specialized test. Keep those tests when they cover additional execution
  semantics or assertions.
- Read `tests/README.md` and the relevant runner before adding or moving tests.
  Preserve the existing behavior categories and verify the parser, pass order,
  configuration, assertions, feature conditions, and ignored status.
- Use `tests/preset/<behavior>/<case>/input.js` and `output.js` when the actual
  compat preset and the supported `.swcrc` subset reproduce the intended test
  pipeline. Check `tests/preset.rs` for supported fields and defaults. Its
  `options.json` inheritance stops at `tests/preset` and merges top-level keys
  only; a nearer nested object replaces the entire parent object.
- Use `tests/composite/<behavior>/<pipeline>/<case>/input.js` and `output.js`
  when the original pipeline cannot be represented by the preset. Select a
  named pipeline with `options.json` in the pipeline directory, and implement
  it in the corresponding module under `tests/composite/`. The composite runner
  reads that directory's options directly; it does not inherit parent options.
- Register each new composite pipeline directory with the relevant
  `#[testing::fixture]` runner. If an existing broader fixture glob also matches
  it, update that runner's `exclude` pattern so each intended test runs exactly
  once. Do not choose pipelines by matching individual test names.
- Keep runtime assertions and specialized AST, diagnostic, and execution
  checks in their appropriate runners. Preserve ignored tests using hidden
  fixture directories where the fixture harness is used, and retain all
  existing checks when fixtures are shared by multiple runners.
- Before running tests, initialize submodules with
  `git submodule update --init --recursive`. Verify existing outputs first with
  `cargo test -p swc_ecma_transforms_compat` without `UPDATE`. If expected
  outputs intentionally need regeneration, use
  `UPDATE=1 cargo test -p swc_ecma_transforms_compat`, review the changes, and
  rerun the same crate test without `UPDATE`.
