### Fixture Test Addition Guide

- See `tests/README.md` for the preset and composite fixture workflows.
- Add tests that use the compat preset under `tests/preset/<behavior>/`.
- Keep tests requiring a custom pipeline or runtime assertions under `tests/composite/`.
- Update generated fixture outputs with: `UPDATE=1 cargo test -p swc_ecma_transforms_compat`.
- Verify without UPDATE before finishing: `cargo test -p swc_ecma_transforms_compat`.
