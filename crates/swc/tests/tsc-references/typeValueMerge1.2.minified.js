//// [typeValueMerge1.ts]
//// [other.ts]
function A() {}
var B = 10;
export { A, B };
//// [main.ts]
import { A, B } from "./other";
A();
export var C = B;
