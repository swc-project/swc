### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, ../swc_ecma_parser/tests/tsc, ../swc_ecma_parser/tests/typescript.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_typescript.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_typescript.

### Output fixtures

- Output comparisons live in `tests/output` and run through `tests/output.rs`.
  Each case has an `input.ts` or `input.tsx`, `output.js`, and `options.json`.
  Options describe parser settings, TypeScript configuration, and the original
  transform pipeline; preserve the pipeline and expected output when migrating.
- Existing `tests/fixture` inputs use the original class-field pipeline. Keep
  runtime, parser correctness, and AST-specific assertions in their respective
  test modules when output comparison cannot express their purpose.
