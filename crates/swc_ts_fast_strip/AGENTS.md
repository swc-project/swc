### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/errors, ../swc_ecma_parser/tests/tsc.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ts_fast_strip.
- Verify without UPDATE before finishing: cargo test -p swc_ts_fast_strip.
