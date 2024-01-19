//// [a.ts]
export { };
//// [b.ts]
var A, A1;
A1 = A || (A = {}), A1.displayName = "A";
export { A };
//// [c.ts]
import { A } from "./b";
A.displayName, A();
