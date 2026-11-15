---
swc: patch
swc_core: patch
swc_ecma_transforms: patch
swc_ecma_transforms_base: patch
---

fix(es/hygiene): Keep the own name of a named function or class expression when an unresolved global with the same name is used only outside the expression, so that `function Map() {}` is no longer renamed to `Map1` and its `name` property does not change.
