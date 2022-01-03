// @filename: t3.ts
import { I, N, T } from "./t1";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @module: amd
// @target: ES5
// @filename: t1.ts
var v = 1;
function f() {
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {
}));
var D;
(function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
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
export { v, f, C, I, E, D, M, N, T, a } from "./t1";
export { v, f, C, E, D, a };
