export var a = 1;
export var b = 2;
export { a, b } from "./0";
export * from "./0";
import * as _ns from "./0";
export { _ns as ns };
export { a, b } from "./0";
export { a as c, b as d } from "./0";
