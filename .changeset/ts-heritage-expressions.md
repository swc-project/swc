---
swc_core: patch
swc_ecma_parser: patch
---

fix(es/parser): Parse full left-hand-side expressions in `interface extends` and `class implements` clauses for error recovery, and consistently report `TS2499` for non-entity heritage expressions.
