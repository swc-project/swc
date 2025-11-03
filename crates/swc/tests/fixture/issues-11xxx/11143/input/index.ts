// Test path alias with .ts extension - should rewrite to .js
export { a } from "@/util/index.ts";

// Test path alias with .tsx extension - should rewrite to .jsx
export { b } from "@/util/other.tsx";

// Test path alias with .mts extension - should rewrite to .mjs
export { c } from "@/util/module.mts";

// Test path alias with .cts extension - should rewrite to .cjs
export { d } from "@/util/common.cts";

// Test regular relative import - should still work
export { e } from "./util/relative.ts";

// Test export all
export * from "@/util/all.ts";

// Test dynamic import
const f = import("@/util/dynamic.ts");
