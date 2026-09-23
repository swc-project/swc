---
swc_core: patch
swc_ecma_minifier: patch
---

fix(es/minifier): Preserve destructuring patterns with `/*#__PURE__*/`-annotated initializers

A `/*#__PURE__*/` annotation on the initializer of a destructuring declaration only describes the evaluation of the initializer itself. The pattern still performs property reads, which can invoke getters, and checks the initializer value for nullishness, which can throw. Unused destructuring declarations such as `const { a } = /*#__PURE__*/ x()` are therefore no longer removed. Annotations written directly on a pattern (`const /*#__PURE__*/ { a } = obj`) and unused plain bindings (`const a = /*#__PURE__*/ x()`) keep their previous behavior.
