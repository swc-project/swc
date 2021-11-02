function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var a1 = null;
var b = null;
var c = null;
var d = null;
var e = null;
e = null; // ok
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
E1.A = null; // error
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var f;
f = null; // ok
C = null; // error
var g;
g = null; // ok
I = null; // error
var M1;
(function(M) {
    M.x = 1;
})(M1 || (M1 = {
}));
M1 = null; // error
var h = null;
function i(a) {
    a = null;
}
i = null; // error
