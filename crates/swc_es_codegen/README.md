# swc_es_codegen

`swc_es_codegen` is a standalone code generator for `swc_es_ast`.

## Goals

- Emit JavaScript/TypeScript/JSX from arena-backed `swc_es_ast` nodes.
- Keep runtime and source-level independence from `swc_ecma_*` crates.
- Provide a fast canonical output mode with predictable formatting.

## API

```rust
use swc_es_codegen::emit_program;

let code = emit_program(&parsed.store, parsed.program)?;
```

The crate currently exposes one output format:

- `OutputFormat::Canonical`

## Output policy

- v1 only emits canonical code (no pretty/minify split).
- v1 does not emit source maps or preserve original token raw text.
- Output is regenerated from AST structure.

## Benchmarks

Run:

```bash
cargo bench -p swc_es_codegen
```

## Tests

Run:

```bash
cargo test -p swc_es_codegen
```
