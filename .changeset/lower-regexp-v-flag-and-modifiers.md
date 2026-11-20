---
swc_ecma_compat_common: patch
swc_ecma_compat_regexp: minor
swc_ecma_preset_env: patch
swc_ecma_regexp: minor
swc_ecma_regexp_ast: patch
swc_ecma_transformer: minor
swc_core: minor
---

fix(es/preset-env): Lower the regexp `v` flag and modifiers

Regex literals that use the `v` flag, modifiers such as `(?i:...)`, or
duplicate named groups are now lowered for targets that do not support them.
This applies to `env.targets` and to `jsc.target`: `jsc.target` below
`es2024` lowers the `v` flag, and every `jsc.target` other than `esnext`
lowers modifiers and duplicate named groups.
