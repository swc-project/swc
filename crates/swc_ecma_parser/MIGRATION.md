# Parser API migration

The replacement parser follows the OXC-style single-entry API:

```rust
use swc_ecma_parser::next::{Parser, SourceType};

let result = Parser::new("export const value = 1", SourceType::module()).parse();
assert!(!result.panicked);
```

`ParserReturn` owns the SWC `Program`, diagnostics, source-ordered comments,
and optional tokens. Use `Parser::with_tokens` only when tokens or legacy
comment attachment are required; the default path has no token collection.

The new API preserves AST node meaning across JavaScript, TypeScript, JSX,
TSX, and Flow. It does not guarantee compatibility for parser diagnostics,
comment attachment, or exact span values.

The cursor, token, and parser organization is based on the design of OXC's
`oxc_parser` at commit `b6d2a29e47358a288dbfb2a635550243511ec497`.
OXC is distributed under the MIT license in `OXC_LICENSE`.
