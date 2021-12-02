// @filename: t3.ts
import { I1 as I, M1 as M, N1 as N, T1 as T, a1 as a } from "./t1";
// @target: es6
// @module: commonjs
// @filename: t1.ts
export var v = 1;
export function f() {
}
export class C {
}
export var E;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E || (E = {
}));
export var D;
(function(D1) {
    D1[D1["A"] = 0] = "A";
    D1[D1["B"] = 1] = "B";
    D1[D1["C"] = 2] = "C";
})(D || (D = {
}));
export var M;
(function(M1) {
    var x;
    M1.x = x;
})(M || (M = {
}));
export var a = M.x;
export { v as v1, f as f1, C as C1, E as E1, D as D1, a as a1 };
// @filename: t2.ts
export { v1 as v, f1 as f, C1 as C, I1 as I, E1 as E, D1 as D, M1 as M, N1 as N, T1 as T, a1 as a } from "./t1";
export { v, f, C, E, D, a };
