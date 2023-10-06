//// [a.ts]
function A() {}
export { };
//// [b.ts]
var A;
(function(A) {
    A.displayName = "A";
})(A || (A = {}));
export { A };
//// [c.ts]
import { A } from "./b";
A;
A.displayName;
A();
