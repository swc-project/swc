# @swc/nodejs-support-wasm

This package provides a standalone WebAssembly binding for Node.js
integrations. Its Rust crate, source, build, and test setup are independent from
`@swc/wasm-typescript`.

It includes the TypeScript transform API from `@swc/wasm-typescript` and
additional helpers for module syntax transformation, assertion locations, and
syntax validation.

## API

- `transform` and `transformSync`
- `transformModuleSyntax`
- `getFirstExpression`
- `isValidSyntax`
- `isRecoverableError`

## Contributing

See [the main repository](https://github.com/swc-project/swc)'s contributing
guide.

## License

Apache 2.0
