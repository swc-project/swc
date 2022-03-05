import * as swcHelpers from "@swc/helpers";
M = null; // Error
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
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
