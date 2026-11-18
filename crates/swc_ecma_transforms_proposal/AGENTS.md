### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/decorators, tests/explicit-resource-management.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_proposal.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_proposal.
