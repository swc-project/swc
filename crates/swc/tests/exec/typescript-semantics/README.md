# TypeScript execution semantics

These fixtures cover TypeScript namespace and enum lowering followed by the
minifier. Each `.swcrc` enables compression and mangling, including top-level
optimization. Assertions in `exec.ts` check the resulting runtime behavior.

The shared `tests/exec.rs` runner executes both the configuration matrix and the
complete file configuration, preserving the original minified execution checks.

This coverage lives in `swc` because adding a `swc_ecma_minifier` dev-dependency
to `swc_ecma_transforms_typescript` creates a dependency cycle through
`swc_ecma_transforms_optimization` and prevents crate publishing.
