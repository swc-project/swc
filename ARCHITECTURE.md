# SWC architecture

This document gives a high level overview of SWC internals. You may find it useful if you want to contribute to SWC or if you are interested in the inner workings of SWC.

## Macros

<!-- TODO: fix link -->
<!-- See [blog post about SWC macros](https://swc.rs/blog/2020/01/04/pmutil#macros-built-with-pmutil). -->

SWC uses proc macro extensively to reduce work. Please see links below to know what each macro do.

-   [enum_kind][]
-   [string_enum][]
-   [ast_node][]

And some adhoc-macros are used.

-   [parser_macros][]
-   [codegen_macros][]

These macro breaks macro hygiene.

## Structure

### [`/crates/swc_atoms`](crates/swc_atoms)

Handle string interning for the SWC project. The crate depends on [string_cache](https://github.com/servo/string-cache) from servo.

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

Theres are three core transforms named `resolver`, `hygiene`, `fixer`. Other transforms depends on them.

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

where number after `#` denotes the hygiene id. If two identifiers have same symbol but different hygiene id, it's different.

#### [`/crates/swc_ecma_transforms_base/src/hygiene`](crates/swc_ecma_transforms_base/src/hygiene)

Hygiene pass actually changes symbol of identifiers with same symbol but different hygiene id.

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

(other passes generates AST like this)

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

Contains code related to converting new generation javascript codes for old browsers.

#### `/ecmascript/transforms/src/modules`

Contains code related to transforming es6 modules to other modules.

#### `/ecmascript/transforms/src/optimization`

Contains code related to making code faster on runtime. Currently only small set of optimization is implemented. -->

## Tests

SWC uses the [official ecmascript conformance test suite called test262][test262] for testing.

Parser tests ensures that parsed result of `test262/pass` is identical with `test262/pass-explicit`.

Codegen tests ensures that generated code is equivalent to golden fixture files located at [tests/references](crates/swc_ecma_codegen/tests).

[enum_kind]: https://rustdoc.swc.rs/enum_kind/derive.Kind.html
[string_enum]: https://rustdoc.swc.rs/string_enum/derive.StringEnum.html
[ast_node]: https://rustdoc.swc.rs/ast_node/index.html
[parser_macros]: https://rustdoc.swc.rs/swc_ecma_parser_macros/index.html
[codegen_macros]: https://rustdoc.swc.rs/swc_ecma_codegen_macros/index.html
[test262]: https://github.com/tc39/test262
