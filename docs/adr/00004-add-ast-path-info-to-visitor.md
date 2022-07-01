# Provide more information to visitor methods

-   Status: accepted <!-- optional -->
-   Deciders: @kdy1, @kwonoj <!-- optional -->
-   Date: 2022-06-30 <!-- optional -->

## Context and Problem Statement

Currently one can't get any information about parent node.
This is due to ownership restriction of rust.
We can't pass a reference to the parent to a visitor method.
Let's say we have a `CallExpr`, and we are now going to call `visit_mut_callee` from `visit_mut_call_expr`.
We want `&mut callee`, because it's the signature of `visit_mut_callee`.
So we **borrow it from CallExpr**.
As we mutabily borrowed something from `CallExpr`, we cannot pass `&CallExpr` to `visit_mut_callee`.

We can workaround this by

-   taking `CallExpr.callee`
-   call `visit_mut_callee(&mut self, callee: &mut Callee, parent: &CallExpr)`, with dummy callee in `parent.callee`.
-   restore the original callee from `visit_mut_call`.

But doing this by hand is error-prone and doing this automatically by codegen is costly.
This is explicit `memmove`, and `memmove` is quite costly.
SWC moved from `Fold` to `VisitMut` because of `mmemove`.

## Decision Drivers

-   Help plugin authors writing plugins.

## Considered Options

-   [option 1] Stay with as-is.

-   [option 2] Provide full information using `unsafe`.

-   **[option 3] Provide small amount of information .**

We will expose the spans and kinds of the parent ast nodes for `VisitMut` and `Fold`, while passing an enum with parent data for `Visit`.
This difference is related to the restriction above.
This is the core of rust, and we don't want to violate the rules of rust.

## Decision Outcome

Chosen option: **[option 3] Provide small amount of information .**

This decision is taken because

-   It's too hard to **port** plugins, because a plugin author has to recreate logic instead of porting, if the original babel plugin uses parent node information.
-   Using `unsafe` in public API requires more discussion.
-   We don't have good debugging api for plugins at the moment, so using `unsafe` in plugins is strongly discourages.
