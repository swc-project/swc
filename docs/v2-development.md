# Developing the SWC v2 JavaScript API

SWC v1 and v2 are developed from `main`. The Rust compiler pipeline remains shared; only the
JavaScript-facing packages, bindings, configuration adapter, and AST wire codec are versioned.
The old `dev/v2` branch is reference material and must not become a second integration branch.

## Package layout

-   `packages/core` and `bindings/binding_core_node` provide the v1 API.
-   `packages/core-v2` and `bindings/binding_core_node_v2` provide the v2 API.
-   `packages/types-v2` is the private workspace source published as `@swc/types@2`.
-   `bindings/binding_core_wasm_v2` is published as `@swc/wasm@2`.
-   `crates/swc_api_common` owns source-context restoration and direct versioned AST codecs.

The v2 npm source packages intentionally use private `@swc-internal/*` names. This prevents
duplicate canonical package names inside the pnpm workspace. Release jobs change these names only
after dependency installation and compilation.

## Adding API changes

Keep compiler behavior in the existing Rust engine crates. Add v2 configuration changes in
`packages/core-v2/src/config.ts`, and add serialized AST changes to the v2 codec in
`swc_api_common`. Do not convert a v2 AST through the v1 JSON representation.

New compiler capabilities should be exposed through both npm façades unless the v2 cleanup has an
explicitly approved incompatibility. The v1 binding continues to compile its legacy `bundle` and
`print` exports; the v2 binding excludes those modules at compile time.

## Preview releases

Run the `Publish SWC v2 preview` workflow with a tagged `2.x` prerelease. It publishes
`@swc/core`, every native platform package, `@swc/types`, and `@swc/wasm` under the `next` tag.
The canonical tarballs can be inspected locally with:

```sh
pnpm --dir packages/core-v2 build:ts
pnpm --filter @swc-internal/types-v2 build
node scripts/stage-npm-v2.mjs 2.0.0-next.0
```

Dist-tags are controlled by `.github/npm-release-lines.json`. For GA, change the mapping to make
major 2 `latest` and major 1 `legacy` in the same release PR. Never publish a v1 patch with the npm
default tag after that transition.
