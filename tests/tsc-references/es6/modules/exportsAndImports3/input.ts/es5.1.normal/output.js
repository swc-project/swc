// @filename: t3.ts
import { I1 as I, M1 as M1, N1 as N, T1 as T, a1 as a } from "./t1";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @module: commonjs
// @filename: t1.ts
export var v = 1;
export function f() {
}
export var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var E1;
export { E1 as E };
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E1 || (E1 = {
}));
var D1;
export { D1 as D };
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
})(D1 || (D1 = {
}));
var M1;
export { M1 as M };
(function(M) {
    var x;
    M.x = x;
})(M1 || (M1 = {
}));
export var a = M1.x;
export { v as v1, f as f1, C as C1, E1 as E1, D1 as D1, a as a1 };
// @filename: t2.ts
export { v1 as v, f1 as f, C1 as C, I1 as I, E1 as E, D1 as D, M1 as M, N1 as N, T1 as T, a1 as a } from "./t1";
export { v, f, C, E1 as E, D1 as D, a };
