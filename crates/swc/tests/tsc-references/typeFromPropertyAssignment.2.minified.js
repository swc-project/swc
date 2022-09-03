//// [a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var si, oi, Outer = function() {
    "use strict";
    function O() {
        _class_call_check(this, O);
    }
    return O.prototype.m = function(x, y) {}, O;
}();
Outer.Inner = function() {
    "use strict";
    function I() {
        _class_call_check(this, I);
    }
    return I.prototype.n = function(a, b) {}, I;
}(), si.m, oi.n;
