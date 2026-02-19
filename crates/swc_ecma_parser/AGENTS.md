### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/js, tests/jsx, tests/typescript, tests/typescript-errors, tests/errors, tests/comments, tests/span, tests/shifted.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_parser.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_parser.
