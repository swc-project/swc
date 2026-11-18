### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/with-compat.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_css_modules.
- Verify without UPDATE before finishing: cargo test -p swc_css_modules.
