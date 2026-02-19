### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/jsx/fixture, tests/integration/fixture, tests/script/jsx/fixture.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_react.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_react.
