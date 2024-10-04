//// [a.ts]
function A() {}
export { };
//// [b.ts]
(function(A) {
    A.displayName = "A";
})(A || (A = {}));
export { A };
var A;
//// [c.ts]
import { A } from "./b";
A;
A.displayName;
A();
