---
swc: patch
swc_atoms: patch
swc_core: minor
swc_ecma_transforms_base: patch
swc_ecma_transforms_typescript: patch
swc_ecma_utils: minor
---

fix(es/typescript): Fix merged namespace bindings and enum evaluation

Use a shared binding model to preserve lexical scope, declaration order, and runtime dependencies across namespaces, enums, and aliases. Reduce duplicate analysis and reuse owned atom storage.
