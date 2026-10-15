---
swc_core: patch
swc_ecma_parser: patch
swc_ecma_transforms_base: patch
swc_ts_fast_strip: patch
---

fix(es/parser): Align TypeScript cast continuations with TS7 while preserving recovery ASTs, instantiation assignments, and type-query operator boundaries. Use parser diagnostics for assertion validation in both strip-only and transform modes.
