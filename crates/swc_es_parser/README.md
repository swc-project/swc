# swc_es_parser

`swc_es_parser` is an ECMAScript parser that builds arena-backed nodes from `swc_es_ast`.

## Goals

- Parse source directly into `swc_es_ast` handles.
- Expose a small parser API (`Lexer`, `Parser`, `parse_file_as_*`).
- Keep parser errors in a crate-local error model while integrating with `swc_common` diagnostics.
- Keep runtime dependency graph independent from `swc_ecma_parser`.

## Current Status

- Script/module/program entry points are available.
- Core statements, expressions, module declarations, JSX, and TypeScript constructs are parsed.
- Parity pass/fail behavior is continuously validated against reused `swc_ecma_parser` fixture corpora.
- Syntax options wired in parser logic include:
  - `EsSyntax`: `decorators_before_export`, `export_default_from`, `allow_super_outside_method`.
  - `TsSyntax`: `dts`, `disallow_ambiguous_jsx_like`.

## Parity Harness

- `swc_ecma_parser` inputs are reused from `crates/swc_ecma_parser/tests`.
- Fixture reuse is test-only; importing `swc_ecma_parser` crate at runtime is disallowed and enforced by tests.
- Run parity checks with:

```bash
cargo test -p swc_es_parser --test parity_suite
```

## API Sketch

```rust
use swc_common::{input::StringInput, FileName, SourceMap};
use swc_es_parser::{lexer::Lexer, Parser, Syntax};

let cm = SourceMap::default();
let fm = cm.new_source_file(FileName::Custom("a.js".into()).into(), "let a = 1;");
let lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);
let mut parser = Parser::new_from(lexer);
let parsed = parser.parse_program().unwrap();
```
