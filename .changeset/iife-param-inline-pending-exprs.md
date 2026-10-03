---
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Inline IIFE arguments into expressions stored for later inlining

When the compressor removes a parameter of an immediately invoked function, it replaces the
parameter's references in the function body. Expressions which had already been taken or cloned
out of that body for later inlining, such as a function declaration which is inlined into its use
site, were not updated, so the removed binding came back when they were inlined and was no longer
declared anywhere.
