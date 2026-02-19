### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixtures, tests/flavor/acorn/fixtures.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_estree_compat.
- Verify without UPDATE before finishing: cargo test -p swc_estree_compat.
