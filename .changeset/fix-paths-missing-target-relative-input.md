---
swc_core: patch
swc_ecma_loader: patch
swc_ecma_transforms_module: patch
---

fix(es/module): Rewrite `jsc.paths` imports of missing files correctly when the input filename is relative and `jsc.preserveSymlinks` is enabled.
