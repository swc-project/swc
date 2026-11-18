### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/const-modules, tests/dce, tests/dce-jsx, tests/expr-simplifier.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_optimization.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_optimization.
