---
swc_core: patch
swc_ecma_transforms_base: patch
---

fix(es/fixer): Preserve TypeScript cast and const assertion grouping in conditional tests and binary, prefix, or update operands. Keep instantiation expressions grouped before binary and compound assignment operators.

Preserve `await` and type assertion grouping on the left of exponentiation.
