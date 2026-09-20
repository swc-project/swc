# @swc/nodejs-support-wasm

This package provides a standalone WebAssembly binding for Node.js
integrations. Its Rust crate, source, build, and test setup are independent from
`@swc/wasm-typescript`.

It includes the TypeScript transform API from `@swc/wasm-typescript` and
additional helpers for module syntax transformation, assertion locations, and
syntax validation.

## API

-   `transform` and `transformSync`
-   `transformModuleSyntax`
-   `getFirstExpression`
-   `isValidSyntax`
-   `isRecoverableError`
-   `tokenize`
-   `findTopLevelAwaits`

All source arguments accept a string or a UTF-8 `Uint8Array`.

### Syntax highlighting

`tokenize(src)` returns `{ kind, start, end }[]` in source order. The token kinds
are `keyword`, `identifier`, `number`, `bigint`, `string`, `template`, `regexp`,
`comment`, and `punctuator`. Offsets are zero-based UTF-16 code units with an
exclusive end, so `src.slice(start, end)` extracts the token. Comments include
their delimiters; hashbangs are comments. Whitespace and EOF are omitted.
Template text includes its backticks, while `${` and `}` are punctuators and
interpolated expressions have their own tokens.

This helper parses JavaScript to distinguish regular expressions from division
and track template substitutions. On incomplete or invalid input it returns the
tokens captured before parsing stopped, without throwing a syntax error. It is
intended for REPL highlighting, not syntax validation or TypeScript tokenization.

### Top-level await locations

`findTopLevelAwaits(src)` returns `{ line, column }[]` in source order for `await`
expressions, `for await` loops, and `await using` declarations in module scope.
Lines start at 1 and UTF-16 columns start at 0, matching Acorn. Each location is
the start of the construct (`for` for a `for await` loop). Function bodies,
including methods and arrow functions, are excluded; class heritage expressions
and computed keys are included. JavaScript and TypeScript are supported, and
invalid or incomplete modules return an empty array.

### REPL imports

`transformModuleSyntax(src)` hoists imports and declares their local bindings,
so a REPL can retain them for subsequent inputs. For example, a default import
declares `const { default: fs } = await __nodeREPLDynamicImport(...)` after
validating that the export exists. The caller supplies `__nodeREPLDynamicImport`
and evaluates the output with top-level await support.

Default and named bindings capture the initial export values, matching Node's
REPL transform; namespace bindings retain the module namespace object. References
and assignments are left intact so normal JavaScript scope, call, and `const`
semantics apply before any further rewriting performed by the host REPL.

## Contributing

See [the main repository](https://github.com/swc-project/swc)'s contributing
guide.

## License

Apache 2.0
