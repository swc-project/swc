//// [a.ts]
var A = {};
export { A };
//// [b.ts]
export { };
//// [c.ts]
import "./b";
//// [d.ts]
import { A } from "./c";
