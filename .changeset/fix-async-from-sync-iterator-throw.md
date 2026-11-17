---
swc_core: patch
swc_ecma_transforms_base: patch
---

fix(es/helpers): Forward `throw` to the sync iterator's `throw` in `_async_iterator`, and close the sync iterator when a value yielded from `next` or `throw` rejects
