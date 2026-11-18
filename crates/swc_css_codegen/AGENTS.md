### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/options, ../swc_css_parser/tests/fixture.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_css_codegen.
- Verify without UPDATE before finishing: cargo test -p swc_css_codegen.
