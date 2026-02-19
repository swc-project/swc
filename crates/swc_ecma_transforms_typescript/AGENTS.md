### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, ../swc_ecma_parser/tests/tsc, ../swc_ecma_parser/tests/typescript.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_typescript.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_typescript.
