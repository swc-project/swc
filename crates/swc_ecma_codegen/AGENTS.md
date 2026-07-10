### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/str-lits. The legacy test262-parser corpus is frozen; use `cargo test262` for new conformance coverage.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_codegen.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_codegen.
