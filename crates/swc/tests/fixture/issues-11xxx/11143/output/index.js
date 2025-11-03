// Test path alias with .ts extension - should rewrite to .js
export { a } from "./util/index.js";
// Test path alias with .tsx extension - should rewrite to .jsx
export { b } from "./util/other.jsx";
// Test path alias with .mts extension - should rewrite to .mjs
export { c } from "./util/module.mjs";
// Test path alias with .cts extension - should rewrite to .cjs
export { d } from "./util/common.cjs";
// Test regular relative import - should still work
export { e } from "./util/relative.js";
// Test export all
export * from "./util/all.js";
// Test dynamic import
const f = import("./util/dynamic.js");
