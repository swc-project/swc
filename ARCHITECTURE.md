# SWC architecture

This document gives a high level overview of SWC internals. You may find it useful if you want to contribute to SWC or if you are interested in the inner workings of SWC.

## Macros

<!-- TODO: fix link -->
<!-- See [blog post about SWC macros](https://swc.rs/blog/2020/01/04/pmutil#macros-built-with-pmutil). -->

SWC uses proc macro extensively to reduce work. Please see links below to know what each macro do.

-   [string_enum][]
-   [ast_node][]

And some adhoc-macros are used.

-   [parser_macros][]
-   [codegen_macros][]

These macro breaks macro hygiene.

## Structure

### [`/crates/swc_atoms`](crates/swc_atoms)

Handle string interning for the SWC project. The crate depends on [hstr](https://github.com/dudykr/ddbase).

### [`/crates/swc_common`](crates/swc_common)

Contains code related to span, hygiene and error reporting.

Also, it contains / re-exports codes for visitor pattern. `Visit<T>` is non-mutating visitor, while `Fold<T>` is a mutating visitor.

### [`/crates/swc_ecma_ast`](crates/swc_ecma_ast)

Contains AST nodes for javascript and typescript.

### [`/crates/swc_ecma_codegen`](crates/swc_ecma_codegen)

Converts javascript AST into javascript code.

### [`/crates/swc_ecma_parser`](crates/swc_ecma_parser)

Parses javascript and typescript

### [`/crates/swc_ecma_transforms_base`](crates/swc_ecma_transforms_base)

There are three core transforms named `resolver`, `hygiene`, `fixer`. Other transforms depend on them.

#### [`/crates/swc_ecma_transforms_base/src/resolver`](crates/swc_ecma_transforms_base/src/resolver)

This pass resolves and marks all identifiers in the file.

e.g.

```js
let a = 1;
{
    let a = 1;
}
```

becomes

```js
let a#0 = 1;
{
  let a#1 = 1;
}
```

where the number after the hash (`#`) denotes the hygiene id. If two identifiers have the same symbol but different hygiene ids, they are considered different.

#### [`/crates/swc_ecma_transforms_base/src/hygiene`](crates/swc_ecma_transforms_base/src/hygiene)

The hygiene pass actually changes symbols of identifiers with the same symbol but different hygiene ids to different symbols.

```js
let a#0 = 1;
{
  let a#1 = 2;
}
```

becomes

```js
let a = 1;
{
    let a1 = 2;
}
```

#### [`/crates/swc_ecma_transforms_base/src/fixer`](crates/swc_ecma_transforms_base/src/fixer)

Fixes broken AST. This allow us to simply fold types like `BinExpr` without caring about operator precedence.

It means,

```rust
let v = BinExpr {
    left: "1 + 2",
    op: "*",
    right: "3",
};
```

(other passes generate AST like this)

is converted into

```rust
let v = BinExpr {
    left: "(1 + 2)",
    op: "*",
    right: "3",
};
```

and printed as

```js
(1 + 2) * 3;
```

<!-- TODO: add correct references to files -->
<!-- #### `/ecmascript/transforms/src/compat`

Contains code related to converting new generation javascript code into code understood by old browsers.

#### `/ecmascript/transforms/src/modules`

Contains code related to transforming es6 modules to other modules.

#### `/ecmascript/transforms/src/optimization`

Contains code related to making code faster on runtime. Currently only a small set of optimizations is implemented. -->

## Tests

SWC uses the [official ecmascript conformance test suite called test262][test262] for testing.

Parser tests ensure that the parsed results of `test262/pass` are identical with `test262/pass-explicit`.

Codegen tests ensure that the generated code is equivalent to the golden fixture files located at [tests/references](crates/swc_ecma_codegen/tests).

[string_enum]: https://rustdoc.swc.rs/string_enum/derive.StringEnum.html
[ast_node]: https://rustdoc.swc.rs/ast_node/index.html
[parser_macros]: https://rustdoc.swc.rs/swc_ecma_parser_macros/index.html
[codegen_macros]: https://rustdoc.swc.rs/swc_ecma_codegen_macros/index.html
[test262]: https://github.com/tc39/test262
