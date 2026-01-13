//// [a.ts]
var A = {};
export { A };
//// [b.ts]
import { A } from "./a";
//// [c.ts]
export { };
//// [d.ts]
import { A } from "./c";
A;
