# swc Architecture

This document gives a high level overview of swc internals. You may find it useful if you want to contribute to swc or if you are interested in the inner workings of swc.


## Macros

swc uses proc macro extensively to reduce work. Please see links below to know what each macro do.

 - [enum_kind][]
 - [string_enum][]
 - [ast_node][]

And some adhoc-macros are used.

 - [parser_macros][]
 - [codegen_macros][]

These macro breaks macro hygiene.


## Tests

swc uses [official ecmascript conformance test suite called test262][test262] for testing.

Parser tests ensures that parsed result of test262/pass is identical with test262/pass-explicit.

Codegen tests ensures that generated code is equivalent to goldened reference files located at [tests/references](ecmascript/codegen/tests/references).




[enum_kind]:https://swc-project.github.io/rustdoc/enum_kind/derive.Kind.html
[string_enum]:https://swc-project.github.io/rustdoc/string_enum/derive.StringEnum.html
[ast_node]:https://swc-project.github.io/rustdoc/ast_node/index.html
[parser_macros]:https://swc-project.github.io/rustdoc/swc_ecma_parser_macros/index.html
[codegen_macros]:https://swc-project.github.io/rustdoc/swc_ecma_codegen_macros/index.html
[test262]:https://github.com/tc39/test262
