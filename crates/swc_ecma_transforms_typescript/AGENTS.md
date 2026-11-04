### Fixture Test Addition Guide

- For every behavior that can be expressed by this crate's preset runner,
  add a preset fixture, including when the behavior also has a composite or
  specialized test. Keep those tests when they cover additional execution
  semantics or assertions.
- Preferred fixture roots in this crate: tests/preset, tests/composite, ../swc_ecma_parser/tests/tsc, ../swc_ecma_parser/tests/typescript.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_typescript.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_typescript.

### Preset fixtures

- `tests/preset` fixtures run through `tests/preset.rs` with TypeScript
  transform options under `jsc.transform` in `.swcrc`-shaped `options.json`
  files. Fields specific to the TypeScript test runner are supported there as
  well. Nested options inherit from parent directories up to `tests/preset`.
  The runner also supports `jsc.transform.useDefineForClassFields` and the
  `setPublicClassFields` and `pureGetters` assumptions for class field semantics.
  `env` and `jsc.target` use the actual preset-env implementation. TSX and
  decorator fixtures use the corresponding SWC transforms.
- Place fixtures needing transforms or parser settings not supported by the
  preset, or runtime assertions, under `tests/composite` and run them through
  `tests/composite.rs`.
  Keep semantic and parser correctness assertions in their dedicated modules.
