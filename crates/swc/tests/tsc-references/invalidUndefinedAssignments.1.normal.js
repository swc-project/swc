//// [invalidUndefinedAssignments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
E = x;
E.A = x;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var f;
C = x;
var g;
g = x;
I = x;
var M;
(function(M) {
    var x = 1;
    Object.defineProperty(M, "x", {
        enumerable: true,
        get: function get() {
            return x;
        },
        set: function set(v) {
            x = v;
        }
    });
})(M || (M = {}));
M = x;
function i(a) {}
// BUG 767030
i = x;
