//// [a.ts]
var A = {};
export { A };
//// [b.ts]
export { };
//// [c.ts]
import { A } from "./b";
//// [d.ts]
import { A } from "./c";
A;
