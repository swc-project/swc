---
swc: patch
swc_core: major
swc_ecma_parser: major
swc_ecma_quote_macros: major
---

refactor(es/parser): Isolate parser state and make grammar parameters explicit.

Separate lexical, grammar, boundary, statement, and type state; make grammar transitions explicit with `+ / ~ / ?` and isolate class-initializer grammar. Decouple type grammar from angle tokenization, unify parameter parsing and validation, and reduce speculation and identifier-scanning allocations.

Breaking Rust API changes (also through `swc_core::ecma::parser`):

- `Context` becomes lexical-only (`u32` → `u8`); replace `Context::CanBeModule` with `Parser::allow_module_syntax()`.
- Remove `Parser::{allow_in_expr, disallow_in_expr}` and `Buffer::merge_lt_gt`; use `Buffer::eat_type_gt` for type-closing angles (not a drop-in replacement).
- Custom `Tokens` implementations must provide `rescan_type_gt`.

AST definitions and serialization schemas are unchanged.
