---
swc_core: major
swc_ecma_ast: major
swc_ecma_codegen: major
swc_ecma_lexer: major
swc_ecma_parser: major
swc_ecma_react_compiler: major
swc_ecma_visit: major
---

feat(es/parser)!: Support import attributes in TypeScript ambient module declarations

Parse `declare module "*.txt" with { type: "text" } {}` from TypeScript 7.1 and store the attributes in the new `TsModuleDecl::with` field. Codegen emits the attributes and terminates a body-less ambient module declaration with a semicolon.
