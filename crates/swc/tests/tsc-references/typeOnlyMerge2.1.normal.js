//// [a.ts]
var A = {};
export { A };
//// [b.ts]
import { A } from "./a";
//// [c.ts]
(function(A) {})(A || (A = {}));
export { A };
var A;
//// [d.ts]
import { A } from "./c";
A;
