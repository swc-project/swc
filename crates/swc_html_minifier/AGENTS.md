### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/document_fragment, tests/recovery.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_html_minifier.
- Verify without UPDATE before finishing: cargo test -p swc_html_minifier.
