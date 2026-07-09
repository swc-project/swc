---
swc_core: patch
swc_ecma_react_compiler: patch
---

fix(react-compiler): Defer compilation eligibility to React Compiler instead of filtering for React-like functions in SWC. This allows compiler directives in nested functions to reach React Compiler without requiring the containing function to look like a component or hook.
