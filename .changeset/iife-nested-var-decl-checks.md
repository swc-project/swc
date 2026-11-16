---
swc_core: patch
swc_ecma_minifier: patch
---

refactor(es/minifier): Check declarations nested in `try`, loop, labeled, and `with` statements of an IIFE body in `can_inline_fn_stmt` instead of a separate visitor.
