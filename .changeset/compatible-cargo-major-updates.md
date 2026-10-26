---
dbg-swc: major
jsdoc: major
swc: patch
swc_allocator: patch
swc_arena: patch
swc_bundler: major
swc_cli_impl: major
swc_common: major
swc_core: major
swc_css_lints: major
swc_css_parser: major
swc_ecma_codegen: patch
swc_ecma_lints: patch
swc_ecma_loader: major
swc_ecma_minifier: patch
swc_ecma_parser: patch
swc_ecma_preset_env: patch
swc_ecma_transforms_base: patch
swc_ecma_transforms_typescript: patch
swc_estree_compat: patch
swc_html_minifier: patch
swc_html_parser: patch
swc_ts_fast_strip: patch
swc_ts_fast_strip_binding: patch
testing_macros: major
---

fix(deps): Update compatible Cargo major dependencies and migrate Clap 4 and nom 8.

Keep syn 2 and the existing Wasmer/WASIX and Wasmtime LTS versions to preserve
macro API and toolchain compatibility. JSDoc inputs now implement nom 8 input
traits; existing parsed fixture output remains unchanged.
