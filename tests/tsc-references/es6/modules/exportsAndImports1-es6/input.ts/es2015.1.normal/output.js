// @filename: t3.ts
import { I, M as M1, N, T, a } from "./t1";
// @target: es6
// @module: commonjs
// @filename: t1.ts
var v = 1;
function f() {
}
class C {
}
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E1 || (E1 = {
}));
var D1;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
})(D1 || (D1 = {
}));
var M1;
(function(M) {
    var x;
    M.x = x;
})(M1 || (M1 = {
}));
var a = M1.x;
export { v, f, C, E1 as E, D1 as D, a };
// @filename: t2.ts
export { v, f, C, E1 as E, D1 as D, a } from "./t1";
export { v, f, C, E1 as E, D1 as D, a };
