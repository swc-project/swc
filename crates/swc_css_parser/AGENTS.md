### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/line-comment, tests/recovery, tests/recovery-cssmodules.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_css_parser.
- Verify without UPDATE before finishing: cargo test -p swc_css_parser.
