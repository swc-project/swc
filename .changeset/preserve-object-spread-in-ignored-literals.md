---
swc: patch
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Preserve object spreads when an object literal value is unused, so that getters called by the spread still run.
