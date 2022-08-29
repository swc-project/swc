//// [items.js]
export var a = 1;
export var b = 2;
export var c = 3;
//// [justone.js]
export { a, b, c } from "./items";
//// [two.js]
export { a } from "./items";
export { b, c } from "./items";
//// [multiple.js]
export { a, b } from "./items";
export { a as aa } from "./two";
export { b as bb } from "./two";
export { c } from "./two";
export { c as cc } from "./items";
