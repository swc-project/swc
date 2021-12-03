// @filename: t3.ts
import { I, M, N, T, a } from "./t1";
// @target: es6
// @module: commonjs
// @filename: t1.ts
var v = 1;
function f() {
}
class C {
}
var E;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E || (E = {
}));
var D;
(function(D1) {
    D1[D1["A"] = 0] = "A";
    D1[D1["B"] = 1] = "B";
    D1[D1["C"] = 2] = "C";
})(D || (D = {
}));
var M;
(function(M1) {
    var x;
    M1.x = x;
})(M || (M = {
}));
var a = M.x;
export { v, f, C, E, D, a };
// @filename: t2.ts
export { v, f, C, E, D, a } from "./t1";
export { v, f, C, E, D, a };
