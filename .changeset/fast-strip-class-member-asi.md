---
swc_ts_fast_strip: patch
---

fix(ts/fast-strip): Keep a `;` in place of an erased class member when the next member starts with `[`, `(`, `*`, a template, `in` or `instanceof`.
