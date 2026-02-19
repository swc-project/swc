### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/rules/pass, tests/rules/fail.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_css_lints.
- Verify without UPDATE before finishing: cargo test -p swc_css_lints.
