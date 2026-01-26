//// [items.js]
export var a = 1;
export var b = 2;
export var c = 3;
//// [justone.js]
export { a, b, c } from "./items";
//// [two.js]
export { a, b, c } from "./items";
//// [multiple.js]
export { a, b, c as cc } from "./items";
export { a as aa, b as bb, c } from "./two";
