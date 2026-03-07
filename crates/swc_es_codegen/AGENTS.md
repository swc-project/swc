### Fixture Test Addition Guide

- Preferred fixture roots in this crate: `tests/fixtures`, `tests/fixture`.
- Update generated fixture outputs with: `UPDATE=1 cargo test -p swc_es_codegen`.
- Verify without `UPDATE` before finishing: `cargo test -p swc_es_codegen`.

### Dependency Boundary

- Runtime dependencies in `[dependencies]` must not include any `swc_ecma_*` crate.
- `swc_ecma_*` usage is allowed only in non-runtime contexts such as tests and benches.
