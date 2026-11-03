### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/custom, ../swc_ecma_parser/tests/tsc, ../swc_ecma_parser/tests/typescript.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_typescript.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_typescript.

### Preset fixtures

- `tests/preset` fixtures run through `tests/preset.rs` with TypeScript
  transform options in `options.json`.
- Place fixtures needing other parser settings, transforms, or runtime
  assertions under `tests/custom` and run them through `tests/custom.rs`.
  Keep semantic and parser correctness assertions in their dedicated modules.
