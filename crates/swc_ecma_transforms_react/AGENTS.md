# Test Design

- Put end-to-end cases expressible with `.swcrc` in
  `../swc/tests/compile/react/<feature>/`: `input/` + full `.swcrc` → `output/`.
  Use the shared compiler runner even when several transforms are combined.
  Runtime compiler cases belong in `../swc/tests/exec/`.
- Keep direct transform API assertions here when compiler configuration cannot
  express them. `source_locations.rs` retains React API snapshots with the
  virtual source filename used by the transform API.
- `jsx.rs`, `jsx_self.rs`, `jsx_transform.rs`, and `refresh.rs` cover standalone
  passes and specific pass orders. `script.rs` checks script printing, including
  the final semicolon; `jsx_source.rs` retains source-location execution checks.
  Keep fixtures beside their feature and read the matching runner before editing
  their `options.json` files.
- Prefer fixtures over inline tests. Preserve inputs, snapshots, diagnostics,
  runtime assertions, feature gates, and ignored status during migration. Do not
  weaken specialized assertions or introduce a dependency on `swc` here.

Initialize submodules before testing. Update intentional snapshots with
`UPDATE=1 cargo test -p swc_ecma_transforms_react`, then rerun without `UPDATE`.
Run relevant `es3` coverage when changing gated tests, and
`cargo test -p swc --test compile` when changing shared compiler fixtures.
