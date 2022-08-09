export var x = 1;
export var y = 2;
export default "hello";
export function foo() {}
var x = "x", y = "y", z = "z";
export { x, y, z };
export * from "./t1";
export * from "./t2";
export * from "./t3";
import hello, { x, y, z, foo } from "./t4";
