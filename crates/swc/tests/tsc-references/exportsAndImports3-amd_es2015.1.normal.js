// @filename: t3.ts
import { I1 as I, T1 as T, a1 as a } from "./t1";
// @module: amd
// @target: ES5
// @filename: t1.ts
export var v = 1;
export function f() {}
export class C {
}
export var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {}));
export var D;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
})(D || (D = {}));
export var M;
(function(M) {
    var x;
    M.x = x;
})(M || (M = {}));
export var a = M.x;
export { v as v1, f as f1, C as C1, E as E1, D as D1, M as M1, N as N1, a as a1 };
// @filename: t2.ts
export { v1 as v, f1 as f, C1 as C, I1 as I, E1 as E, D1 as D, M1 as M, N1 as N, T1 as T, a1 as a } from "./t1";
export { v, f, C, E, D, M, N, a };
