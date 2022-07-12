// @module: commonjs
// @target: ES5
// @filename: t1.ts
// @filename: main.ts
import hello from "./t4";
export var x = 1;
export var y = 2;
// @filename: t2.ts
export default "hello";
export function foo() {}
// @filename: t3.ts
var x = "x";
var y = "y";
var z = "z";
export { x, y, z };
// @filename: t4.ts
export * from "./t1";
export * from "./t2";
export * from "./t3";
hello;
x;
y;
z;
foo;
