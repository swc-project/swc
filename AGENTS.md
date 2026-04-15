# Instructions

## General rule

-   Read the codebase - the codebase is source of truth, and you should prefer reading lots of source code over searching.
-   Do not search web unless explicitly asked to do so. Web search does not help in general for our project.
-   Write performant code. Always prefer performance over other things.
-   Use `gh` CLI tool for fetching data from `github.com`.
-   Do not let sandbox constraints stall progress. If sandbox restrictions block required work, request escalation promptly and continue.

## Code style

-   Write comments and documentations in English.
-   Write documentation for your code.
-   When introducing a workaround, leave sufficient comments explaining why it is needed and any known limitations.
-   Commit your work as frequent as possible using git. Do NOT use `--no-verify` flag.
-   Prefer multiple small files over single large file.
-   Prefer enum (or dedicated type) based modeling over raw string literals whenever possible.

---

-   When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.

## Debugging and logging

-   Do not guess behavior. Verify assumptions by reading source, fixtures, and tests.
-   Debug with logs when behavior is unclear.
-   Write sufficient logs for debugging and operational troubleshooting.
-   Prefer structured logging in Rust (`tracing`) over ad-hoc plain text logs when feasible.

## Shell safety

-   For shell commands or scripts, prefer `$(...)` over legacy backticks for command substitution.
-   Quote and escape all dynamic shell values strictly.

## Git workflow

-   Run `git commit` only after `git add`.
-   Once changes are staged, commit without unnecessary delay so staged history is preserved.
-   When creating or updating a pull request, follow the repository pull request template.
-   After addressing pull request review comments and pushing updates, resolve the corresponding review threads.

## Testing

-   Write unit tests for your code.
-   Prefer fixture tests over inline (`#[test]`) tests.
-   Before running tests, run `git submodule update --init --recursive` to initialize and update all submodules.
-   You can do `UPDATE=1 cargo test` to get test outputs updated for fixture tests.
-   When instructed to fix tests, do not remove or modify existing tests.

### Fixture Test Common Guide

- Add new coverage by extending existing fixture suites instead of adding ad-hoc inline tests.
- Find the exact fixture harness before adding files with: `rg -n "#\[(testing::)?fixture\(" tests src --glob "*.rs"`.
- Keep each suite's naming conventions (for example: input.*, output.*, exec.*, .ans).
- For snapshot-style tests, update expected outputs with `UPDATE=1 cargo test -p ...` using the exact crate command documented in each crate's AGENTS.md.
- Always rerun the same crate tests without `UPDATE` before finishing.

## Verification

-   Before finishing a task, always run this baseline locally.
    -   `cargo fmt --all`
    -   `cargo clippy --all --all-targets -- -D warnings`
-   For each touched Rust crate, run crate-level verification locally.
    -   `cargo test -p <crate>`
-   If wasm binding packages are touched, run:
    -   `(cd bindings/binding_core_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_minifier_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_typescript_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_es_ast_viewer && ./scripts/test.sh)`
-   If node bindings or integration paths are touched, run:
    -   `(cd packages/core && yarn build:dev && yarn test)`

## Compatibility rule

-   Do not use unstable, nightly only features of rustc.
