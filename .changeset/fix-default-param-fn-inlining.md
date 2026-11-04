---
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Do not inline a single-use function into a default parameter initializer of an IIFE, which recreated the function on every call.
