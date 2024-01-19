//// [a.ts]
function A() {}
export { A };
//// [b.ts]
import "./a";
//// [c.ts]
var A, A1;
A1 = A || (A = {}), A1.displayName = "A", A(), A.displayName;
export { };
