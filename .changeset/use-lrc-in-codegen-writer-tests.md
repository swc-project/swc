---
swc_core: patch
swc_ecma_codegen: patch
---

fix(es/codegen): Use `Lrc` instead of `Arc` in the `JsWriter` unit tests so they compile without the `concurrent` feature of `swc_common`.
