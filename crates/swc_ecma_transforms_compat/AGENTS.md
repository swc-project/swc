# Test Design

- Put end-to-end cases expressible with `.swcrc` in
  `../swc/tests/compile/compat/<feature>/`: `input/` + full `.swcrc` → `output/`.
  Combinations of transforms use the same compiler pipeline. Runtime compiler
  cases belong in `../swc/tests/exec/`.
- Keep direct transform API checks here when compiler configuration cannot
  preserve their assertions. `es20xx_<feature>.rs` covers standalone passes,
  specific pass orders, custom AST handling, and execution assertions. See
  `tests/README.md` and the matching runner for configuration and fixture
  conventions. Helper-free compat preset snapshots live in
  `../swc/tests/compat_lowering.rs`, because this crate must not depend on
  `swc_ecma_preset_env` in any dependency kind.
- Prefer fixtures over inline tests. Register each intended pipeline once;
  update broader globs' exclusions when adding a narrower runner. Preserve shared
  runtime fixtures exercised by multiple pipelines, hidden ignored cases, feature
  gates, diagnostics, and all existing assertions during migration.
- Do not add another local end-to-end compiler harness or a dependency on `swc`.

Initialize submodules before testing. Update intentional snapshots with
`UPDATE=1 cargo test -p swc_ecma_transforms_compat`, review the diff, then rerun
without `UPDATE`. Run relevant `es3` coverage when changing gated tests, and
`cargo test -p swc --test compile` when changing shared compiler fixtures.
