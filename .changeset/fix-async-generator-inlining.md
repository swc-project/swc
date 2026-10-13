---
swc: patch
swc_core: patch
swc_ecma_minifier: patch
swc_ecma_transforms_base: patch
---

fix(es/minifier): Correct async and generator function inlining, preserve generator prototype identity across repeated calls, and wrap function declarations in strict-mode control-flow bodies.
