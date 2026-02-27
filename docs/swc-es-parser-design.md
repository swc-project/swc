# swc_es_parser Bootstrap Design

## AST Model

- `swc_es_ast` stores nodes in arena pools and references them using typed ids.
- Initial node groups include statements, declarations, expressions, module declarations, class/function, JSX, and TypeScript placeholders.

## Error Model

- `swc_es_parser::error::Error` tracks `Severity`, `ErrorCode`, `Span`, and message.
- Recoverable parse issues are accumulated via `take_errors()`.
- `Error::into_diagnostic` bridges parser errors into `swc_common` diagnostics.

## Parser Strategy

- Hand-written recursive descent parser with Pratt-style expression precedence.
- Script/module/program entry points share the same token stream and AST store.
- Module declarations are represented as `Stmt::ModuleDecl` for top-level interoperability.

## Fixture Reuse

- `swc_es_parser/tests/smoke.rs` consumes fixture inputs from `swc_ecma_parser/tests`.
- Fixture output is intentionally parser-local and does not target `swc_ecma_parser` snapshot parity.

## Performance Notes

- Lexer uses `StringInput` byte-level fast paths and deferred payload decoding.
- Parser allocates directly into arena storage to reduce intermediate allocations.
