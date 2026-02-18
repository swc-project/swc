# Instructions

## General rule

-   Read the codebase - the codebase is source of truth, and you should prefer reading lots of source code over searching.
-   Do not search web unless explicitly asked to do so. Web search does not help in general for our project.
-   Write performant code. Always prefer performance over other things.
-   Use `gh` CLI tool for fetching data from `github.com`.

## Code style

-   Write comments and documentations in English.
-   Write documentation for your code.
-   Commit your work as frequent as possible using git. Do NOT use `--no-verify` flag.
-   Prefer multiple small files over single large file.

---

-   When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.

## Testing

-   Write unit tests for your code.
-   Prefer fixture tests over inline (`#[test]`) tests.
-   You can do `UPDATE=1 cargo test` to get test outputs updated for fixture tests.
-   When instructed to fix tests, do not remove or modify existing tests.

## PR / CI rule

-   Do not use commit messages starting with `chore:` for PR work. CI jobs are skipped by message filter, and we want full CI coverage.
-   Before opening or updating a PR, always run this baseline locally.
    -   `cargo fmt --all`
    -   `cargo clippy --all --all-targets -- -D warnings`
    -   `cargo deny check`
    -   `cargo shear --fix`
    -   `cargo check --all --all-targets`
-   If JavaScript / wasm / bindings are involved, run node setup used by CI before tests.
    -   `corepack enable`
    -   `yarn`
    -   `rustup target add wasm32-wasip1`
-   For each touched Rust crate, run crate-level verification locally.
    -   `cargo test -p <crate>`
    -   `./scripts/github/test-concurrent.sh <crate>`
    -   `./scripts/github/run-cargo-hack.sh <crate>`
-   Mirror CI's special test commands for affected crates.
    -   `swc_core`: `cargo test -p swc_core --features ecma_quote --features common --features ecma_utils`
    -   `binding_core_wasm`: `cargo test --manifest-path ./bindings/binding_core_wasm/Cargo.toml`
    -   `swc_cli`: `cargo test --manifest-path ./bindings/swc_cli/Cargo.toml --features plugin`
    -   `swc_plugin_backend_tests`: `cargo test -p swc_plugin_backend_tests --release`
    -   `hstr`: `cargo test -p hstr --features serde`
    -   `swc_ecma_minifier`: `cargo test -p swc_ecma_minifier --features concurrent --features par-core/chili`
    -   `swc_ecma_parser`: `cargo test -p swc_ecma_parser --features verify` and `cargo test -p swc_ecma_parser --all-features`
    -   `swc_ecma_loader`: `cargo test -p swc_ecma_loader --all-features`
    -   `swc_ecma_transforms`: `cargo test -p swc_ecma_transforms --all-features --features swc_ecma_utils/stacker`
    -   `swc_ecma_transforms`: `RUSTFLAGS="--cfg swc_ast_unknown" cargo check -p swc_ecma_transforms --features typescript,react,proposal,optimization,module,compat`
-   If wasm binding packages are touched, run:
    -   `(cd bindings/binding_core_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_minifier_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_typescript_wasm && ./scripts/test.sh)`
    -   `(cd bindings/binding_es_ast_viewer && ./scripts/test.sh)`
-   If node bindings or integration paths are touched, run:
    -   `(cd packages/core && yarn build:dev && yarn test)`
    -   `npm install -g @swc/cli@0.1.56 && npm link && npm install -g file:$PWD`
    -   `(cd crates/swc_node_bundler/tests/integration/react && npm install && npx spack)`

## Compatibility rule

-   Do not use unstable, nightly only features of rustc.
