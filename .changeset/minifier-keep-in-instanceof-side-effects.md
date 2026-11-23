---
swc: patch
swc_core: patch
swc_ecma_minifier: patch
swc_ecma_utils: patch
---

fix(es/minifier): Keep `in` and `instanceof` expressions whose result is unused

The `in` and `instanceof` operators can throw a `TypeError` and can call user
code through proxies and `Symbol.hasInstance`. The minifier and
`swc_ecma_utils` no longer treat them as free of side effects, so they are not
dropped when their result is unused.
