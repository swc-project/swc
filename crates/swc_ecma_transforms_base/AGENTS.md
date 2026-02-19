### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/resolver, tests/ts-resolver, ../swc_ecma_parser/tests.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_base.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_base.
