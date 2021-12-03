function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
M = null; // Error
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
C = null; // Error
var E;
(function(E1) {
    E1[E1["A"] = 0] = "A";
})(E || (E = {
}));
E = null; // Error
E.A = null; // OK per spec, Error per implementation (509581)
function fn() {
}
fn = null; // Should be error
var v;
v = null; // OK
function fn2(p) {
    p = null; // OK
}
I = null; // Error
