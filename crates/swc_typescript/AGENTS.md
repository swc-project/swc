### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/**/*.ts, tests/**/*.tsx.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_typescript.
- Verify without UPDATE before finishing: cargo test -p swc_typescript.
