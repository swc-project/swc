# Test Design

- Put end-to-end cases expressible with `.swcrc` in
  `../swc/tests/compile/typescript/<feature>/`: `input/` + full `.swcrc` →
  `output/`. Use the shared compiler runner, including for combinations of
  transforms. Runtime compiler cases belong in `../swc/tests/exec/`.
- Keep direct transform API coverage here only when the compiler configuration
  cannot preserve its assertions. `lowering.rs` covers helper-free lowering and
  internal TypeScript options; `tsx.rs` covers standalone TSX/JSX and decorator
  pipelines. Their `options.json` files select transform API settings, not a
  complete compiler configuration.
- `semantic.rs` checks resolver modes, enum/namespace binding identity, custom
  spans, and generated dependency graphs. Reuse the shared compiler fixture
  inputs and snapshots where these checks exercise the same source.
- `decorators.rs`, `strip.rs`, and `flow.rs` retain specialized decorator API and
  upstream corpus checks. Prefer extending existing fixtures over inline tests.
- Preserve inputs, snapshots, diagnostics, execution assertions, feature gates,
  and ignored status when moving coverage. Do not replace a specialized assertion
  with a code snapshot alone or add a dependency on `swc` to this crate.

Initialize submodules before testing. Update intentional snapshots with
`UPDATE=1 cargo test -p swc_ecma_transforms_typescript`, then rerun without
`UPDATE`. Also run `cargo test -p swc --test compile` when changing shared fixtures.
