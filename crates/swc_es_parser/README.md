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
- Structured `for` head parsing is available (`classic`, `for..in`, `for..of`).
- JSX parsing supports qualified tag names and reports opening/closing tag mismatches.
- TypeScript parsing builds structured type nodes (function/union/intersection/tuple/array/type-literal/type-args) for `type` aliases and `as` assertions.

## Fixture Harness

- `swc_ecma_parser` inputs are reused from `crates/swc_ecma_parser/tests`.
- The harness validates parser behavior as pass/fail against the same fixture
  categories (`js`, `jsx`, `typescript`, `typescript-errors`, `errors`,
  `comments`, `span`, `shifted`, `tsc`, `test262-parser`).
- `options.json` / `config.json` parser options are consumed where present.
- Run the fixture harness with:

```bash
cargo test -p swc_es_parser --test fixture_harness
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
