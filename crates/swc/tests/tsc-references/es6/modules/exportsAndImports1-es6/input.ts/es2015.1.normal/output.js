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
let E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {
}));
let D;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
})(D || (D = {
}));
let M;
(function(M) {
    var x;
    M.x = x;
})(M || (M = {
}));
var a = M.x;
export { v, f, C, E, D, a };
// @filename: t2.ts
export { v, f, C, E, D, a } from "./t1";
export { v, f, C, E, D, a };
