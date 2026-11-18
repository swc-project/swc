### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/nesting, tests/custom-media-query, tests/media-query-ranges, tests/color-hex-alpha, tests/color-legacy, tests/selector-not, tests/color-hwb, tests/all.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_css_compat.
- Verify without UPDATE before finishing: cargo test -p swc_css_compat.
