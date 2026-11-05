# Compat transform tests

Compiler end-to-end snapshots configured with `.swcrc` live in
`../../swc/tests/compile/compat/` and run through `swc`'s shared `compile.rs`.
New cases combining passes also belong there whenever compiler configuration
can express their assertions.

The remaining tests exercise the transform API directly:

- `es20xx_<feature>.rs` groups standalone pass, pass-order, custom AST, and runtime
  checks by feature. Fixtures live directly under `tests/<behavior>/`. Named
  pipeline groups use an `options.json` read by `common::case_pipeline`; this
  selection does not inherit. Broader fixture globs exclude named groups so each
  intended snapshot runs once. Keep runtime inputs used by multiple runners.
- Helper-free compat preset snapshots use `../../swc/tests/compat_lowering.rs`.
  They need `swc_ecma_preset_env`, which already depends on this crate, so they
  stay in `swc` to avoid a publish dependency cycle. Fixtures in
  `../../swc/tests/compat-lowering/<behavior>/` use `input.js`, `output.js`, and
  `.swcrc`-shaped `options.json`. The runner consumes its documented parser,
  target, assumptions, and env subset, without injecting helpers or stripping
  TypeScript.

Preserve snapshot text and every assertion when moving fixtures. Some snapshots
need no helper, while others intentionally assert helper references without
injection; the latter are not equivalent to the compiler's external or inline
helpers. Custom hygiene/cooked-string operations and multiple-output mode checks
also remain transform API tests. Hidden directories retain ignored cases,
including cases without an expected output.

Run `cargo test -p swc_ecma_transforms_compat` without `UPDATE` to verify existing
outputs. Use `UPDATE=1` only for intentional snapshot changes, review the diff,
and rerun without `UPDATE`. Enable `es3` when checking its gated coverage.
