//// [a.ts]
function A() {}
export { A };
//// [b.ts]
import { A } from "./a";
//// [c.ts]
var A;
(function(A) {
    A.displayName = "A";
})(A || (A = {}));
A();
A.displayName;
export { };
