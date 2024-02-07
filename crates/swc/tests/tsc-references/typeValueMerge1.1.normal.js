//// [typeValueMerge1.ts]
//// [other.ts]
function A() {}
export { A };
var B = 10;
export { B };
//// [main.ts]
import { A, B } from "./other";
A();
export var C = B;
