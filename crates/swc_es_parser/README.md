# swc_es_parser

`swc_es_parser` is a high-throughput ECMAScript parser that builds arena-backed nodes from `swc_es_ast`.

## Goals

- Parse source directly into `swc_es_ast` handles.
- Expose a small parser API (`Lexer`, `Parser`, `parse_file_as_*`).
- Match `swc_ecma_parser` fixture success/failure outcomes for the shared test corpus.
- Keep parser errors in a crate-local error model while integrating with `swc_common` diagnostics.

## Current Status

- Script/module/program entry points are available.
- The parser has a parity mode for the shared fixture corpus.
- Full-suite pass/fail parity is asserted by an integration suite.
- Existing parser API and direct `Parser` entrypoints remain available.

## Parity Harness

- `swc_ecma_parser` inputs are reused from `crates/swc_ecma_parser/tests`.
- Run the parity contract suite with:

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
