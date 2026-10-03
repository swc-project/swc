---
swc_core: patch
swc_ecma_compat_es2015: patch
---

perf(es/compat): Skip block-scoping renaming when no identifiers conflict

Avoid a redundant AST traversal after block-scoping analysis produces an empty rename map.
