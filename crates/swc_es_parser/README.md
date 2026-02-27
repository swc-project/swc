# swc_es_parser

`swc_es_parser` is a bootstrap ECMAScript parser that builds arena-backed nodes from `swc_es_ast`.

## Goals

- Parse source directly into `swc_es_ast` handles.
- Expose a small parser API (`Lexer`, `Parser`, `parse_file_as_*`).
- Keep parser errors in a crate-local error model while integrating with `swc_common` diagnostics.

## Current Status

- Script/module/program entry points are available.
- Core statements and expression parsing are implemented.
- `import`/`export` bootstrap parsing is included.
- TypeScript and JSX support is intentionally partial in this initial implementation.

## API Sketch

```rust
use swc_common::{FileName, SourceMap, StringInput};
use swc_es_parser::{lexer::Lexer, Parser, Syntax};

let cm = SourceMap::default();
let fm = cm.new_source_file(FileName::Custom("a.js".into()).into(), "let a = 1;");
let lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);
let mut parser = Parser::new_from(lexer);
let parsed = parser.parse_program().unwrap();
```
