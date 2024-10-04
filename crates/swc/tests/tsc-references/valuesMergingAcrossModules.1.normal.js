//// [a.ts]
function A() {}
export { A };
//// [b.ts]
import { A } from "./a";
//// [c.ts]
(function(A) {
    A.displayName = "A";
})(A || (A = {}));
A();
A.displayName;
var A;
export { };
