---
swc_core: patch
swc_ecma_transforms_base: patch
---

fix(es/fixer): Avoid panicking on parser-recovered parenthesized assignment targets whose inner expressions cannot be converted to `AssignTarget`.
