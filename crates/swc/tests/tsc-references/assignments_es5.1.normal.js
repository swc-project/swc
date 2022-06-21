import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
M = null; // Error
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C = null; // Error
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
E = null; // Error
E.A = null; // OK per spec, Error per implementation (509581)
function fn() {}
fn = null; // Should be error
var v;
v = null; // OK
function fn2(p) {
    p = null; // OK
}
I = null; // Error
