---
swc_core: patch
swc_ecma_transformer: patch
---

fix(es/compat): Expand unicode property escapes in `RegExp` patterns passed through constants

Follow `const` bindings in strict code and keep their reads before the expanded pattern to preserve TDZ errors. Leave calls to a local or imported `RegExp` unchanged.
