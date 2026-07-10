---
swc: major
swc_core: major
swc_ecma_transforms_module: major
swc_ecma_utils: patch
---

fix(es/module): Rewrite SystemJS transform.

BREAKING: The Rust `system_js::Config` wrapper was replaced with the shared module transform `Config`. Rust API users should pass fields such as `resolve_fully` and `out_file_extension` directly instead of through `config.config`. The `.swcrc` SystemJS module config remains flat.
