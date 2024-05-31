//// [a.ts]
function A() {}
export { A };
//// [b.ts]
import "./a";
//// [c.ts]
var A;
(A = {}).displayName = "A", A(), A.displayName;
export { };
