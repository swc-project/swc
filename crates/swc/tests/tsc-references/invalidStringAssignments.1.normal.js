//// [invalidStringAssignments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x = "";
var a = x;
var b = x;
var c = x;
var d = x;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var e = x;
var f = x;
var g = 1;
var g2 = 1;
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
function i(a) {
    a = x;
}
i = x;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
var j = x;
