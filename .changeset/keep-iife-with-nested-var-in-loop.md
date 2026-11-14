---
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Do not inline an IIFE in a loop when it declares a `var` nested in a statement such as `try`, `do-while`, `for`, `for-in`, `for-of` or a labeled statement, because every iteration would share the hoisted binding.
