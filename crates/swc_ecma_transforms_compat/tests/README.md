# Compat tests

`preset.rs` runs the SWC compat preset after the resolver. Its fixtures live in
`preset/<behavior>/`, with `input.js` and `output.js`. `options.json` uses the
full `.swcrc` structure. The runner reads `jsc.parser`, `jsc.target`,
`jsc.assumptions`, `jsc.loose`, `isModule` (boolean), and `env.targets`,
`env.include`, `env.exclude`, and `env.loose`. The parser subset supports
`syntax`, `jsx` or `tsx`, and `decorators`. The ES3 target and env features not
listed in `preset.rs` are rejected. `env` and `jsc.target` are mutually
exclusive. Unspecified settings use SWC defaults. The parser setting selects
syntax; this runner does not strip TypeScript.

Options are inherited by top-level key from the nearest `options.json`, stopping
at `tests/preset`; nested objects are not merged. Other configuration fields
are ignored. The hidden fixture directories preserve tests that were ignored
before the migration. Some of these tests have no expected output, as before.

`composite.rs` includes the modules in `composite/` for tests requiring a
specific pass order, custom AST handling, runtime assertions, or a flow that the
preset cannot express. Output fixtures are grouped by behavior and pipeline in
`composite/<behavior>/<pipeline>/<case>/`; each pipeline directory has an
`options.json` selecting a named pipeline, and each case contains `input.js` and
its original `output.js`. Hidden case directories preserve ignored tests; those
that had no expected output still have none. The same runtime input can be used
by multiple pipelines.

Run `cargo test -p swc_ecma_transforms_compat` without `UPDATE` to verify
existing outputs. Use `UPDATE=1` only when an expected output change is
intentional, review its diff, and rerun without `UPDATE`.
