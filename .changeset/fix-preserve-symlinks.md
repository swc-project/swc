---
swc_ecma_transforms_module: patch
swc: patch
swc_core: patch
---

fix(transforms/module): replace `canonicalize()` with `path_clean` to avoid resolving symlinks during module resolution
