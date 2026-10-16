---
swc_core: patch
swc_ecma_transforms_base: patch
---

fix(es/helpers): Keep multi-statement inline helper bindings in one SyntaxContext so hygiene does not rename `_SuppressedError` independently of its uses (fixes #12531)
