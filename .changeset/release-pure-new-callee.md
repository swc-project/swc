---
swc_core: minor
swc_ecma_minifier: patch
swc_ecma_utils: minor
---

fix(es/minifier): Release the `ExprExt::is_pure_new_callee` API in `swc_ecma_utils` and update the minifier's dependency requirement so registry builds cannot select a version without this method.
