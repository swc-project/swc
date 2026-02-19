### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, ../swc_ecma_parser/tests/tsc.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_plugin_backend_tests.
- Verify without UPDATE before finishing: cargo test -p swc_plugin_backend_tests.
