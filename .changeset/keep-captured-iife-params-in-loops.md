---
swc: patch
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Do not inline an IIFE into a loop body when its parameter is captured by an arrow parameter default or a class field initializer, so that each iteration keeps its own binding.
