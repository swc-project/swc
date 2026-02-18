# AI Agent Rules

When working in a specific directory, apply the rules from that directory and all parent directories up to the root.

## While working on `.`

*Source: `AGENTS.md`*

# Instructions

## General rule

-   Read the codebase - the codebase is source of truth, and you should prefer reading lots of source code over searching.
-   Write performant code. Always prefer performance over other things.

## Code style

-   Write comments and documentations in English.
-   Write documentation for your code.
-   Commit your work as frequent as possible using git. Do NOT use `--no-verify` flag.
-   Prefer multiple small files over single large file.

---

-   When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.

## Testing

-   Write unit tests for your code.
-   You can do `UPDATE=1 cargo test` to get test outputs updated.
-   When instructed to fix tests, do not remove or modify existing tests.

## Compatibility rule

-   Do not use unstable, nightly only features of rustc.


---

## While working on `crates/swc_ecma_minifier`

*Source: `crates/swc_ecma_minifier/AGENTS.md`*

### Instructions

-   You can run execution tests by doing `./scripts/exec.sh` to see if your changes are working.
-   If an execution test fails, you are wrong.
-   Always run execution tests after making changes.
-   You can run fixture tests by doing `./scripts/test.sh`, and you can do `UPDATE=1 ./scripts/test.sh` to update fixtures.


---

## While working on `crates/swc_ecma_transformer`

*Source: `crates/swc_ecma_transformer/AGENTS.md`*

### Instructions

-   The Transformer must implement `VisitMut` and execute the `VisitMutHooks` of its subtypes.
-   Other types like ES20xx or transforms for specific syntax MUST NOT implement `VisitMut`.
-   Subtypes must implement `VisitMutHook<TraverseCtx>`.
-   Before starting work, read `$repositoryRoot/crates/swc_ecma_hooks/src/`.
