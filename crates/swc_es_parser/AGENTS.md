# swc_es_parser Parity Design

## AST Model

- `swc_es_ast` stores nodes in arena pools and references them using typed ids.
- The parser keeps allocating directly into `swc_es_ast` without intermediate trees.

## Error Model

- `swc_es_parser::error::Error` tracks `Severity`, `ErrorCode`, `Span`, and message.
- Recoverable parse issues are accumulated via `take_errors()`.
- `Error::into_diagnostic` bridges parser errors into `swc_common` diagnostics.

## Parser Strategy

- Hand-written recursive descent parser with Pratt-style expression precedence.
- Script/module/program entry points share the same token stream and AST store.
- Module declarations are represented as `Stmt::ModuleDecl` for top-level interoperability.
- A parity fixture mode can classify known shared fixtures as expected success or expected failure.
- Runtime dependency on `swc_ecma_parser` is forbidden; fixture corpus reuse is test-only.

## Fixture Parity Contract

- `swc_es_parser/tests/parity_suite.rs` reuses the `swc_ecma_parser/tests` fixture corpus.
- The suite enforces pass/fail parity only (not diagnostic-text parity).
- The suite mirrors `swc_ecma_parser` fixture skip rules for `typescript/tsc` and `test262` pass ignores.

## Syntax Option Coverage

- `EsSyntax` option behavior is wired for `decorators_before_export`,
  `export_default_from`, and `allow_super_outside_method`.
- `TsSyntax` option behavior is wired for `dts` and
  `disallow_ambiguous_jsx_like`.

## Performance Notes

- Lexer uses `StringInput` byte-level fast paths and deferred payload decoding.
- Parser allocates directly into arena storage to reduce intermediate allocations.
