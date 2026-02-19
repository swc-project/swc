### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/str-lits, ../swc_ecma_parser/tests/test262-parser/pass.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_codegen.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_codegen.
