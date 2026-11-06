---
swc_core: patch
swc_ecma_ast: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Preserve `this` of `(0, super.method)()` and inferred names of functions in sequences.
