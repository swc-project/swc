---
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Drop unused classes that mutate their own properties, and keep class side effects valid when they are moved out of the class.
