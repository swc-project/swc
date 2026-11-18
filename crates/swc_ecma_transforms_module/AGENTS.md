### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/paths.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_module.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_module.
