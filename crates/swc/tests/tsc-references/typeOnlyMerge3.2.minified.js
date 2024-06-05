//// [a.ts]
export { };
//// [b.ts]
var A;
(A = {}).displayName = "A";
export { A };
//// [c.ts]
import { A } from "./b";
A.displayName, A();
