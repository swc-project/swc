### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/document_fragment, tests/options, ../swc_html_parser/tests/fixture.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_html_codegen.
- Verify without UPDATE before finishing: cargo test -p swc_html_codegen.
