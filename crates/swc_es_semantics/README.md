# swc_es_semantics

`swc_es_semantics` builds scope/binding/reference information and CFGs from `swc_es_ast`.

## Goals

- Single API: `analyze_program(&AstStore, ProgramId) -> Semantics`.
- Runtime dependency on `swc_ecma_*` crates is forbidden.
- High-performance data layout based on id-indexed vectors and sparse maps.

## Scope Policy (v1)

- Value-space scope analysis for JavaScript bindings.
- Block function declarations are treated as lexical (no Annex B behavior).
- Type-only TypeScript declarations are excluded from scope graph.
- Direct `eval` and `with` mark function scopes as dynamic; related references are flagged `maybe_dynamic`.

## CFG Policy (v1)

- Per-root CFG generation for:
  - Program
  - Function declaration
  - Function
  - Arrow expression
  - Class static block
- Statement-oriented blocks plus entry/exit/synthetic control blocks.
- Edge kinds: `Normal`, `True`, `False`, `Return`, `Throw`, `Break`, `Continue`.
- `try/finally` rewires normal and abrupt completions through finally blocks.
- Expression-internal short-circuit branching is intentionally not split.
