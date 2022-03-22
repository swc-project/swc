import * as _ns from "./0";
// @declaration: true
// @target: es2015
// @module: es2015, commonjs, esnext
// @filename: 0.ts
export var a = 1;
export var b = 2;
export { a, b } from "./0";
export * from "./0";
export { _ns as ns };
// @filename: 2.ts
export { a, b } from "./0";
export { a as c, b as d } from "./0";
