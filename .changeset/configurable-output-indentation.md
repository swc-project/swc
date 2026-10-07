---
swc: major
swc_cli_impl: patch
swc_compiler_base: major
swc_core: major
swc_ecma_codegen: minor
---

feat(es/codegen): Support `jsc.output.indentString` with four spaces as the default.

Rust callers that construct `JscOutputConfig` or `PrintArgs` without a default struct update must add the `indent_string` field.
